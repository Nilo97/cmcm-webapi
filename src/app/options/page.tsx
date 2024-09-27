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
  useBreakpointValue,

} from "@chakra-ui/react";
import {
  FaStore,
  FaWarehouse,
  FaMoneyCheckAlt,
  FaFileInvoice,
  FaSignOutAlt, 
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";

const StockManagementPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  const handleLogout = () => {
    destroyCookie({}, "token", { path: "/" });
    destroyCookie({}, "user", { path: "/" });
    destroyCookie({}, "companyId", { path: "/" });
    destroyCookie({}, "email", { path: "/" });

    router.push("/");
  };

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      bg={colorMode === "light" ? "gray.50" : "gray.900"}
      p={4}
      justify="center"
      position="relative"
    >
      <Button
        position="absolute"
        top={4}
        right={4}
        colorScheme="red"
        variant="solid"
        size="sm"
        onClick={handleLogout}
        leftIcon={<Icon as={FaSignOutAlt} />}
        borderRadius="full"
        boxShadow="md"
        _hover={{ bg: "red.600", color: "white" }}
      >
        Terminar Sessão
      </Button>

      <Center flex="1" py={8}>
        <VStack spacing={12} align="center">
          <Heading
            as="h1"
            size="2xl"
            color={colorMode === "light" ? "teal.600" : "teal.300"}
            fontWeight="bold"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
          >
            O que vai querer hoje?
          </Heading>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            align="center"
            justify="center"
          >
            <Button
              size={buttonSize}
              colorScheme="teal"
              variant="solid"
              leftIcon={<Icon as={FaStore} boxSize={6} />}
              onClick={() => router.push("/sales")}
              borderRadius="full"
              boxShadow="lg"
              _hover={{ bg: "teal.600", shadow: "md" }}
            >
              Vender Produtos
            </Button>

            <Button
              size={buttonSize}
              colorScheme="orange"
              variant="solid"
              leftIcon={<Icon as={FaWarehouse} boxSize={6} />}
              onClick={() => router.push("/dashboard")}
              borderRadius="full"
              boxShadow="lg"
              _hover={{ bg: "orange.600", shadow: "md" }}
            >
              Gerir Stock
            </Button>

            <Button
              size={buttonSize}
              colorScheme="blue"
              variant="solid"
              leftIcon={<Icon as={FaMoneyCheckAlt} boxSize={6} />}
              onClick={() => router.push("/cashflow")}
              borderRadius="full"
              boxShadow="lg"
              _hover={{ bg: "blue.600", shadow: "md" }}
            >
              Ver Caixa
            </Button>

            <Button
              size={buttonSize}
              colorScheme="purple"
              variant="solid"
              leftIcon={<Icon as={FaFileInvoice} boxSize={6} />}
              onClick={() => router.push("/documents")}
              borderRadius="full"
              boxShadow="lg"
              _hover={{ bg: "purple.600", shadow: "md" }}
            >
              Emitir Documentos
            </Button>
          </Stack>
        </VStack>
        {/* <DropzoneComponent /> */}
      </Center>

      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        py={4}
        mt="auto"
        textAlign="center"
        borderTopWidth={1}
        borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
      >
        <Text color={colorMode === "light" ? "gray.600" : "gray.400"}>
          &copy; {new Date().getFullYear()} Mosprey Innovations
        </Text>
      </Box>
    </Flex>
  );
};

export default StockManagementPage;
