"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";

import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  fetchPaginatedcustomers,
  deletecustomer,
} from "@/app/actions/suppliers";
import { customer } from "@/app/actions/types";
import CustomerTable from "@/app/components/CustomerTable";

const PAGE_SIZE = 7;

const customersPage: React.FC = () => {
  const [customers, setcustomers] = useState<customer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchAllcustomers(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllcustomers = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchPaginatedcustomers(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setcustomers(data.customers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar Utentees:", error);
      toast({
        title: "Erro ao buscar Utentees",
        description: "Ocorreu um erro ao buscar os Utentees.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleDelete = async (customerId: string) => {
    setLoading(true);
    try {
      const response = await deletecustomer(customerId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "Utente Deletado",
        description: "O Utente foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllcustomers(currentPage);
    } catch (error) {
      console.error("Erro ao deletar Utente:", error);
      toast({
        title: "Erro ao deletar Utente",
        description: "Ocorreu um erro ao deletar o Utente.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer: customer) => {
    router.push(`/dashboard/customer/upsert?id=${customer.id}`);
  };

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
          Lista de Utentes
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/dashboard/customer/upsert")}
          >
            Novo Utente
          </Button>

          <Button
            size="sm"
            colorScheme="pink"
            leftIcon={<DownloadIcon />}
            onClick={() => console.log("Exportar clicado")}
          >
            Exportar
          </Button>
        </Flex>
      </Flex>
      <CustomerTable
        customers={customers}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearch}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />
    </Container>
  );
};

export default customersPage;
