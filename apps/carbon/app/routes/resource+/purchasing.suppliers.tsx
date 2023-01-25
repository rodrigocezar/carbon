import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireResourcePermissions } from "~/services/auth";
import { getSuppliersList } from "~/services/purchasing";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requireResourcePermissions(request, {
    view: "purchasing",
  });
  if (!authorized) return json({ data: [] });

  return json(await getSuppliersList(authorized.client));
}
