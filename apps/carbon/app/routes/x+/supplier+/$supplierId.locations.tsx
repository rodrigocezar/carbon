import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { getSupplierLocations, SupplierLocations } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
  });

  const { supplierId } = params;
  if (!supplierId) throw new Error("Could not find supplierId");

  const locations = await getSupplierLocations(client, supplierId);
  if (locations.error) {
    return redirect(
      path.to.supplier(supplierId),
      await flash(
        request,
        error(locations.error, "Failed to fetch supplier locations")
      )
    );
  }

  return json({
    locations: locations.data ?? [],
  });
}

export default function SupplierLocationsRoute() {
  const { locations } = useLoaderData<typeof loader>();

  return <SupplierLocations locations={locations} />;
}
