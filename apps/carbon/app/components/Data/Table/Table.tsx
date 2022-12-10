import { forwardRef, Fragment, useEffect, useRef } from "react";
import type { CheckboxProps, ThemeTypings } from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import { useColorModeValue } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  chakra,
} from "@chakra-ui/react";
import type { Column } from "react-table";
import { useTable, useSortBy, usePagination, useRowSelect } from "react-table";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

import type { EmptyProps } from "../Empty";
// import Empty from "../Empty";
import { Pagination } from "./components/Pagination";

type EmptyMessage = Partial<EmptyProps>;

interface TableProps<Data extends object> {
  columns: Column<Data>[];
  data: Data[];
  colorScheme?: ThemeTypings["colorSchemes"];
  emptyData?: EmptyMessage;
  selectableRows?: boolean;
  onRowClick?: (row: Data) => void;
  onSelectedRowsChange?: (rows: Data[]) => void;
}

const Table = <Data extends object>({
  data,
  columns,
  colorScheme = "brand",
  selectableRows,
  emptyData,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<Data>) => {
  const {
    canPreviousPage,
    canNextPage,
    headerGroups,
    page,
    pageOptions,
    pageCount,
    rows,
    selectedFlatRows,
    state: { pageIndex, pageSize },
    getTableProps,
    getTableBodyProps,
    gotoPage,
    nextPage,
    prepareRow,
    previousPage,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initalState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: "label", desc: true }],
      },
    },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      selectableRows &&
        hooks.visibleColumns.push((columns) => [
          // Let's make a column for selection
          {
            id: "selection",
            // The header can use the table's getToggleAllRowsSelectedProps method
            // to render a checkbox
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // The cell can use the individual row's getToggleRowSelectedProps method
            // to the render a checkbox
            Cell: ({ row }) => (
              <div>
                <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
              </div>
            ),
          },
          ...columns,
        ]);
    }
  );

  const rowBackground = useColorModeValue("gray.50", "whiteAlpha.100");
  useEffect(() => {
    if (typeof onSelectedRowsChange === "function") {
      onSelectedRowsChange(selectedFlatRows.map((row) => row.original));
    }
  }, [selectedFlatRows, onSelectedRowsChange]);

  return (
    <Box w="full">
      <ChakraTable {...getTableProps()}>
        <Thead>
          {headerGroups.map((headerGroup, headerIdx) => (
            <Tr
              {...headerGroup.getHeaderGroupProps()}
              key={`${headerGroup.id}-${headerIdx}`}
            >
              {headerGroup.headers.map((column) => (
                <Fragment key={column.id}>
                  <Th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    px={4}
                  >
                    <Flex
                      justify="flex-start"
                      align="center"
                      fontSize="xs"
                      color="gray.500"
                    >
                      {column.render("Header")}
                      <chakra.span pl="4">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <AiFillCaretDown aria-label="sorted descending" />
                          ) : (
                            <AiFillCaretUp aria-label="sorted ascending" />
                          )
                        ) : null}
                      </chakra.span>
                    </Flex>
                  </Th>
                </Fragment>
              ))}
            </Tr>
          ))}
        </Thead>
        {/* {rows.length === 0 ? (
          <Box w="full" position="absolute" py={10}>
            <Empty {...emptyData} text={emptyData?.text ?? "No Data"}>
              {emptyData?.children ?? null}
            </Empty>
          </Box>
        ) : ( */}
        <Tbody {...getTableBodyProps()}>
          {page.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <Tr
                {...row.getRowProps()}
                key={`${row.id}-${rowIndex}`}
                onClick={(row) => {
                  if (typeof onRowClick === "function") {
                    onRowClick(row.original);
                  }
                }}
                _hover={{
                  cursor:
                    typeof onRowClick === "function" ? "pointer" : undefined,
                  background: rowBackground,
                }}
              >
                {row.cells.map((cell, colIndex) => (
                  <Fragment key={`${cell.column.id}-${colIndex}`}>
                    <Td fontSize="sm" px={4} py={3} {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </Td>
                  </Fragment>
                ))}
              </Tr>
            );
          })}
        </Tbody>
        {/* )} */}
      </ChakraTable>
      {rows.length > 0 && (
        <Pagination
          pageIndex={pageIndex}
          pageSize={pageSize}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageCount={pageCount}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
          colorScheme={colorScheme}
        />
      )}
    </Box>
  );
};

type IndeterminateCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  [key: string]: any;
};

const IndeterminateCheckbox = forwardRef<
  HTMLInputElement,
  IndeterminateCheckboxProps
>(({ indeterminate, checked, ...rest }, ref) => {
  return (
    <Checkbox
      ref={ref}
      colorScheme="blackAlpha"
      isChecked={checked}
      isIndeterminate={indeterminate}
      {...rest}
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export default Table;
