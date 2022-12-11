import { forwardRef, Fragment, useEffect } from "react";
import type { ThemeTypings } from "@chakra-ui/react";
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
import { useTable, useSortBy, useRowSelect } from "react-table";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { Pagination } from "./components/Pagination";
import { useUrlParams } from "~/hooks";
import { parseNumberFromUrlParam } from "~/utils/http";

interface TableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  count: number;
  colorScheme?: ThemeTypings["colorSchemes"];
  selectableRows?: boolean;
  onRowClick?: (row: T) => void;
  onSelectedRowsChange?: (rows: T[]) => void;
}

const Table = <T extends object>({
  data,
  columns,
  count,
  colorScheme = "blackAlpha",
  selectableRows,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<T>) => {
  const {
    headerGroups,
    rows,
    selectedFlatRows,
    getTableProps,
    getTableBodyProps,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy,
    useRowSelect,
    (hooks) => {
      selectableRows &&
        hooks.visibleColumns.push((columns) => [
          {
            id: "selection",
            Header: ({ getToggleAllRowsSelectedProps }) => (
              <div>
                <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
              </div>
            ),
            // @ts-ignore
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

  const [params, setParams] = useUrlParams();
  const limit = parseNumberFromUrlParam(params, "limit", 10);
  const offset = parseNumberFromUrlParam(params, "offset", 0);

  const pageIndex = Math.floor(offset / limit) + 1;
  const pageCount = Math.ceil(count / limit);
  const canPreviousPage = pageIndex > 1;
  const canNextPage = pageIndex < Math.ceil(count / limit);

  const gotoPage = (page: number) => {
    setParams({
      offset: (page - 1) * limit,
      limit,
    });
  };

  const previousPage = () => {
    gotoPage(pageIndex - 1);
  };

  const nextPage = () => {
    gotoPage(pageIndex + 1);
  };

  const setPageSize = (pageSize: number) => {
    setParams({
      offset: 0,
      limit: pageSize,
    });
  };

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
          {rows.map((row, rowIndex) => {
            prepareRow(row);
            return (
              <Tr
                {...row.getRowProps()}
                key={`${row.id}-${rowIndex}`}
                onClick={() => {
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
          count={count}
          offset={offset}
          pageIndex={pageIndex}
          pageSize={limit}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
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
      ml={2}
      {...rest}
    />
  );
});

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

export default Table;
