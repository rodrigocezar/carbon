import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { getSupabase } from "~/lib/supabase";
import { EmployeePermissionsForm } from "~/modules/Users";
import { requireAuthSession, setSessionFlash } from "~/services/session";
import {
  employeeValidator,
  getClaimsById,
  getUserById,
  makePermissionsFromClaims,
  updatePermissions,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";

export async function loader({ request, params }: LoaderArgs) {
  const { accessToken } = await requireAuthSession(request);

  const { employeeId } = params;
  if (!employeeId) return redirect("/app/users/employees");

  const client = getSupabase(accessToken);
  const [claims, employee] = await Promise.all([
    getClaimsById(client, employeeId),
    getUserById(client, employeeId),
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
  const { accessToken } = await requireAuthSession(request);
  const validation = await employeeValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, data } = validation.data;
  const permissions = JSON.parse(data);

  // TODO: io-ts validation on permissions

  const client = getSupabase(accessToken);
  const result = await updatePermissions(client, {
    id,
    permissions,
  });

  return redirect(
    "/app/users/employees",
    await setSessionFlash(request, result)
  );
}

export default function UsersEmployeeRoute() {
  const { permissions, employee } = useLoaderData<typeof loader>();

  const initialValues = {
    id: employee?.id || "",
    permissions: permissions || {},
  };

  return (
    <EmployeePermissionsForm
      name={`${employee?.firstName} ${employee?.lastName}`}
      initialValues={initialValues}
    />
  );
}
