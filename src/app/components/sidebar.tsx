"use client";

import { usePathname } from "next/navigation";
import NextLink from "next/link";
import { Box, Flex, HStack, Link, Text, VStack } from "@chakra-ui/react";
import {
  FaPeopleCarryBox,
  FaHouseChimneyWindow,
  FaListOl,
  FaBasketShopping,
} from "react-icons/fa6";

const links = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: FaHouseChimneyWindow,
  },
  {
    href: "/dashboard/product",
    label: "Produtos",
    icon: FaBasketShopping,
  },
  {
    href: "/dashboard/category",
    label: "Categorias",
    icon: FaListOl,
  },
  {
    href: "/dashboard/supplier",
    label: "Fornecedores",
    icon: FaPeopleCarryBox,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: any) =>
    pathname !== "/dashboard" && pathname.startsWith(path);
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
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            as={NextLink}
            w="100%"
            href={href}
            fontWeight="bold"
            color={isBaseActive(href) ? "teal.400" : "black"}
            bg={isBaseActive(href) ? "teal.50" : undefined}
            rounded="sm"
            px="3"
            py="1"
          >
            <HStack spacing="2">
              <Icon />
              <Text>{label}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
    </Box>
  );
};

export default Sidebar;
