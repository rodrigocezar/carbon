import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { useLoaderData, useNavigate, useParams } from "@remix-run/react";
import { ConfirmDelete } from "~/components/Modals";
import { deleteReceipt, getReceipt } from "~/modules/inventory";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { notFound } from "~/utils/http";
import { path } from "~/utils/path";
import { error, success } from "~/utils/result";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "inventory",
  });
  const { receiptId } = params;
  if (!receiptId) throw notFound("receiptId not found");

  const receipt = await getReceipt(client, receiptId);
  if (receipt.error) {
    return redirect(
      path.to.receipts,
      await flash(request, error(receipt.error, "Failed to get receipt"))
    );
  }

  return json({ receipt: receipt.data });
}

export async function action({ request, params }: ActionFunctionArgs) {
  const { client } = await requirePermissions(request, {
    delete: "inventory",
  });

  const { receiptId } = params;
  if (!receiptId) {
    return redirect(
      path.to.receipts,
      await flash(request, error(params, "Failed to get an receipt id"))
    );
  }

  // make sure the receipt has not been posted
  const { error: getReceiptError, data: receipt } = await getReceipt(
    client,
    receiptId
  );
  if (getReceiptError) {
    return redirect(
      path.to.receipts,
      await flash(request, error(getReceiptError, "Failed to get receipt"))
    );
  }

  if (receipt?.postingDate) {
    return redirect(
      path.to.receipts,
      await flash(
        request,
        error(getReceiptError, "Cannot delete a posted receipt")
      )
    );
  }

  const { error: deleteReceiptError } = await deleteReceipt(client, receiptId);
  if (deleteReceiptError) {
    return redirect(
      path.to.receipts,
      await flash(
        request,
        error(deleteReceiptError, "Failed to delete receipt")
      )
    );
  }

  return redirect(
    path.to.receipts,
    await flash(request, success("Successfully deleted receipt"))
  );
}

export default function DeleteShippingMethodRoute() {
  const { receiptId } = useParams();
  const { receipt } = useLoaderData<typeof loader>();
  const navigate = useNavigate();

  if (!receipt) return null;
  if (!receiptId) throw new Error("receiptId not found");

  const onCancel = () => navigate(path.to.receipts);

  return (
    <ConfirmDelete
      action={path.to.deleteReceipt(receiptId)}
      name={receipt.receiptId}
      text={`Are you sure you want to delete the receipt: ${receipt.receiptId}? This cannot be undone.`}
      onCancel={onCancel}
    />
  );
}
