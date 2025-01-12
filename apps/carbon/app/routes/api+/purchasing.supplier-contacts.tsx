import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupplierContacts } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderFunctionArgs) {
  const authorized = await requirePermissions(request, {
    view: "purchasing",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const supplierId = searchParams.get("supplierId") as string;

  if (!supplierId || supplierId === "undefined")
    return json({
      data: [],
    });

  const contacts = await getSupplierContacts(authorized.client, supplierId);
  if (contacts.error) {
    return json(
      contacts,
      await flash(
        request,
        error(contacts.error, "Failed to get supplier contacts")
      )
    );
  }

  return json(contacts);
}
