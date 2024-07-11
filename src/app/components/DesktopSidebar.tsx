"use client";

import React from "react";
import {
  useDisclosure,
  useBreakpointValue,
  IconButton,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerBody,
  DrawerHeader,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import Sidebar from "./sidebar";

const DesktopSidebar: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const showSidebarInDrawer = useBreakpointValue({ base: true, md: false });

  return showSidebarInDrawer ? <></> : <Sidebar />;
};

export default DesktopSidebar;
