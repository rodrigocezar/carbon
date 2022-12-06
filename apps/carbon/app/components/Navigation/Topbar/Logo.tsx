import { Box, IconButton, useColorModeValue } from "@chakra-ui/react";
import { Link } from "@remix-run/react";
import { AiOutlineCodeSandbox } from "react-icons/ai";

const Logo = () => {
  return (
    <Box
      borderRight={1}
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      borderRightStyle="solid"
    >
      <IconButton
        as={Link}
        variant="outline"
        colorScheme="gray"
        size="lg"
        borderRadius={0}
        border="none"
        aria-label="Carbon"
        icon={<AiOutlineCodeSandbox />}
        to="/app"
      />
    </Box>
  );
};

export default Logo;
