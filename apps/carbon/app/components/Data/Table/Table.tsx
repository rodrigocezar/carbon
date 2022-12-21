import { useColor } from "@carbon/react";
import type { ThemeTypings } from "@chakra-ui/react";
import { chakra } from "@chakra-ui/react";
import { Button } from "@chakra-ui/react";
import { MenuButton, MenuList } from "@chakra-ui/react";
import { Menu } from "@chakra-ui/react";
import { MenuItem } from "@chakra-ui/react";
import { useDisclosure } from "@chakra-ui/react";
import { Grid } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { HStack } from "@chakra-ui/react";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { List, ListItem } from "@chakra-ui/react";
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Text,
} from "@chakra-ui/react";
import { Checkbox } from "@chakra-ui/react";
import {
  Box,
  Flex,
  Table as ChakraTable,
  Thead,
  Tbody,
  Tr as ChakraTr,
  Th as ChakraTh,
  Td as ChakraTd,
} from "@chakra-ui/react";
import type {
  Column,
  ColumnDef,
  ColumnOrderState,
  ColumnPinningState,
  RowSelectionState,
} from "@tanstack/react-table";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

import { AiFillCaretUp, AiFillCaretDown } from "react-icons/ai";
import { Pagination, PaginationButtons, usePagination } from "./components";
import { MdOutlineDragIndicator } from "react-icons/md";
import {
  BsChevronDown,
  BsEyeFill,
  BsEyeSlash,
  BsLayoutThreeColumns,
  BsPin,
  BsPinFill,
} from "react-icons/bs";
import { useUrlParams } from "~/hooks";

interface Action<T> {
  label: string;
  onClick: (rows: T[]) => void;
  disabled?: boolean;
  icon?: JSX.Element;
}
interface TableProps<T extends object> {
  columns: ColumnDef<T>[];
  data: T[];
  actions?: Action<T>[];
  count?: number;
  colorScheme?: ThemeTypings["colorSchemes"];
  defaultColumnVisibility?: Record<string, boolean>;
  withColumnOrdering?: boolean;
  withPagination?: boolean;
  withSelectableRows?: boolean;
  onRowClick?: (row: T) => void;
  onSelectedRowsChange?: (selectedRows: T[]) => void;
}

