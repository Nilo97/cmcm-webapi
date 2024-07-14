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

import SupplierTable from "../components/SupplierTable";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  fetchSuppliers,
  deleteSupplier,
  uploadSuppliers,
  fetchPaginatedSuppliers,
} from "../actions/suppliers";
import { Supplier } from "../types";

const PAGE_SIZE = 7;

const SuppliersPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchAllSuppliers(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllSuppliers = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchPaginatedSuppliers(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setSuppliers(data.suppliers);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar fornecedores:", error);
      toast({
        title: "Erro ao buscar fornecedores",
        description: "Ocorreu um erro ao buscar os fornecedores.",
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

  const handleDelete = async (supplierId: string) => {
    setLoading(true);
    try {
      const response = await deleteSupplier(supplierId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "Fornecedor Deletado",
        description: "O fornecedor foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllSuppliers(currentPage);
    } catch (error) {
      console.error("Erro ao deletar fornecedor:", error);
      toast({
        title: "Erro ao deletar fornecedor",
        description: "Ocorreu um erro ao deletar o fornecedor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    router.push(`/supplier/upsert?id=${supplier.id}`);
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
        <Heading as="h1" size="lg" mb={{ base: 4, md: 0 }}>
          Lista de Fornecedores
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/supplier/upsert")}
          >
            Novo Fornecedor
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
      <SupplierTable
        suppliers={suppliers}
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

export default SuppliersPage;
