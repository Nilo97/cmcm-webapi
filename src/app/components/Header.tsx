"use client";

import { useState, useEffect } from "react";
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Avatar,
  HStack,
  Text,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
} from "@chakra-ui/react";
import { BellIcon, HamburgerIcon } from "@chakra-ui/icons";
import Sidebar from "./sidebar";
import { useRouter } from "next/navigation";
import { parseCookies, destroyCookie } from "nookies";

const Header = () => {
  const router = useRouter();
  const [username, setUsername] = useState("");

  const [notifications, setNotifications] = useState([
    "Produto Expirado",
    "Ficaram 5 unidades de bolacha maria",
    "Factura 1 vencida",
  ]);

  const { ["user"]: user } = parseCookies();

  useEffect(() => {
    setUsername(user);
  }, [user]);

  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLogout = () => {
    destroyCookie({}, "token", { path: "/" });
    destroyCookie({}, "user", { path: "/" });
    destroyCookie({}, "companyId", { path: "/" });
    destroyCookie({}, "email", { path: "/" });

    router.push("/");
  };

  const handleSettings = () => {
    router.push("/dashboard/settings");
  };

  return (
    <>
      <Flex
        as="header"
        align="center"
        justify="space-between"
        wrap="wrap"
        padding="1.0rem"
        bg="white"
        color="gray.800"
        pos="fixed"
        w="full"
        zIndex="1"
        top="0"
        left="0"
        shadow="sm"
      >
        <HStack spacing="4">
          <IconButton
            aria-label="Open Menu"
            icon={<HamburgerIcon />}
            display={{ base: "inline-flex", md: "none" }}
            onClick={onOpen}
          />
          <Text
            fontSize="2xl"
            fontWeight="bold"
            cursor="pointer"
            onClick={() => router.push("/options")}
          >
            Minventa
          </Text>
        </HStack>
        <HStack spacing="4">
          <Menu>
            <MenuButton
              as={IconButton}
              icon={<BellIcon />}
              variant="outline"
              aria-label="Notifications"
            />
            <MenuList>
              {notifications.length ? (
                notifications.map((notification, index) => (
                  <MenuItem key={index}>{notification}</MenuItem>
                ))
              ) : (
                <MenuItem>No new notifications</MenuItem>
              )}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton>
              <Avatar size="sm" name={username} />
            </MenuButton>
            <MenuList>
              <MenuItem onClick={handleSettings}>Definições</MenuItem>
              <MenuItem onClick={handleLogout}>Terminar Sessão</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Miventa Menu</DrawerHeader>
          <DrawerBody>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
