"use client";
import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Flex,
  useToast,
  useColorModeValue,
  useBreakpointValue,
} from "@chakra-ui/react";

import { InvoiceForm } from "@/app/components/documents/invoice/InvoiceForm";
import { fetchProductSale } from "@/app/actions/product";
import { useRouter } from "next/navigation";
import { InvoiceContainer } from "@/app/components/documents/invoice/InvoiceContainer";

const Document = () => {
  const [documentType, setDocumentType] = useState<DocumentType | "">("");
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const toast = useToast();

  const handleSearch = async (searchTerm: string) => {
    try {
      const result = await fetchProductSale(searchTerm);

      if ("data" in result) {
        setSelectedProduct(result.data);
        console.log(result.data);
        return { data: result.data };
      } else {
        toast({
          title: "Produto não encontrado.",
          description: result.error || "Erro desconhecido",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
        setSelectedProduct(null);
        return { error: result.error || "Erro desconhecido" };
      }
    } catch (error) {
      toast({
        title: "Erro ao buscar dados.",
        description: "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSelectedProduct(null);
      return { error: "Erro desconhecido" };
    }
  };

  const tabBgColor = useColorModeValue("gray.100", "gray.700");
  const tabSelectedColor = useColorModeValue("teal.500", "teal.200");
  const panelBgColor = useColorModeValue("white", "gray.800");
  const tabSize = useBreakpointValue({ base: "xs", md: "sm" });

  return (
    <Box p={{ base: 4, md: 6 }} bg={panelBgColor} borderRadius="md" shadow="md">
      <Flex justify="center" mb={{ base: 4, md: 6 }}>
        <Heading
          as="h1"
          fontSize={{ base: "xl", md: "2xl" }}
          color={tabSelectedColor}
          textAlign="center"
        >
          Emissão de Documentos
        </Heading>
      </Flex>

      <Tabs
        size="sm"
        variant="soft-rounded"
        onChange={(index) =>
          setDocumentType(Object.values(DocumentType)[index])
        }
        isFitted
      >
        <TabList
          justifyContent="center"
          mb={{ base: 3, md: 4 }}
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Recibo
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Factura
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Cotação
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Nota de Crédito
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Nota de Débito
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Guia de Remessa
          </Tab>
          <Tab
            bg={tabBgColor}
            _selected={{ color: "white", bg: tabSelectedColor }}
            fontSize={tabSize}
            p={{ base: 2, md: 3 }}
          >
            Guia de Transporte
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {/* <ReceiptForm
              register={register}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            /> */}
          </TabPanel>
          <TabPanel>
            <Flex align="center" justify="center" w="full" p={4}>
              <Box
                w="full"
                // maxW="container.xl" // or another suitable size like "container.lg" or a fixed value
                p={4}
                borderWidth={1}
                bg="white"
              >
                <InvoiceContainer
                  handleSearch={handleSearch}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                />
                {/* <InvoiceForm
                  handleSearch={handleSearch}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                /> */}
              </Box>
            </Flex>
          </TabPanel>
          <TabPanel>{/* <CreditNoteForm /> */}</TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Document;
