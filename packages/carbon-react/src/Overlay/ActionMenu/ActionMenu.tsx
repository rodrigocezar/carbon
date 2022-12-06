import { IconButton, Menu, MenuButton, MenuList } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";

const ActionMenu = ({ children }: PropsWithChildren) => {
  return (
    <Menu isLazy>
      <MenuButton
        as={IconButton}
        aria-label="Action context menu for row"
        borderRadius="full"
        icon={<BsThreeDotsVertical />}
        colorScheme="gray"
        variant="outline"
        onClick={(e) => e.stopPropagation()}
      />

      <MenuList>{children}</MenuList>
    </Menu>
  );
};

export default ActionMenu;
