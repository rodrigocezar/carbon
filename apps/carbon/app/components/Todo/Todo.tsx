import { Box, Heading, ListItem, UnorderedList } from "@chakra-ui/react";

const Todo = ({ items }: { items: string[] }) => {
  return (
    <Box py={4} px={8}>
      <Heading size="md" py={4}>
        TODO
      </Heading>
      <UnorderedList>
        {items.map((item) => (
          <ListItem key={item}>{item}</ListItem>
        ))}
      </UnorderedList>
    </Box>
  );
};

export default Todo;
