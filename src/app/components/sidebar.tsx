import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
  Spacer,
} from "@chakra-ui/react";
import {
  FaPeopleCarryBox,
  FaHouseChimneyWindow,
  FaListOl,
  FaBasketShopping,
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
} from "react-icons/fa6";
import { FaClipboardList, FaCog, FaFileAlt, FaTag } from "react-icons/fa";

const links = [
  {
    href: "/dashboard",
    label: "Geral",
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
    label: "Entidades",
    icon: FaPeopleCarryBox,
  },
  {
    href: "/dashboard/cashflow",
    label: "Fluxo de Caixa",
    icon: FaMoneyBillWave,
  },
  {
    href: "/dashboard/orders",
    label: "Pedidos",
    icon: FaClipboardList,
  },
  {
    href: "/dashboard/documents",
    label: "Documentos",
    icon: FaFileAlt,
  },
  {
    href: "/dashboard/expenses",
    label: "Despesas",
    icon: FaReceipt,
  },

  {
    href: "/dashboard/promotions",
    label: "Promoções",
    icon: FaTag,
  },
  {
    href: "/dashboard/statistics",
    label: "Relatórios e Estatísticas",
    icon: FaChartLine,
  },
];

const Sidebar = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path) && pathname !== "/dashboard";
  };

  return (
    <Box
      w={{ base: "full", md: "250px" }}
      pos="fixed"
      h="full"
      bg="whiteAlpha.900"
      px="4"
      py="6"
      color="black"
      display="flex"
      flexDirection="column"
    >
      <VStack align="start" spacing="4" w="100%">
        {links.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            as={NextLink}
            w="100%"
            href={href}
            fontWeight="bold"
            color={isActive(href) ? "teal.400" : "black"}
            bg={isActive(href) ? "teal.50" : "transparent"}
            rounded="sm"
            px="3"
            py="1"
            _hover={{
              textDecoration: "none",
              bg: isActive(href) ? "teal.100" : "gray.100",
            }}
          >
            <HStack spacing="2">
              <Icon color={isActive(href) ? "teal.400" : "gray.500"} />
              <Text>{label}</Text>
            </HStack>
          </Link>
        ))}
      </VStack>
      <Spacer />

      <Flex mb="12">
        <Link
          as={NextLink}
          href="/dashboard/settings"
          bg={pathname === "/dashboard/settings" ? "teal.50" : "gray.50"}
          fontWeight="bold"
          color="black"
          rounded="sm"
          px="3"
          py="1"
          w="100%"
          _hover={{
            textDecoration: "none",
            bg: pathname === "/dashboard/settings" ? "teal.100" : "gray.100",
          }}
        >
          <HStack spacing="2">
            <FaCog
              color={
                pathname === "/dashboard/settings" ? "teal.400" : "gray.500"
              }
            />
            <Text>Definições</Text>
          </HStack>
        </Link>
      </Flex>
    </Box>
  );
};

export default Sidebar;
