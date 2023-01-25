import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/router";
import { requireResourcePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import {
  getFeatures,
  makeEmptyPermissionsFromFeatures,
} from "~/services/users";
import { error } from "~/utils/result";

export async function loader({ request }: LoaderArgs) {
  const authorized = await requireResourcePermissions(request, {
    view: "users",
  });
  if (!authorized) return json({ permissions: [] });

  const features = await getFeatures(authorized.client);
  if (features.error || features.data === null) {
    return json(
      {
        permissions: {},
      },
      await flash(request, error(features.error, "Failed to fetch features"))
    );
  }

  return json({
    permissions: makeEmptyPermissionsFromFeatures(features.data),
  });
}
