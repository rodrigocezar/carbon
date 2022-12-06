import { Select } from "@carbon/react";
import { Button, HStack, useColorModeValue } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { useUrlParams } from "~/hooks";
import { getSupabase } from "~/lib/supabase";
import { EmployeesTable } from "~/modules/Users";
import { getEmployees, getEmployeeTypes } from "~/services/users";
import { requireAuthSession } from "~/services/session";
import { mapRowsToOptions } from "~/utils/form";

export async function loader({ request }: LoaderArgs) {
  const { accessToken } = await requireAuthSession(request);
  const client = getSupabase(accessToken);

  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  const name = search.get("name");
  const type = search.get("type");

  const [employees, employeeTypes] = await Promise.all([
    getEmployees(client, { name, type }),
    getEmployeeTypes(client),
  ]);

  return json({ employees, employeeTypes });
}

export default function UsersEmployeesRoute() {
  const { employees, employeeTypes } = useLoaderData<typeof loader>();
  const [params, setParams] = useUrlParams();
  const navigate = useNavigate();

  const borderColor = useColorModeValue("gray.200", "gray.800");

  const employeeTypeOptions = mapRowsToOptions({
    data: employeeTypes.data,
    value: "id",
    label: "name",
  });

  return (
    <>
      <HStack
        px={4}
        py={3}
        justifyContent="space-between"
        borderBottomColor={borderColor}
        borderBottomStyle="solid"
        borderBottomWidth={1}
      >
        <HStack spacing={2}>
          <DebouncedInput
            param="name"
            size="sm"
            minW={180}
            placeholder="Search by name"
          />
          <Select
            // @ts-ignore
            size="sm"
            colorScheme="brand"
            minW={180}
            defaultValue={employeeTypeOptions.filter(
              (type) => type.value === params.get("type")
            )}
            isClearable
            options={employeeTypeOptions}
            onChange={(selected) => {
              setParams("type", selected?.value);
            }}
            placeholder="Employee Type"
          />
        </HStack>
        <HStack spacing={2}>
          <Button
            colorScheme="brand"
            onClick={() => {
              navigate("new");
            }}
            leftIcon={<IoMdAdd />}
          >
            New Employee
          </Button>
        </HStack>
      </HStack>
      <EmployeesTable data={employees.data ?? []} />

      <Outlet />
    </>
  );
}
