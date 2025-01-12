import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { upsertWorkCell, workCellValidator } from "~/modules/resources";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { path } from "~/utils/path";
import { error } from "~/utils/result";

export async function action({ request }: ActionFunctionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "resources",
  });

  const validation = await workCellValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const {
    name,
    description,
    workCellTypeId,
    locationId,
    departmentId,
    activeDate,
  } = validation.data;

  const insertWorkCell = await upsertWorkCell(client, {
    name,
    description,
    workCellTypeId,
    locationId,
    departmentId,
    activeDate,
    createdBy: userId,
  });
  if (insertWorkCell.error) {
    return json(
      {},
      await flash(
        request,
        error(insertWorkCell.error, "Failed to create work cell")
      )
    );
  }

  return redirect(path.to.workCells);
}
