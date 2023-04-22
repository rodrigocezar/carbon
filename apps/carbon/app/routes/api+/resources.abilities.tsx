import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getAbilitiesList } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requirePermissions(request, {
    view: "resources",
  });

  return json(await getAbilitiesList(authorized.client));
}