import { ActionMenu, Table } from "@carbon/react";
import { Flex, MenuItem, VisuallyHidden } from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import { memo } from "react";
import { BsPencilSquare } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import type { Employee } from "../types";

type EmployeesTableProps = {
  data: Employee[];
};

const EmployeesTable = memo(({ data }: EmployeesTableProps) => {
  const navigate = useNavigate();
  const rows = data.map(({ User, EmployeeType }) => {
    if (
      User === null ||
      EmployeeType === null ||
      Array.isArray(User) ||
      Array.isArray(EmployeeType)
    )
      throw new Error("Expected user and employee type to be objects");
    return {
      id: User.id,
      firstName: User.firstName,
      lastName: User.lastName,
      email: User.email,
      employeeType: EmployeeType.name,
      actions: (
        <Flex justifyContent="end">
          <ActionMenu>
            <MenuItem icon={<BsPencilSquare />}>Edit Permissions</MenuItem>
            <MenuItem
              icon={<IoMdTrash />}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/app/users/employeess/deactivate/${User.id}`);
              }}
            >
              Deactivate Employee
            </MenuItem>
          </ActionMenu>
        </Flex>
      ),
    };
  });

  return (
    <Table
      rows={rows}
      columns={[
        {
          Header: "First Name",
          accessor: "firstName",
        },
        {
          Header: "Last Name",
          accessor: "lastName",
        },
        {
          Header: "Email",
          accessor: "email",
        },
        {
          Header: "Employee Type",
          accessor: "employeeType",
        },
        {
          Header: <VisuallyHidden>Actions</VisuallyHidden>,
          accessor: "actions",
        },
      ]}
      onRowClick={(row) => {
        navigate(`/app/users/employees/${row.id}`);
      }}
    />
  );
});

EmployeesTable.displayName = "EmployeeTable";

export default EmployeesTable;
