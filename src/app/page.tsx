import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";

const Dashboard = () => {
  return (
    <>
      <Heading mb="6">Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Heading as="h3" size="md" mb="4">
            Products
          </Heading>
          <Text>Total Products: 100</Text>
        </Box>
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Heading as="h3" size="md" mb="4">
            Categories
          </Heading>
          <Text>Total Categories: 10</Text>
        </Box>
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Heading as="h3" size="md" mb="4">
            Inventory
          </Heading>
          <Text>Total Inventory Items: 500</Text>
        </Box>
      </SimpleGrid>
    </>
  );
};

export default Dashboard;
