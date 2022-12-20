import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import {
  EmployeeTypesTable,
  EmployeeTypesTableFilters,
} from "~/modules/Users/EmployeeTypes";
import { requirePermissions } from "~/services/auth";
import { getEmployeeTypes } from "~/services/users";
import { getPaginationParams } from "~/utils/http";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const { limit, offset } = getPaginationParams(searchParams);

  return json(await getEmployeeTypes(client, { name, limit, offset }));
}

export default function EmployeeTypesRoute() {
  const { data, count } = useLoaderData<typeof loader>();

  return (
    <>
      <EmployeeTypesTableFilters />
      <EmployeeTypesTable data={data ?? []} count={count ?? 0} />
      <Outlet />
    </>
  );
}
