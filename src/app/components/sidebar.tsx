import { usePathname } from "next/navigation";
import NextLink from "next/link";
import {
  Box,
  Flex,
  HStack,
  Link,
  Text,
  VStack,
  useColorModeValue,
  Divider,
} from "@chakra-ui/react";
import {
  FaListOl,
  FaChartLine,
  FaMoneyBillWave,
  FaReceipt,
  FaClipboardList,
  FaFileAlt,
  FaQuestionCircle,
  FaTag,
  FaUndoAlt,
  FaBook,
  FaExclamationTriangle,
  FaUser,
  FaTable,
} from "react-icons/fa";
import {
  FaHouseChimneyWindow,
  FaBasketShopping,
  FaPeopleCarryBox,
  FaBookBible,
  FaBookAtlas,
} from "react-icons/fa6";

const links = [
  // { href: "/dashboard", label: "Geral", icon: FaHouseChimneyWindow },
  { href: "/dashboard/customer", label: "Proprietários", icon: FaUser },
  { href: "/dashboard/licence", label: "Licenças", icon: FaBookAtlas },
  { href: "/dashboard/book", label: "Livretes", icon: FaBook },
  // { href: "/dashboard/table", label: "Tabelas", icon: FaTable },
  // {
  //   href: "/dashboard/statistics",
  //   label: "Relatórios e Estatísticas",
  //   icon: FaChartLine,
  // },
];

const Sidebar = () => {
  const pathname = usePathname();
  const bgActive = useColorModeValue("teal.500", "teal.300");
  const textActive = useColorModeValue("white", "black");
  const iconColorInactive = "black";

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === path;
    }
    return pathname.startsWith(path) && pathname !== "/dashboard";
  };

  return (
    <Box
      w={{ base: "full", md: "300px" }}
      pos="fixed"
      h="full"
      bg={useColorModeValue("white", "gray.800")}
      px="6"
      py="8"
      shadow="md"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
    >
      <Box
        w="100%"
        flex="1"
        overflowY="auto" // Permite o scroll vertical
      >
        <VStack align="start" spacing="1.5" w="100%">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              as={NextLink}
              href={href}
              w="100%"
              rounded="md"
              fontWeight="semibold"
              bg={isActive(href) ? bgActive : "transparent"}
              color={isActive(href) ? textActive : "gray.700"}
              px="4"
              py="3"
              transition="background 0.3s ease"
              _hover={{
                bg: isActive(href) ? bgActive : "gray.100",
                color: isActive(href) ? textActive : "gray.900",
              }}
            >
              <HStack spacing="3">
                <Icon
                  size="18px"
                  color={isActive(href) ? textActive : iconColorInactive}
                />
                <Text>{label}</Text>
              </HStack>
            </Link>
          ))}
        </VStack>
      </Box>

      <Divider my="1" />

      {/* <Flex justify="flex-end" align="center" w="100%" px="6" py="4" mb="6">
        <Link
          as={NextLink}
          href="/dashboard/help"
          w="100%"
          rounded="md"
          fontWeight="semibold"
          bg={pathname === "/dashboard/help" ? bgActive : "transparent"}
          color={pathname === "/dashboard/help" ? textActive : "gray.700"}
          px="4"
          py="3"
          transition="background 0.3s ease"
          _hover={{
            bg: pathname === "/dashboard/help" ? bgActive : "gray.100",
            color: pathname === "/dashboard/help" ? textActive : "gray.900",
          }}
        >
          <HStack spacing="3">
            <FaQuestionCircle
              size="18px"
              color={
                pathname === "/dashboard/help" ? textActive : iconColorInactive
              }
            />
            <Text>Ajuda e Suporte</Text>
          </HStack>
        </Link>
      </Flex> */}
    </Box>
  );
};

export default Sidebar;
