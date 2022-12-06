import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { requireAuthSession, setSessionFlash } from "~/services/session";
import {
  createEmployeeAccount,
  createEmployeeValidator,
} from "~/services/users";
import { assertIsPost } from "~/utils/http";
import { getSupabase } from "~/lib/supabase";
import { CreateEmployeeModal } from "~/modules/Users";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { accessToken } = await requireAuthSession(request);

  const validation = await createEmployeeValidator.validate(
    await request.formData()
  );

  if (validation.error) {
    return validationError(validation.error);
  }

  const client = getSupabase(accessToken);
  const { email, firstName, lastName, employeeType } = validation.data;
  const result = await createEmployeeAccount(client, {
    email,
    firstName,
    lastName,
    employeeType,
  });

  return redirect(
    "/app/users/employees",
    await setSessionFlash(request, result)
  );
}

export default function () {
  return <CreateEmployeeModal />;
}
