import type { ActionArgs, LoaderArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { validationError } from "remix-validated-form";
import { getSupabase } from "~/lib/supabase";
import { EmployeeTypeForm } from "~/modules/Users";
import { requirePermissions } from "~/services/auth";
import {
  employeeTypeValidator,
  getFeatures,
  makeEmptyPermissionsFromFeatures,
  employeeTypePermissionsValidator,
  upsertEmployeeType,
  upsertEmployeeTypePermissions,
} from "~/services/users";
import { requireAuthSession, setSessionFlash } from "~/services/session";
import { assertIsPost } from "~/utils/http";

export async function loader({ request }: LoaderArgs) {
  const { accessToken } = await requireAuthSession(request);
  const client = getSupabase(accessToken);

  const features = await getFeatures(client);
  if (features.error || features.data === null) {
    return redirect(
      "/app/users/employee-types",
      await setSessionFlash(request, {
        success: false,
        message: "Failed to fetch features",
      })
    );
  }

  return json({
    permissions: makeEmptyPermissionsFromFeatures(features.data),
  });
}

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client } = await requirePermissions(request, {
    create: "users",
  });

  const validation = await employeeTypeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const { name, color, data } = validation.data;

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

  const insertEmployeeType = await upsertEmployeeType(client, {
    name,
    color: color || null,
  });
  if (insertEmployeeType.error) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: insertEmployeeType.error.message,
      })
    );
  }

  const employeeTypeId = insertEmployeeType.data[0]?.id;
  if (!employeeTypeId) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: "Failed to created employee type",
      })
    );
  }
  const insertEmployeeTypePermissions = await upsertEmployeeTypePermissions(
    client,
    employeeTypeId,
    permissions
  );

  if (insertEmployeeTypePermissions.error) {
    return json(
      {},
      await setSessionFlash(request, {
        success: false,
        message: insertEmployeeTypePermissions.error.message,
      })
    );
  }

  return redirect(
    "/app/users/employee-types",
    await setSessionFlash(request, {
      success: true,
      message: "Employee type updated",
    })
  );
}

export default function NewEmployeeTypesRoute() {
  const { permissions } = useLoaderData<typeof loader>();

  const initialValues = {
    id: "",
    name: "",
    color: "#000000",
    permissions,
  };

  return <EmployeeTypeForm initialValues={initialValues} />;
}
