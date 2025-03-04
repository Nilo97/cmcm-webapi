import type { Metadata } from "next";
import { Providers } from "./providers";
import { fonts } from "./fonts";
import { Flex, Box } from "@chakra-ui/react";
import Header from "./components/Header";
import DesktopSidebar from "./components/DesktopSidebar";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "SIGA",
  description: "Livretes Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={fonts.poppins.className}>
        <Providers>
          <Suspense>{children}</Suspense>
        </Providers>
      </body>
    </html>
  );
}
