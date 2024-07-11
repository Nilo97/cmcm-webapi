"use client";

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
import { useState } from "react";
import Sidebar from "./sidebar";

const Header = () => {
  const [notifications, setNotifications] = useState([
    "Notification 1",
    "Notification 2",
    "Notification 3",
  ]);

  const { isOpen, onOpen, onClose } = useDisclosure();

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
          <Text fontSize="2xl" fontWeight="bold">
            FStock
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
              <Avatar size="sm" name="John Doe" />
            </MenuButton>
            <MenuList>
              <MenuItem>Manage Account</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuList>
          </Menu>
        </HStack>
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>FStock Menu</DrawerHeader>
          <DrawerBody>
            <Sidebar />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Header;
