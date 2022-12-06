import { Box, VStack, useColorModeValue } from "@chakra-ui/react";
import type { PropsWithChildren } from "react";

const ContentSidebar = ({ children }: PropsWithChildren<{}>) => (
  <Box
    h="full"
    w="15rem"
    bg={useColorModeValue("white", "black")}
    borderRight={1}
    borderRightColor={useColorModeValue("gray.300", "gray.700")}
    borderRightStyle="solid"
  >
    <VStack h="full" alignItems="start">
      <Box overflowY="auto" w="full" h="full" pb={8}>
        {children}
      </Box>
    </VStack>
  </Box>
);

export default ContentSidebar;
