import { Select } from "@carbon/react";
import { Button, HStack, useColorModeValue } from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Outlet, useLoaderData, useNavigate } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { DebouncedInput } from "~/components/Search";
import { usePermissions, useUrlParams } from "~/hooks";
import { EmployeesTable } from "~/modules/Users";
import { requirePermissions } from "~/services/auth";
import { getEmployees, getEmployeeTypes } from "~/services/users";
import { mapRowsToOptions } from "~/utils/form";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const name = searchParams.get("name");
  const type = searchParams.get("type");

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
  const permissions = usePermissions();

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
          {permissions.can("create", "users") && (
            <Button
              colorScheme="brand"
              onClick={() => {
                navigate("new");
              }}
              leftIcon={<IoMdAdd />}
            >
              New Employee
            </Button>
          )}
        </HStack>
      </HStack>
      <EmployeesTable data={employees.data ?? []} />

      <Outlet />
    </>
  );
}
