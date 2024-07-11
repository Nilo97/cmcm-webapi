"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Flex,
  FormLabel,
  Input as ChakraInput,
  useToast,
} from "@chakra-ui/react";
import ProductTable from "../components/ProductTable";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import { fetchProducts, deleteProduct } from "../actions/product";
import { Product } from "../types";

const PAGE_SIZE = 7;

const ProdutosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllProducts = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchProducts(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Erro ao buscar produtos",
        description: "Ocorreu um erro ao buscar os produtos.",
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
    setCurrentPage(1); // Reset to the first page on new search
  };

  const handleDelete = async (productId: number) => {
    setLoading(true);
    try {
      const response = await deleteProduct(productId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "Produto Deletado",
        description: "O produto foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllProducts(currentPage); // Fetch products again after successful deletion
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro ao deletar produto",
        description: "Ocorreu um erro ao deletar o produto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onClose();
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
          Lista de Produtos
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/product/register")}
          >
            Novo Produto
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
      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearch}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
      />

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nome do Produto</FormLabel>
              <ChakraInput type="text" />
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProdutosPage;
