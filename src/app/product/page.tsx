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
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";

import ProductTable from "../components/ProductTable";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  fetchProducts,
  deleteProduct,
  uploadProducts,
} from "../actions/product";
import { Product } from "../types";

const PAGE_SIZE = 7;

const ProdutosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
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
    setCurrentPage(0);
  };

  const handleDelete = async (productId: string) => {
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
      fetchAllProducts(currentPage);
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
    router.push(`/product/upsert?id=${product.id}`);
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onClose();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files?.length) return;

    const file = event.target.files[0];
    setUploading(true);
    try {
      const response = await uploadProducts(file);

      if ("error" in response) {
        throw new Error(response.error);
      }

      toast({
        title: "Importação bem-sucedida",
        description: "Os produtos foram importados com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllProducts(currentPage);
    } catch (error) {
      console.error("Error importing file:", error);
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar o arquivo.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setUploading(false);
    }
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
            onClick={() => router.push("/product/upsert")}
          >
            Novo Produto
          </Button>
          <Button
            as="label"
            htmlFor="file-upload"
            size="sm"
            mr="2"
            colorScheme="green"
            leftIcon={<FaUpload />}
            isLoading={uploading}
            loadingText="Importando..."
          >
            Importar
            <input
              type="file"
              id="file-upload"
              hidden
              onChange={handleImport}
              accept=".xlsx, .xls"
            />
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
    </Container>
  );
};

export default ProdutosPage;
