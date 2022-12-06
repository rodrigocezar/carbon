import type { ThemeTypings } from "@chakra-ui/react";
import {
  Button,
  Stack,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";

type PaginationProps = {
  pageIndex: number;
  pageSize: number;
  canPreviousPage: boolean;
  canNextPage: boolean;
  pageOptions: number[];
  pageCount: number;
  gotoPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  setPageSize: (size: number) => void;
  colorScheme?: ThemeTypings["colorSchemes"];
};

export function Pagination({
  pageIndex,
  pageSize,
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
}: PaginationProps) {
  const pageSizes = [10, 25, 50];
  if (!pageSizes.includes(pageSize)) {
    pageSizes.push(pageSize);
    pageSizes.sort();
  }

  return (
    <Stack
      p={4}
      direction="row"
      justify="space-between"
      align="center"
      spacing="6"
    >
      <Stack direction="row" spacing={2}>
        <Menu>
          <MenuButton as={Button}>{pageSize} per page</MenuButton>
          <MenuList fontSize="sm" boxShadow="xl" minW={48}>
            {pageSizes.map((size) => (
              <MenuItem
                key={`${size}`}
                onClick={() => {
                  setPageSize(size);
                }}
              >
                {size} per page
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </Stack>
      <Stack direction="row" spacing={2}>
        <Button disabled={!canPreviousPage} onClick={previousPage}>
          Previous
        </Button>
        <Button disabled={!canNextPage} onClick={nextPage}>
          Next
        </Button>
      </Stack>
    </Stack>
  );
}
