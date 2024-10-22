import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteSupplierType, getSupplierType } from "~/modules/purchasing";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    view: "purchasing",
    role: "employee",
  });
  const { supplierTypeId } = params;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const supplierType = await getSupplierType(client, supplierTypeId);
  if (supplierType.error) {
    return redirect(
      path.to.supplierTypes,
      await flash(
        request,
        error(supplierType.error, "Failed to get supplier type")
      )
    );
  }

  return json({ supplierType: supplierType.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "purchasing",
  });

  const { supplierTypeId } = params;
  if (!supplierTypeId) {
    return redirect(
      path.to.supplierTypes,
      await flash(request, error(params, "Failed to get an supplier type id"))
    );
  }

  const { error: deleteTypeError } = await deleteSupplierType(
    client,
    supplierTypeId
  );
  if (deleteTypeError) {
    return redirect(
      path.to.supplierTypes,
      await flash(
        request,
        error(deleteTypeError, "Failed to delete supplier type")
      )
    );
  }

  return redirect(
    path.to.supplierTypes,
    await flash(request, success("Successfully deleted supplier type"))
  );
}

export default function DeleteSupplierTypeRoute() {
  const { supplierTypeId } = useParams();
  const { supplierType } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!supplierType) return null;
  if (!supplierTypeId) throw notFound("supplierTypeId not found");

  const onCancel = () => navigate(path.to.supplierTypes);
  return (
    <ConfirmDelete
      action={path.to.deleteSupplierType(supplierTypeId)}
      name={supplierType.name}
      text={`Are you sure you want to delete the supplier type: ${supplierType.name}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
