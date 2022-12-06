import {
  Box,
  Button,
  HStack,
  Input,
  Select,
  useColorModeValue,
} from "@chakra-ui/react";
import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData } from "@remix-run/react";
import { IoMdAdd } from "react-icons/io";
import { usePermissions } from "~/hooks";
import { EmployeeTypesTable } from "~/modules/Users";
import { requirePermissions } from "~/services/auth";
import { getEmployeeTypes } from "~/services/users";

export async function loader({ request }: LoaderArgs) {
  const { client } = await requirePermissions(request, {
    view: "users",
  });

  return json(await getEmployeeTypes(client));
}

export default function EmployeeTypesRoute() {
  const { data } = useLoaderData<typeof loader>();
  const permissions = usePermissions();
  const borderColor = useColorModeValue("gray.200", "gray.800");

  return (
    <>
      <Box>
        <HStack
          px={4}
          py={3}
          justifyContent="space-between"
          borderBottomColor={borderColor}
          borderBottomStyle="solid"
          borderBottomWidth={1}
        >
          <HStack spacing={2}>
            <Input size="sm" borderRadius="md" placeholder="Search by name" />
            <Select size="sm" borderRadius="md">
              <option>Filter</option>
            </Select>
          </HStack>
          <HStack spacing={2}>
            {permissions.can("create", "users") && (
              <Button
                as={Link}
                to="new"
                colorScheme="brand"
                leftIcon={<IoMdAdd />}
              >
                New Employee Type
              </Button>
            )}
          </HStack>
        </HStack>
        <EmployeeTypesTable data={data ?? []} />
      </Box>
      <Outlet />
    </>
  );
}
