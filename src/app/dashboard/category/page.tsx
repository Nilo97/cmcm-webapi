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
  fetchPaginatedCategories,
  deleteCategory,
} from "@/app/actions/categories";
import CategoryTable from "@/app/components/CategoryTable";
import { Category } from "@/app/types";

const PAGE_SIZE = 7;

const CategoriasPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchAllCategories(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllCategories = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchPaginatedCategories(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setCategories(data.categories);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast({
        title: "Erro ao buscar categorias",
        description: "Ocorreu um erro ao buscar as categorias.",
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

  const handleDelete = async (categoryId: string) => {
    setLoading(true);
    try {
      const response = await deleteCategory(categoryId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "Categoria Deletada",
        description: "A categoria foi deletada com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllCategories(currentPage);
    } catch (error) {
      console.error("Error deleting category:", error);
      toast({
        title: "Erro ao deletar categoria",
        description: "Ocorreu um erro ao deletar a categoria.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: Category) => {
    router.push(`/dashboard/category/upsert?id=${category.id}`);
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
          Lista de Categorias
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/dashboard/category/upsert")}
          >
            Nova Categoria
          </Button>

          <Button
            size="sm"
            colorScheme="pink"
            leftIcon={<DownloadIcon />}
            onClick={() => console.log("Export clicked")}
          >
            Exportar
          </Button>
        </Flex>
      </Flex>
      <CategoryTable
        categories={categories}
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

export default CategoriasPage;
