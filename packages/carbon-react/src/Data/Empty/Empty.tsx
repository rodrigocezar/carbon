import { Flex, Icon, Text, VStack } from "@chakra-ui/react";
import type { ReactNode } from "react";
import { GiSadCrab } from "react-icons/gi";

export type EmptyProps = {
  text?: string;
  icon?: ReactNode;
  children?: ReactNode;
};

export function Empty({ icon, text, children }: EmptyProps) {
  const i = icon ?? GiSadCrab;
  return (
    <VStack align="center" justify="center" h="100%">
      <Flex p={3} align="center" justify="baseline" color="gray.700">
        <Icon as={i as any} boxSize="80px" />
      </Flex>
      <Text>{text}</Text>
      {children}
    </VStack>
  );
}

export default Empty;
