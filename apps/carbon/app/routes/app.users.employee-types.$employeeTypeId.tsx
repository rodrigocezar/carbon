import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { EmployeeTypeForm } from "~/modules/Users";
import { requirePermissions } from "~/services/auth";
import {
  employeeTypeValidator,
  getEmployeeType,
  getPermissionsByEmployeeType,
  makePermissionsFromEmployeeType,
  employeeTypePermissionsValidator,
  upsertEmployeeType,
  upsertEmployeeTypePermissions,
} from "~/services/users";
import { setSessionFlash } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const { employeeTypeId } = params;
  if (!employeeTypeId) return redirect("/app/users/employee-types");

  const [employeeType, employeeTypePermissions] = await Promise.all([
    getEmployeeType(client, employeeTypeId),
    getPermissionsByEmployeeType(client, employeeTypeId),
  ]);

  if (employeeType?.data?.protected) {
    return redirect("/app/users/employee-types");
  }

  return json({
    employeeType,
    employeeTypePermissions: makePermissionsFromEmployeeType(
      employeeTypePermissions.data ?? []
    ),
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    update: "users",
  });

  const validation = await employeeTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, name, color, data } = validation.data;

  const permissions = JSON.parse(data);
  const jsonValidation =
    employeeTypePermissionsValidator.safeParse(permissions);
  if (jsonValidation.success === false) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: "Failed to parse permissions",
      })
    );
  }

  const updateEmployeeType = await upsertEmployeeType(client, {
    id,
    name,
    color: color || null,
  });

  if (updateEmployeeType.error) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: updateEmployeeType.error.message,
      })
    );
  }

  const updateEmployeeTypePermissions = await upsertEmployeeTypePermissions(
    client,
    id,
    permissions
  );

  if (updateEmployeeTypePermissions.error) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: updateEmployeeTypePermissions.error.message,
      })
    );
  }

  return redirect(
    "/app/users/employee-types",
    await setSessionFlash(request, {
      success: true,
      message: "Updated employee type",
    })
  );
}

export default function NewEmployeeTypesRoute() {
  const { employeeType, employeeTypePermissions } =
    useLoaderData<typeof loader>();

  const initialValues = {
    id: employeeType.data?.id ?? "",
    name: employeeType.data?.name ?? "",
    color: employeeType.data?.color ?? "#000000",
    permissions: employeeTypePermissions,
  };

  return <EmployeeTypeForm initialValues={initialValues} />;
}
