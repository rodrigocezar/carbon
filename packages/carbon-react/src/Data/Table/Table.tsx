import { Fragment } from "react";
import type { ThemeTypings } from "@chakra-ui/react";
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
import { useTable, useSortBy, usePagination } from "react-table";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";

import type { EmptyProps } from "../Empty";
// import Empty from "../Empty";
import { Pagination } from "./components/Pagination";

type EmptyMessage = Partial<EmptyProps>;

interface TableProps<Data extends object> {
  columns: Column<Data>[];
  rows: Data[];
  colorScheme?: ThemeTypings["colorSchemes"];
  emptyData?: EmptyMessage;
  onRowClick?: (row: Data) => void;
}

const Table = <Data extends object>({
  rows,
  columns,
  colorScheme = "brand",
  emptyData,
  onRowClick,
}: TableProps<Data>) => {
  const {
    canPreviousPage,
    canNextPage,
    headerGroups,
    page,
    pageOptions,
    pageCount,
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
      data: rows,
      initalState: {
        pageIndex: 0,
        pageSize: 10,
        sortBy: [{ id: "label", desc: true }],
      },
    },
    useSortBy,
    usePagination
  );

  const rowBackground = useColorModeValue("gray.50", "whiteAlpha.100");

  return (
    <Box w="full" h="100%">
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
                onClick={() => {
                  if (typeof onRowClick === "function")
                    onRowClick(row.original);
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

export default Table;
