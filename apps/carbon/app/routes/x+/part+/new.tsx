import { Grid } from "@chakra-ui/react";
import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import { useRouteData } from "~/hooks";
import type {
  PartGroupListItem,
  PartReplenishmentSystem,
  PartType,
  UnitOfMeasureListItem,
} from "~/modules/parts";
import { PartForm, partValidator, upsertPart } from "~/modules/parts";
import { requirePermissions } from "~/services/auth";
import { flash } from "~/services/session";
import { assertIsPost } from "~/utils/http";
import { error, success } from "~/utils/result";

export async function action({ request }: ActionArgs) {
  assertIsPost(request);
  const { client, userId } = await requirePermissions(request, {
    create: "parts",
  });

  const validation = await partValidator.validate(await request.formData());

  if (validation.error) {
    return validationError(validation.error);
  }

  const createPart = await upsertPart(client, {
    ...validation.data,
    active: true,
    createdBy: userId,
  });
  if (createPart.error) {
    return redirect(
      "/x/parts/search",
      await flash(request, error(createPart.error, "Failed to insert part"))
    );
  }

  const partId = createPart.data[0]?.id;

  return redirect(
    `/x/part/${partId}`,
    await flash(request, success("Created part"))
  );
}

export default function PartsNewRoute() {
  const routeData = useRouteData<{
    partGroups: PartGroupListItem[];
    partTypes: PartType[];
    partReplenishmentSystems: PartReplenishmentSystem[];
    unitOfMeasures: UnitOfMeasureListItem[];
  }>("/x/part");

  const initialValues = {
    name: "",
    description: "",
  };

  return (
    <Grid
      gridTemplateColumns={["1fr", "1fr", "2fr 4fr 2fr"]}
      gridColumnGap={8}
      w="full"
    >
      <div></div>
      <PartForm
        initialValues={initialValues}
        partGroups={routeData?.partGroups ?? []}
        partTypes={routeData?.partTypes ?? []}
        partReplenishmentSystems={routeData?.partReplenishmentSystems ?? []}
        unitOfMeasures={routeData?.unitOfMeasures ?? []}
      />
    </Grid>
  );
}