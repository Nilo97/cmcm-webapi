import { Flex, Box } from "@chakra-ui/react";
import { Suspense } from "react";
import DesktopSidebar from "../components/DesktopSidebar";
import Header from "../components/Header";
import { Providers } from "../providers";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from "../context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <section>
        <Flex direction="column" minH="100vh">
          <Header />
          <Flex mt="16">
            <DesktopSidebar />
            <Box ml={{ base: 0, md: "300px" }} p="6" w="full">
              <Suspense>{children}</Suspense>
            </Box>
          </Flex>
        </Flex>
      </section>
    </AuthProvider>
  );
}
