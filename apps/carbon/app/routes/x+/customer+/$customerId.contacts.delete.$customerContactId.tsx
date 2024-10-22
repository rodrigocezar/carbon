import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { deleteCustomerContact } from "~/modules/sales";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "sales",
  });

  const { customerId, customerContactId } = params;
  if (!customerId || !customerContactId) {
    return redirect(
      path.to.customers,
      await flash(request, error(params, "Failed to get a customer contact id"))
    );
  }

  // TODO: check whether this person has an account or is a partner first

  const { error: deleteCustomerContactError } = await deleteCustomerContact(
    client,
    customerId,
    customerContactId
  );
  if (deleteCustomerContactError) {
    return redirect(
      path.to.customerContacts(customerId),
      await flash(
        request,
        error(deleteCustomerContactError, "Failed to delete customer contact")
      )
    );
  }

  return redirect(
    path.to.customerContacts(customerId),
    await flash(request, success("Successfully deleted customer contact"))
  );
}
