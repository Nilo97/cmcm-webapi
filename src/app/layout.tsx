import type { Metadata } from "next";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import { Flex, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import DesktopSidebar from "./components/DesktopSidebar";

export const metadata: Metadata = {
  title: "FStock",
  description: "Stock Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fonts.inter.className}>
        <Providers>
          <Flex direction="column" minH="100vh">
            <Header />
            <Flex mt="16">
              <DesktopSidebar />
              <Box ml={{ base: 0, md: "250px" }} p="6" w="full">
                {children}
              </Box>
            </Flex>
          </Flex>
        </Providers>
      </body>
    </html>
  );
}
