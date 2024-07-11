"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  BellIcon,
  AtSignIcon,
  ViewIcon,
  InfoIcon,
  CalendarIcon,
} from "@chakra-ui/icons";

import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: any) => path === pathname;

  return (
    <Box
      w={{ base: "full", md: "250px" }}
      pos="fixed"
      h="full"
      bg="whiteAlpha.900"
      px="4"
      py="6"
      color="black"
    >
      <VStack align="start" spacing="4" w="100%">
        <Link
          as={NextLink}
          w="100%"
          href="/"
          fontSize="md"
          fontWeight="bold"
          color={isActive("/") ? "teal.400" : "black"}
          bg={isActive("/") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <ViewIcon />
            <Text>Dashboard</Text>
          </HStack>
        </Link>
        <Link
          as={NextLink}
          w="100%"
          href="/product"
          fontSize="md"
          color={isActive("/product") ? "teal.400" : "black"}
          bg={isActive("/product") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <AtSignIcon />
            <Text>Produtos</Text>
          </HStack>
        </Link>
        <Link
          as={NextLink}
          w="100%"
          href="/categorie"
          fontSize="md"
          color={isActive("/categorie") ? "teal.400" : "black"}
          bg={isActive("/categorie") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <InfoIcon />
            <Text>Categorias</Text>
          </HStack>
        </Link>
        <Link
          as={NextLink}
          w="100%"
          href="/supplier"
          fontSize="md"
          color={isActive("/supplier") ? "teal.400" : "black"}
          bg={isActive("/supplier") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <CalendarIcon />
            <Text>Fornecedores</Text>
          </HStack>
        </Link>
        <Link
          as={NextLink}
          w="100%"
          href="/stock"
          fontSize="md"
          color={isActive("/stock") ? "teal.400" : "black"}
          bg={isActive("/stock") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <CalendarIcon />
            <Text>Stock</Text>
          </HStack>
        </Link>
      </VStack>
    </Box>
  );
};
export default Sidebar;
