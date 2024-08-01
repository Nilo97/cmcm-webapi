"use client";

import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Text,
  Flex,
  Stack,
  Icon,
  useColorMode,
} from "@chakra-ui/react";
import { FaStore, FaClipboardList, FaWarehouse } from "react-icons/fa";
import { useRouter } from "next/navigation";

const StockManagementPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      bg={colorMode === "light" ? "gray.100" : "gray.900"}
    >
      <Center flex="1">
        <VStack spacing={12}>
          <Heading
            as="h1"
            size="2xl"
            textAlign="center"
            color={colorMode === "light" ? "teal.600" : "teal.300"}
          >
            O que vai querer hoje?
          </Heading>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={6}
            align="center"
          >
            <Button
              size="lg"
              colorScheme="teal"
              leftIcon={<Icon as={FaStore} />}
              onClick={() => router.push("/sales")}
            >
              Vender Produtos
            </Button>
            <Button
              size="lg"
              colorScheme="blue"
              leftIcon={<Icon as={FaClipboardList} />}
              onClick={() => alert("Fazer Cotação")}
            >
              Fazer Cotação
            </Button>
            <Button
              size="lg"
              colorScheme="orange"
              leftIcon={<Icon as={FaWarehouse} />}
              onClick={() => router.push("/dashboard")}
            >
              Gerir Stock
            </Button>
          </Stack>
        </VStack>
      </Center>
      <Box bg={colorMode === "light" ? "gray.200" : "gray.800"} py={4}>
        <Center>
          <Text color={colorMode === "light" ? "gray.600" : "gray.400"}>
            &copy; {new Date().getFullYear()} JobSavana
          </Text>
        </Center>
      </Box>
    </Flex>
  );
};

export default StockManagementPage;