const Table = <T extends object>({
  data,
  columns,
  actions = [],
  count = 0,
  colorScheme = "blackAlpha",
  defaultColumnVisibility = {},
  withColumnOrdering = false,
  withPagination = true,
  withSelectableRows = false,
  onRowClick,
  onSelectedRowsChange,
}: TableProps<T>) => {
  const [params, setParams] = useUrlParams();

  const toggleSortBy = (columnId: string) => {
    const existingSort = params.getAll("sort");
    const sortAsc = `${columnId}:asc`;
    const sortDesc = `${columnId}:desc`;

    if (existingSort.includes(sortAsc)) {
      setParams({
        sort: existingSort.filter((s) => s !== sortAsc).concat(sortDesc),
      });
    } else if (existingSort.includes(sortDesc)) {
      setParams({ sort: existingSort.filter((s) => s !== sortDesc) });
    } else {
      setParams({ sort: existingSort.concat(sortAsc) });
    }
  };

  const isSorted = (columnId: string): -1 | null | 1 => {
    const existingSort = params.getAll("sort");

    if (existingSort.includes(`${columnId}:asc`)) return 1;
    if (existingSort.includes(`${columnId}:desc`)) return -1;
    return null;
  };

  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  if (withSelectableRows) columns.unshift(getSelectableColumn<T>());

  const pagination = usePagination(count, setRowSelection);

  const columnOrderingDrawer = useDisclosure();
  const [columnVisibility, setColumnVisibility] = useState(
    defaultColumnVisibility
  );

  const [columnOrder, setColumnOrder] = useState<ColumnOrderState>([]);
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(
    withColumnOrdering
      ? {
          left: ["select"],
          // right: ["id"],
        }
      : {}
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility,
      columnOrder,
      columnPinning,
    },
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
  });

  const selectedRows = withSelectableRows
    ? table.getSelectedRowModel().flatRows.map((row) => row.original)
    : [];

  useEffect(() => {
    setColumnOrder(table.getAllLeafColumns().map((column) => column.id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (typeof onSelectedRowsChange === "function") {
      onSelectedRowsChange(selectedRows);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection, onSelectedRowsChange]);

  const rows = table.getRowModel().rows;
  const defaultBackground = useColor("white");
  const rowBackground = useColor("gray.50");
  const borderColor = useColor("gray.200");

  return (
    <>
      {(withColumnOrdering || withSelectableRows) && (
        <HStack
          px={4}
          py={3}
          justifyContent="space-between"
          borderBottomColor={borderColor}
          borderBottomStyle="solid"
          borderBottomWidth={1}
          w="full"
        >
          <HStack spacing={2}>
            {withSelectableRows && actions.length > 0 && (
              <Menu isLazy>
                <MenuButton
                  as={Button}
                  rightIcon={<BsChevronDown />}
                  disabled={selectedRows.length === 0}
                  colorScheme="gray"
                  variant="outline"
                >
                  Actions
                </MenuButton>
                <MenuList fontSize="sm" boxShadow="xl">
                  {actions.map((action) => (
                    <MenuItem
                      key={action.label}
                      onClick={() => action.onClick(selectedRows)}
                      disabled={action.disabled}
                      icon={action.icon}
                    >
                      {action.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </Menu>
            )}
          </HStack>
          <HStack spacing={2}>
            {withColumnOrdering && (
              <Button
                onClick={columnOrderingDrawer.onOpen}
                variant="ghost"
                leftIcon={<BsLayoutThreeColumns />}
              >
                Columns
              </Button>
            )}
            {withPagination && <PaginationButtons {...pagination} condensed />}
          </HStack>
        </HStack>
      )}
      <Box w="full" h="full">
        <Box h="full" overflow="scroll" style={{ contain: "strict" }}>
          <Grid
            w="full"
            gridTemplateColumns={withColumnOrdering ? "auto 1fr auto" : "1fr"}
          >
            {/* Pinned left columns */}
            {withColumnOrdering ? (
              <ChakraTable
                bg={defaultBackground}
                borderRightColor={borderColor}
                borderRightStyle="solid"
                borderRightWidth={4}
                position="sticky"
                left={0}
              >
                <Thead h={10}>
                  {table.getLeftHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        // TODO: improve this
                        const sortable =
                          "accessorKey" in header.column.columnDef;
                        const sorted = isSorted(
                          // @ts-ignore
                          header.column.columnDef?.accessorKey ?? ""
                        );
                        return (
                          <Th
                            key={header.id}
                            layout
                            onClick={
                              sortable
                                ? () =>
                                    toggleSortBy(
                                      // @ts-ignore
                                      header.column.columnDef?.accessorKey ?? ""
                                    )
                                : undefined
                            }
                            cursor={sortable ? "pointer" : undefined}
                            transition={spring}
                            colSpan={header.colSpan}
                            px={4}
                            py={2}
                            whiteSpace="nowrap"
                          >
                            <Flex
                              justify="flex-start"
                              align="center"
                              fontSize="xs"
                              color="gray.500"
                            >
                              {flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                              <chakra.span pl="4">
                                {sorted ? (
                                  sorted === -1 ? (
                                    <AiFillCaretDown aria-label="sorted descending" />
                                  ) : (
                                    <AiFillCaretUp aria-label="sorted ascending" />
                                  )
                                ) : null}
                              </chakra.span>
                            </Flex>
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  <AnimatePresence>
                    {rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          exit={{ opacity: 0 }}
                          layout
                          transition={spring}
                          onClick={() => {
                            if (typeof onRowClick === "function") {
                              onRowClick(row.original);
                            }
                          }}
                          _hover={{
                            cursor:
                              typeof onRowClick === "function"
                                ? "pointer"
                                : undefined,
                            background: rowBackground,
                          }}
                        >
                          {row.getLeftVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                layout
                                transition={spring}
                                fontSize="sm"
                                px={4}
                                py={2}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </AnimatePresence>
                </Tbody>
              </ChakraTable>
            ) : null}

            {/* Unpinned columns */}
            <ChakraTable>
              <Thead h={10}>
                {(withColumnOrdering
                  ? table.getCenterHeaderGroups()
                  : table.getHeaderGroups()
                ).map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const sortable = "accessorKey" in header.column.columnDef;
                      const sorted = isSorted(
                        // @ts-ignore
                        header.column.columnDef?.accessorKey ?? ""
                      );

                      return (
                        <Th
                          key={header.id}
                          colSpan={header.colSpan}
                          onClick={
                            sortable
                              ? () =>
                                  toggleSortBy(
                                    // @ts-ignore
                                    header.column.columnDef?.accessorKey ?? ""
                                  )
                              : undefined
                          }
                          cursor={sortable ? "pointer" : undefined}
                          layout
                          transition={spring}
                          px={4}
                          py={3}
                          w={header.getSize()}
                          whiteSpace="nowrap"
                        >
                          <Flex
                            justify="flex-start"
                            align="center"
                            fontSize="xs"
                            color="gray.500"
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            <chakra.span pl="4">
                              {sorted ? (
                                sorted === -1 ? (
                                  <AiFillCaretDown aria-label="sorted descending" />
                                ) : (
                                  <AiFillCaretUp aria-label="sorted ascending" />
                                )
                              ) : null}
                            </chakra.span>
                          </Flex>
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                <AnimatePresence>
                  {rows.map((row) => {
                    return (
                      <Tr
                        key={row.id}
                        exit={{ opacity: 0 }}
                        layout
                        transition={spring}
                        onClick={() => {
                          if (typeof onRowClick === "function") {
                            onRowClick(row.original);
                          }
                        }}
                        _hover={{
                          cursor:
                            typeof onRowClick === "function"
                              ? "pointer"
                              : undefined,
                          background: rowBackground,
                        }}
                      >
                        {(withColumnOrdering
                          ? row.getCenterVisibleCells()
                          : row.getVisibleCells()
                        ).map((cell) => {
                          return (
                            <Td
                              key={cell.id}
                              fontSize="sm"
                              layout
                              transition={spring}
                              px={4}
                              py={withColumnOrdering ? 3 : 2}
                              whiteSpace="nowrap"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </Td>
                          );
                        })}
                      </Tr>
                    );
                  })}
                </AnimatePresence>
              </Tbody>
            </ChakraTable>

            {/* Pinned right columns */}
            {withColumnOrdering ? (
              <ChakraTable
                bg={defaultBackground}
                borderLeftColor={borderColor}
                borderLeftStyle="solid"
                borderLeftWidth={4}
                // position="sticky"
                // right={0}
              >
                <Thead h={10}>
                  {table.getRightHeaderGroups().map((headerGroup) => (
                    <Tr key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <Th
                            key={header.id}
                            layout
                            transition={spring}
                            colSpan={header.colSpan}
                            px={4}
                            py={3}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                          </Th>
                        );
                      })}
                    </Tr>
                  ))}
                </Thead>
                <Tbody>
                  <AnimatePresence>
                    {rows.map((row) => {
                      return (
                        <Tr
                          key={row.id}
                          exit={{ opacity: 0 }}
                          layout
                          transition={spring}
                          onClick={() => {
                            if (typeof onRowClick === "function") {
                              onRowClick(row.original);
                            }
                          }}
                          _hover={{
                            cursor:
                              typeof onRowClick === "function"
                                ? "pointer"
                                : undefined,
                            background: rowBackground,
                          }}
                        >
                          {row.getRightVisibleCells().map((cell) => {
                            return (
                              <Td
                                key={cell.id}
                                layout
                                transition={spring}
                                fontSize="sm"
                                px={4}
                                py={2}
                              >
                                {flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                              </Td>
                            );
                          })}
                        </Tr>
                      );
                    })}
                  </AnimatePresence>
                </Tbody>
              </ChakraTable>
            ) : null}
          </Grid>
        </Box>
      </Box>
      {withPagination && (
        <Pagination {...pagination} colorScheme={colorScheme} />
      )}
      {withColumnOrdering && (
        <Drawer
          isOpen={columnOrderingDrawer.isOpen}
          placement="right"
          onClose={columnOrderingDrawer.onClose}
        >
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Edit columns</DrawerHeader>

            <DrawerBody>
              <List
                as={Reorder.Group}
                axis="y"
                values={columnOrder}
                onReorder={(newOrder: ColumnOrderState) => {
                  if (withSelectableRows) newOrder.unshift("select");
                  setColumnOrder(newOrder);
                }}
                spacing={2}
              >
                {/* TODO: list undraggable pinned columns first */}
                {table
                  .getAllLeafColumns()
                  .reduce<JSX.Element[]>((acc, column) => {
                    if (isColumnToggable(column))
                      acc.push(
                        <ListItem
                          key={column.id}
                          as={Reorder.Item}
                          value={column.id}
                          rounded="lg"
                        >
                          <HStack>
                            <IconButton
                              aria-label="Drag handle"
                              icon={<MdOutlineDragIndicator />}
                            />
                            <Text fontSize="small" flexGrow={1}>
                              <>{column.columnDef.header}</>
                            </Text>
                            <IconButton
                              aria-label="Toggle column"
                              icon={
                                column.getIsPinned() ? <BsPinFill /> : <BsPin />
                              }
                              onClick={() =>
                                column.getIsPinned()
                                  ? column.pin(false)
                                  : column.pin("left")
                              }
                            />
                            <IconButton
                              aria-label="Toggle column"
                              icon={
                                column.getIsVisible() ? (
                                  <BsEyeFill />
                                ) : (
                                  <BsEyeSlash />
                                )
                              }
                              onClick={column.getToggleVisibilityHandler()}
                            />
                          </HStack>
                        </ListItem>
                      );
                    return acc;
                  }, [])}
              </List>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
};

const Th = motion(ChakraTh);
const Tr = motion(ChakraTr);
const Td = motion(ChakraTd);

const spring = {
  type: "spring",
  damping: 10,
  stiffness: 30,
};

type IndeterminateCheckboxProps = {
  checked: boolean;
  indeterminate: boolean;
  [key: string]: any;
};

const IndeterminateCheckbox = ({
  indeterminate,
  checked,
  ...rest
}: IndeterminateCheckboxProps) => {
  return (
    <Checkbox
      colorScheme="blackAlpha"
      isChecked={checked}
      isIndeterminate={indeterminate}
      ml={2}
      {...rest}
    />
  );
};

IndeterminateCheckbox.displayName = "IndeterminateCheckbox";

function getSelectableColumn<T>(): ColumnDef<T> {
  return {
    id: "select",
    header: ({ table }) => (
      <IndeterminateCheckbox
        {...{
          checked: table.getIsAllRowsSelected(),
          indeterminate: table.getIsSomeRowsSelected(),
          onChange: table.getToggleAllRowsSelectedHandler(),
        }}
      />
    ),
    cell: ({ row }) => (
      <IndeterminateCheckbox
        {...{
          checked: row.getIsSelected(),
          indeterminate: row.getIsSomeSelected(),
          onChange: row.getToggleSelectedHandler(),
        }}
      />
    ),
  };
}

function isColumnToggable<T>(column: Column<T, unknown>): boolean {
  return (
    column.columnDef.id !== "select" &&
    typeof column.columnDef.header === "string" &&
    column.columnDef.header !== ""
  );
}

export default Table;
