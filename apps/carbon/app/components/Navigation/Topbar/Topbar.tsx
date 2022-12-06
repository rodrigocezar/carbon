import { Button, GridItem, HStack, useColorModeValue } from "@chakra-ui/react";
import { BiHelpCircle } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import AvatarMenu from "./AvatarMenu";
import Breadcrumbs from "./Breadcrumbs";
import Logo from "./Logo";
import useBreadcrumbs from "./useBreadcrumbs";

const Topbar = () => {
  const breadcrumbLinks = useBreadcrumbs();
  const borderColor = useColorModeValue("gray.200", "gray.800");
  return (
    <GridItem
      display="grid"
      gap={4}
      gridTemplateColumns="auto 1fr auto 1fr"
      bg={useColorModeValue("white", "black")}
      borderBottom={1}
      borderBottomColor={borderColor}
      borderBottomStyle="solid"
      zIndex={1}
    >
      <Logo />
      <Breadcrumbs links={breadcrumbLinks} />
      <Button
        colorScheme="gray"
        leftIcon={<FaSearch />}
        variant="solid"
        border={1}
        borderColor={borderColor}
        borderStyle="solid"
        color="gray.500"
        w={200}
        mt={2}
      >
        Search
      </Button>
      <HStack py={2} pr={4} justifyContent="end">
        <Button
          colorScheme="gray"
          leftIcon={<BiHelpCircle />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Help
        </Button>
        <Button
          colorScheme="gray"
          leftIcon={<FaSearch />}
          variant="solid"
          border={1}
          borderColor={borderColor}
          borderStyle="solid"
        >
          Feedback
        </Button>
        <AvatarMenu />
      </HStack>
    </GridItem>
  );
};

export default Topbar;
