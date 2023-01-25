import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getEmployeeTypes } from "~/services/users";
import { requireResourcePermissions } from "~/services/auth";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requireResourcePermissions(request, {
    view: "users",
  });
  if (!authorized) return json({ data: [] });

  return json(await getEmployeeTypes(authorized.client));
}
