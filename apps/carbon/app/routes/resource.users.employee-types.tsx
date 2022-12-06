import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { getSupabase } from "~/lib/supabase";
import { getEmployeeTypes } from "~/services/users";
import { requireAuthSession } from "~/services/session";

export async function loader({ request }: LoaderArgs) {
  const { accessToken } = await requireAuthSession(request);
  const client = getSupabase(accessToken);

  return json(await getEmployeeTypes(client));
}
