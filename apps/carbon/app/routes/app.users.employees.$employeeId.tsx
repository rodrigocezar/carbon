import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { EmployeePermissionsForm } from "~/modules/Users";
import { requirePermissions } from "~/services/auth";
import { setSessionFlash } from "~/services/session";
import {
  employeePermissionsValidator,
  employeeValidator,
  getClaimsById,
  getEmployeeById,
  makePermissionsFromClaims,
  updateEmployee,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const { employeeId } = params;
  if (!employeeId) return redirect("/app/users/employees");

  const [claims, employee] = await Promise.all([
    getClaimsById(client, employeeId),
    getEmployeeById(client, employeeId),
  ]);

  if (claims.error || employee.error || claims.data === null) {
    redirect(
      "/app/users/employees",
      await setSessionFlash(request, {
        success: false,
        message: "Failed to fetch employee data",
      })
    );
  }

  const permissions = makePermissionsFromClaims(claims?.data);
  if (permissions === null) {
    redirect(
      "/app/users/employees",
      await setSessionFlash(request, {
        success: false,
        message: "Failed to parse permissions",
      })
    );
  }

  return json({
    permissions,
    employee: employee.data,
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await employeeValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, employeeType, data } = validation.data;
  const permissions = JSON.parse(data);
  if (
    !Object.values(permissions).every(
      (permission) => employeePermissionsValidator.safeParse(permission).success
    )
  ) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: "Failed to parse permissions",
      })
    );
  }

  const result = await updateEmployee(client, {
    id,
    employeeType,
    permissions,
  });

  return redirect(
    "/app/users/employees",
    await setSessionFlash(request, result)
  );
}

export default function UsersEmployeeRoute() {
  const { permissions, employee } = useLoaderData<typeof loader>();

  if (Array.isArray(employee?.user) || Array.isArray(employee?.employeeType)) {
    throw new Error("Expected single user and employee type");
  }

  const initialValues = {
    id: employee?.id || "",
    employeeType: employee?.employeeType?.id || "",
    permissions: permissions || {},
  };

  return (
    <EmployeePermissionsForm
      name={`${employee?.user?.firstName} ${employee?.user?.lastName}`}
      initialValues={initialValues}
    />
  );
}
