import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { useUrlParams } from "~/hooks";
import { EquipmentTypeDetail, getEquipmentType } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "resources",
    role: "employee",
  });

  const { typeId } = params;
  if (!typeId) throw notFound("Invalid equipmentTypeId");

  const equipmentType = await getEquipmentType(client, typeId);
  if (equipmentType.error) {
    return redirect(
      path.to.equipment,
      await flash(
        request,
        error(equipmentType.error, "Failed to fetch equipment")
      )
    );
  }

  return json({ equipmentType: equipmentType.data });
}

export default function EquipmentTypeListRoute() {
  const { equipmentType } = useLoaderData<typeof loader>();
  const [params] = useUrlParams();
  const navigate = useNavigate();
  const onClose = () => navigate(`${path.to.equipment}?${params.toString()}`);

  return (
    <>
      <EquipmentTypeDetail equipmentType={equipmentType} onClose={onClose} />
      <Outlet />
    </>
  );
}
