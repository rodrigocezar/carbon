import { ActionMenu, Table } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { usePermissions } from "~/hooks";
import type { EmployeeType } from "~/modules/Users/types";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
};

const EmployeeTypesTable = memo(({ data }: EmployeeTypesTableProps) => {
  const navigate = useNavigate();
  const permissions = usePermissions();

  const rows = data.map((row) => ({
    id: row.id,
    protected: row.protected,
    name: row.name,
    color: (
      <Box
        aria-label="Color"
        w={6}
        h={6}
        borderRadius="md"
        bg={row.color ?? "#000000"}
        role="img"
      />
    ),
    actions: (
      <Flex justifyContent="end">
        {!row.protected &&
          (permissions.can("update", "users") ||
            permissions.can("delete", "users")) && (
            <ActionMenu>
              {permissions.can("update", "users") && (
                <MenuItem icon={<BsPencilSquare />}>
                  Edit Employee Type
                </MenuItem>
              )}
              {permissions.can("delete", "users") && (
                <MenuItem
                  icon={<IoMdTrash />}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/app/users/employee-types/delete/${row.id}`);
                  }}
                >
                  Delete Employee Type
                </MenuItem>
              )}
            </ActionMenu>
          )}
      </Flex>
    ),
  }));
  return (
    <Table
      rows={rows}
      columns={[
        {
          Header: "Employee Type",
          accessor: "name",
        },
        {
          Header: "Color",
          accessor: "color",
        },
        {
          Header: <VisuallyHidden>Actions</VisuallyHidden>,
          accessor: "actions",
        },
      ]}
      onRowClick={(row) => {
        if (!row.protected) navigate(`/app/users/employee-types/${row.id}`);
      }}
    />
  );
});

EmployeeTypesTable.displayName = "EmployeeTypesTable";
export default EmployeeTypesTable;
