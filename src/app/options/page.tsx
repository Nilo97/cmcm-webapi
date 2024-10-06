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
  Grid,
  GridItem,
  Divider,
} from "@chakra-ui/react";
import {
  FaStore,
  FaWarehouse,
  FaMoneyCheckAlt,
  FaFileInvoice,
  FaSignOutAlt,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

const StockManagementPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "lg", md: "xl" });

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
      justify="center"
      align="center"
      p={8}
      position="relative"
    >
      {/* Botão de logout estilizado */}
      <Button
        position="absolute"
        top={6}
        right={6}
        colorScheme="red"
        size="md"
        onClick={handleLogout}
        leftIcon={<Icon as={FaSignOutAlt} />}
        borderRadius="lg"
        boxShadow="lg"
        _hover={{ bg: "red.700" }}
      >
        Terminar Sessão
      </Button>

      <VStack spacing={6} align="center">
        <Heading
          as="h1"
          fontSize={{ base: "2xl", md: "4xl" }}
          color={colorMode === "light" ? "blue.700" : "blue.300"}
          fontWeight="extrabold"
          textAlign="center"
          mb="5"
        >
          Gerencie seu Negócio de Forma Simples
        </Heading>

        <Text
          fontSize={{ base: "md", md: "lg" }}
          color={colorMode === "light" ? "gray.600" : "gray.400"}
          textAlign="center"
          maxW="lg"
        >
          Escolha uma das opções abaixo para começar a organizar suas vendas e
          seu estoque com rapidez.
        </Text>

        {/* Grade para organizar os botões em uma UI elegante */}
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }}
          gap={6}
          width="100%"
          maxW="3xl"
        >
          <GridItem>
            <Button
              w="100%"
              h="120px"
              colorScheme="teal"
              variant="solid"
              leftIcon={<Icon as={FaStore} boxSize={8} />}
              onClick={() => router.push("/sales")}
              borderRadius="lg"
              boxShadow="xl"
              fontSize="lg"
              _hover={{ bg: "teal.600" }}
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              Vendas
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="100%"
              h="120px"
              colorScheme="orange"
              variant="solid"
              leftIcon={<Icon as={FaWarehouse} boxSize={8} />}
              onClick={() => router.push("/dashboard")}
              borderRadius="lg"
              boxShadow="xl"
              fontSize="lg"
              _hover={{ bg: "orange.600" }}
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              Estoque
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="100%"
              h="120px"
              colorScheme="blue"
              variant="solid"
              leftIcon={<Icon as={FaMoneyCheckAlt} boxSize={8} />}
              onClick={() => router.push("/cashflow")}
              borderRadius="lg"
              boxShadow="xl"
              fontSize="lg"
              _hover={{ bg: "blue.600" }}
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              Caixa
            </Button>
          </GridItem>

          <GridItem>
            <Button
              w="100%"
              h="120px"
              colorScheme="purple"
              variant="solid"
              leftIcon={<Icon as={FaFileInvoice} boxSize={8} />}
              onClick={() => router.push("/documents")}
              borderRadius="lg"
              boxShadow="xl"
              fontSize="lg"
              _hover={{ bg: "purple.600" }}
              textAlign="center"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
            >
              Documentos
            </Button>
          </GridItem>
        </Grid>
      </VStack>

      <Box
        as="footer"
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        py={4}
        width="100%"
        textAlign="center"
        position="absolute"
        bottom={0}
        borderTopWidth={1}
        borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
      >
        <Text
          fontSize="sm"
          color={colorMode === "light" ? "gray.600" : "gray.400"}
        >
          &copy; {new Date().getFullYear()} Mosprey Innovations. Todos os
          direitos reservados.
        </Text>
      </Box>
    </Flex>
  );
};

export default StockManagementPage;
