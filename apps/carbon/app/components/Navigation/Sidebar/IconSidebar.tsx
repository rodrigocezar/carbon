import {
  Box,
  IconButton,
  Tooltip,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useMatches } from "@remix-run/react";
import { useSidebar } from "./useSidebar";

const IconSidebar = () => {
  const links = useSidebar();
  const matchedPaths = useMatches().map((match) => match.pathname);

  return (
    <Box
      h="full"
      bg={useColorModeValue("white", "black")}
      borderRight={1}
      borderRightColor={useColorModeValue("gray.200", "gray.700")}
      borderRightStyle="solid"
      position="sticky"
    >
      <VStack spacing={0}>
        {links.map((link) => {
          const isActive = matchedPaths.includes(link.to);
          return (
            <Tooltip key={link.to} label={link.name} placement="right">
              <IconButton
                as={Link}
                to={link.to}
                variant={isActive ? "solid" : "outline"}
                colorScheme={isActive ? "blackAlpha" : "gray"}
                size="lg"
                borderRadius={0}
                border="none"
                aria-label={link.name}
                icon={link.icon}
              />
            </Tooltip>
          );
        })}
      </VStack>
    </Box>
  );
};

export default IconSidebar;
