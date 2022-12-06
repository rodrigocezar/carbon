import { ActionMenu, Table } from "@carbon/react";
import { Box, Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import type { EmployeeType } from "~/modules/Users/types";

type EmployeeTypesTableProps = {
  data: EmployeeType[];
};

const EmployeeTypesTable = memo(({ data }: EmployeeTypesTableProps) => {
  const navigate = useNavigate();
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
      />
    ),
    actions: (
      <Flex justifyContent="end">
        {!row.protected && (
          <ActionMenu>
            <MenuItem icon={<BsPencilSquare />}>Edit Employee Type</MenuItem>
            <MenuItem
              icon={<IoMdTrash />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/app/users/employee-types/delete/${row.id}`);
              }}
            >
              Delete Employee Type
            </MenuItem>
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
