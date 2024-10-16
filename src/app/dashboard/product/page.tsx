"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Flex,
  FormLabel,
  Input as ChakraInput,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";

import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  fetchProducts,
  deleteProduct,
  uploadProducts,
} from "@/app/actions/product";
import ProductTable from "@/app/components/ProductTable";
import { Product } from "@/app/actions/types";

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
        title: "Erro ao buscar Produtos",
        description: "Ocorreu um erro ao buscar os Produtos.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (product: Product) => {
    router.push(`/dashboard/product/details?id=${product.productId}`);
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
        description: "O Produto foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllProducts(currentPage);
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Erro ao deletar Produto",
        description: "Ocorreu um erro ao deletar o Produto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product: Product) => {
    router.push(`/dashboard/product/upsert?id=${product.productId}`);
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
        description: "Os Produtos foram importados com sucesso.",
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
        <Heading
          as="h3"
          size="md"
          mb={{ base: 4, md: 0 }}
          textShadow="1px 1px #ccc"
          color="teal.400"
        >
          Lista de Produtos
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/dashboard/product/upsert")}
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
        onDetails={handleViewDetails}
      />
    </Container>
  );
};

export default ProdutosPage;
