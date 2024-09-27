"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Flex,
  Input as ChakraInput,
  useToast,
  Spinner,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { AddIcon, SearchIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import InvoiceTable from "./InvoiceTable";
import { fetchPaginatedInvoices } from "@/app/actions/invoice";
import { InvoiceResponse } from "@/app/actions/types";
import InvoiceForm from "./InvoiceForm";

type InvoiceContainerProps = {
  handleSearch: (searchTerm: string) => Promise<{ data?: any; error?: string }>;
  selectedProduct: any;
  setSelectedProduct: (value: any) => void;
};

const PAGE_SIZE = 7;

export const InvoiceContainer: React.FC<InvoiceContainerProps> = ({
  handleSearch,
  selectedProduct,
  setSelectedProduct,
}) => {
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const toast = useToast();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const OverlayOne = () => (
    <ModalOverlay
      bg="blackAlpha.300"
      backdropFilter="blur(10px) hue-rotate(90deg)"
    />
  );

  useEffect(() => {
    fetchInvoices(currentPage);
  }, [currentPage, searchQuery]);

  const fetchInvoices = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchPaginatedInvoices(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setInvoices(data.invoices);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching invoices:", error);
      toast({
        title: "Erro ao buscar faturas",
        description: "Ocorreu um erro ao buscar as faturas.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  // const handleSearch = (value: string) => {
  //   setSearchQuery(value);
  //   setCurrentPage(0);
  // };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxW="container.xl" mt="1" p={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb="4"
      >
        <Heading
          as="h1"
          size="lg"
          mb={{ base: 4, md: 0 }}
          textShadow="1px 1px #ccc"
        >
          Lista de Facturas
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => setIsModalOpen(true)}
          >
            Nova Factura
          </Button>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <InvoiceTable
          invoices={invoices}
          onSearch={handleSearch}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onEdit={function (invoice: InvoiceResponse): void {
            throw new Error("Function not implemented.");
          }}
          onPayment={function (): void {
            fetchInvoices(currentPage);
          }}
          onDetails={function (invoice: InvoiceResponse): void {
            throw new Error("Function not implemented.");
          }}
          onPay={function (invoice: InvoiceResponse): void {
            throw new Error("Function not implemented.");
          }}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          fetchInvoices(currentPage);
        }}
        size="full"
      >
        <OverlayOne />
        <ModalContent>
          <ModalHeader>Facturas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InvoiceForm
              handleSearch={handleSearch}
              selectedProduct={selectedProduct}
              setSelectedProduct={setSelectedProduct}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};
