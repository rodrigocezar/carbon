import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireResourcePermissions } from "~/services/auth";
import { getCustomersList } from "~/services/sales";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requireResourcePermissions(request, {
    view: "sales",
  });
  if (!authorized) return json({ data: [] });

  return json(await getCustomersList(authorized.client));
}
