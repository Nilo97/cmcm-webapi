"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  BellIcon,
  AtSignIcon,
  ViewIcon,
  InfoIcon,
  CalendarIcon,
  DragHandleIcon,
} from "@chakra-ui/icons";
import {
  FaPeopleCarryBox,
  FaHouseChimneyWindow,
  FaListOl,
  FaBasketShopping,
  FaBoxesPacking,
} from "react-icons/fa6";

import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: any) => pathname !== '/' && path.startsWith( pathname);
  const isBaseActive = (path: any) => path === pathname;


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
          color={isBaseActive("/") ? "teal.400" : "black"}
          bg={isBaseActive("/") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <FaHouseChimneyWindow />
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
            <FaBasketShopping />
            <Text>Produtos</Text>
          </HStack>
        </Link>
        <Link
          as={NextLink}
          w="100%"
          href="/category"
          fontSize="md"
          color={isActive("/category") ? "teal.400" : "black"}
          bg={isActive("/category") ? "teal.50" : undefined}
          rounded="sm"
          px="3"
          py="1"
        >
          <HStack spacing="2">
            <FaListOl />
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
            <FaPeopleCarryBox />
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
            <FaBoxesPacking />
            <Text>Stock</Text>
          </HStack>
        </Link>
      </VStack>
    </Box>
  );
};
export default Sidebar;
