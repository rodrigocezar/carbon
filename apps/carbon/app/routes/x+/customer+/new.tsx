import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import {
  CustomerForm,
  customerValidator,
  insertCustomer,
} from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "sales",
  });

  const validation = await customerValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const { id, ...data } = validation.data;

  const createCustomer = await insertCustomer(client, {
    ...data,
    createdBy: userId,
  });
  if (createCustomer.error) {
    return redirect(
      path.to.customers,
      await flash(
        request,
        error(createCustomer.error, "Failed to insert customer")
      )
    );
  }

  const customerId = createCustomer.data?.id;

  return redirect(path.to.customer(customerId));
}

export default function CustomersNewRoute() {
  const initialValues = {
    name: "",
  };
  return <CustomerForm initialValues={initialValues} />;
}
