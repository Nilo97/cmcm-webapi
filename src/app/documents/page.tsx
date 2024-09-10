"use client";

import React from "react";
import {
  Box,
  Button,
  Center,
  Heading,
  VStack,
  Text,
  Flex,
  Stack,
  Icon,
  useColorMode,
  useBreakpointValue,
  HStack,
  Divider,
} from "@chakra-ui/react";
import {
  FaFileInvoice,
  FaReceipt,
  FaQuoteRight,
  FaPrint,
  FaDownload,
} from "react-icons/fa";
import { useRouter } from "next/navigation";

const DocumentEmissionPage = () => {
  const { colorMode } = useColorMode();
  const router = useRouter();
  const buttonSize = useBreakpointValue({ base: "md", md: "lg" });

  return (
    <Flex
      direction="column"
      minHeight="100vh"
      bg={colorMode === "light" ? "gray.50" : "gray.900"}
      p={4}
      justify="center"
    >
      <Center flex="1" py={8}>
        <VStack spacing={12} align="center">
          <Heading
            as="h1"
            size="2xl"
            color={colorMode === "light" ? "teal.600" : "teal.300"}
            fontWeight="bold"
            textShadow="1px 1px 2px rgba(0, 0, 0, 0.2)"
          >
            Emissão de Documentos
          </Heading>
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={8}
            align="center"
            justify="center"
          >
            <Button
              size={buttonSize}
              colorScheme="teal"
              variant="solid"
              leftIcon={<Icon as={FaQuoteRight} boxSize={6} />}
              onClick={() => router.push("/quotation")}
              borderRadius="md"
              boxShadow="lg"
              _hover={{ bg: "teal.600", shadow: "md" }}
            >
              Cotação
            </Button>

            <Button
              size={buttonSize}
              colorScheme="blue"
              variant="solid"
              leftIcon={<Icon as={FaReceipt} boxSize={6} />}
              onClick={() => router.push("/receipt")}
              borderRadius="md"
              boxShadow="lg"
              _hover={{ bg: "blue.600", shadow: "md" }}
            >
              Recibo
            </Button>

            <Button
              size={buttonSize}
              colorScheme="purple"
              variant="solid"
              leftIcon={<Icon as={FaFileInvoice} boxSize={6} />}
              onClick={() => router.push("/invoice")}
              borderRadius="md"
              boxShadow="lg"
              _hover={{ bg: "purple.600", shadow: "md" }}
            >
              Fatura
            </Button>

            <Button
              size={buttonSize}
              colorScheme="orange"
              variant="solid"
              leftIcon={<Icon as={FaPrint} boxSize={6} />}
              onClick={() => router.push("/print")}
              borderRadius="md"
              boxShadow="lg"
              _hover={{ bg: "orange.600", shadow: "md" }}
            >
              Imprimir
            </Button>

            <Button
              size={buttonSize}
              colorScheme="green"
              variant="solid"
              leftIcon={<Icon as={FaDownload} boxSize={6} />}
              onClick={() => router.push("/download")}
              borderRadius="md"
              boxShadow="lg"
              _hover={{ bg: "green.600", shadow: "md" }}
            >
              Download
            </Button>
          </Stack>
          <Divider />
          <Text color={colorMode === "light" ? "gray.600" : "gray.400"}>
            Selecione a opção desejada para emitir o documento correspondente.
          </Text>
        </VStack>
      </Center>
      <Box
        bg={colorMode === "light" ? "gray.200" : "gray.800"}
        py={4}
        mt="auto"
        textAlign="center"
        borderTopWidth={1}
        borderColor={colorMode === "light" ? "gray.300" : "gray.700"}
      >
        <Text color={colorMode === "light" ? "gray.600" : "gray.400"}>
          &copy; {new Date().getFullYear()} Mosprey Innovations
        </Text>
      </Box>
    </Flex>
  );
};

export default DocumentEmissionPage;
