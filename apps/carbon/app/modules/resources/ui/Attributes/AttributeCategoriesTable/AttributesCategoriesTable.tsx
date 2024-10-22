import {
  Badge,
  Button,
  ButtonGroup,
  IconButton,
  Link,
  MenuItem,
  useDisclosure,
} from "@chakra-ui/react";
import { useNavigate } from "@remix-run/react";
import type { ColumnDef } from "@tanstack/react-table";
import { memo, useCallback, useMemo, useState } from "react";
import { BiAddToQueue } from "react-icons/bi";
import { BsListUl, BsPencilSquare, BsPlus } from "react-icons/bs";
import { IoMdTrash } from "react-icons/io";
import { Table } from "~/components";
import { ConfirmDelete } from "~/components/Modals";
import { usePermissions, useUrlParams } from "~/hooks";
import type { AttributeCategory } from "~/modules/resources";
import { path } from "~/utils/path";

type AttributeCategoriesTableProps = {
  data: AttributeCategory[];
  count: number;
};

const AttributeCategoriesTable = memo(
  ({ data, count }: AttributeCategoriesTableProps) => {
    const navigate = useNavigate();
    const [params] = useUrlParams();
    const permissions = usePermissions();
    const deleteModal = useDisclosure();
    const [selectedCategory, setSelectedCategory] = useState<
      AttributeCategory | undefined
    >();

    const onDelete = (data: AttributeCategory) => {
      setSelectedCategory(data);
      deleteModal.onOpen();
    };

    const onDeleteCancel = () => {
      setSelectedCategory(undefined);
      deleteModal.onClose();
    };

    const columns = useMemo<ColumnDef<(typeof data)[number]>[]>(() => {
      return [
        {
          accessorKey: "name",
          header: "Category",
          cell: ({ row }) => (
            <Link onClick={() => navigate(row.original.id)}>
              {row.original.name}
            </Link>
          ),
        },
        {
          header: "Attributes",
          cell: ({ row }) => (
            <ButtonGroup size="sm" isAttached variant="outline">
              <Button
                onClick={() => {
                  navigate(
                    `${path.to.attributeCategoryList(
                      row.original.id
                    )}?${params?.toString()}`
                  );
                }}
              >
                {Array.isArray(row.original.userAttribute)
                  ? row.original.userAttribute?.length ?? 0
                  : 0}{" "}
                Attributes
              </Button>
              <IconButton
                aria-label="Add attribute"
                icon={<BsPlus />}
                onClick={() => {
                  navigate(
                    `${path.to.newAttributeForCategory(
                      row.original.id
                    )}?${params?.toString()}`
                  );
                }}
              />
            </ButtonGroup>
          ),
        },
        {
          header: "Visibility",
          accessorKey: "public",
          cell: (item) => {
            const isPublic = item.getValue<boolean>()?.toString() === "true";
            return (
              <Badge
                size="sm"
                variant={isPublic ? undefined : "outline"}
                colorScheme={isPublic ? "green" : "gray "}
              >
                {isPublic ? "Public" : "Private"}
              </Badge>
            );
          },
        },
      ];
    }, [navigate, params]);

    const renderContextMenu = useCallback(
      (row: (typeof data)[number]) => {
        return (
          <>
            <MenuItem
              icon={<BiAddToQueue />}
              onClick={() => {
                navigate(
                  `${path.to.newAttributeForCategory(
                    row.id
                  )}?${params?.toString()}`
                );
              }}
            >
              New Attribute
            </MenuItem>
            <MenuItem
              icon={<BsListUl />}
              onClick={() => {
                navigate(
                  `${path.to.attributeCategoryList(
                    row.id
                  )}?${params?.toString()}`
                );
              }}
            >
              View Attributes
            </MenuItem>
            <MenuItem
              icon={<BsPencilSquare />}
              onClick={() => {
                navigate(path.to.attributeCategory(row.id));
              }}
            >
              Edit Attribute Category
            </MenuItem>
            <MenuItem
              isDisabled={row.protected || !permissions.can("delete", "users")}
              icon={<IoMdTrash />}
              onClick={() => onDelete(row)}
            >
              Delete Category
            </MenuItem>
          </>
        );
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [navigate, params, permissions]
    );

    return (
      <>
        <Table<(typeof data)[number]>
          data={data}
          columns={columns}
          count={count ?? 0}
          renderContextMenu={renderContextMenu}
        />
        {selectedCategory && selectedCategory.id && (
          <ConfirmDelete
            action={path.to.deleteAttributeCategory(selectedCategory.id)}
            name={selectedCategory?.name ?? ""}
            text={`Are you sure you want to deactivate the ${selectedCategory?.name} attribute category?`}
            isOpen={deleteModal.isOpen}
            onCancel={onDeleteCancel}
            onSubmit={onDeleteCancel}
          />
        )}
      </>
    );
  }
);

AttributeCategoriesTable.displayName = "AttributeCategoriesTable";
export default AttributeCategoriesTable;
