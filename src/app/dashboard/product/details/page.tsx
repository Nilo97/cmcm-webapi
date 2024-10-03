"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
  Grid,
  GridItem,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

import RegisterBatchForm from "@/app/components/BatchForm";
import {
  fetchProductDetails,
  getProductById,
  createBatch,
} from "@/app/actions/product";
import { useRouter } from "next/navigation";
import { formatCurrency, formatDate } from "@/app/actions/util";
import generic from "../../../../../public/generic.jpg";
import { Product, BatchResponse } from "@/app/actions/types";

const ProductDetailsPage = () => {
  const [product, setProduct] = useState<Product | null>(null);
  const [batch, setBatch] = useState<BatchResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [batchPage, setBatchPage] = useState(0);
  const [batchSize] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const searchParams = useSearchParams();
  const toast = useToast();
  const id = searchParams.get("id");
  const router = useRouter();

  const fetchData = async () => {
    try {
      const batchResult = await fetchProductDetails(id, batchPage, batchSize);
      if ("error" in batchResult) {
        throw new Error(batchResult.error);
      } else {
        setBatch(batchResult.batches);
        setTotalPages(batchResult.totalPages);
      }
    } catch (error: any) {
      setError(error.message);
      toast({
        title: "Erro ao buscar dados",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams, batchPage]);

  useEffect(() => {
    const id = searchParams.get("id");

    const fetchData = async () => {
      try {
        const productResult = await getProductById(id);
        if ("error" in productResult) {
          throw new Error(productResult.error);
        } else {
          setProduct(productResult.product);
        }
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Erro ao buscar dados",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchData();
  }, [searchParams]);

  const handleRegisterBatch = async (data: any) => {
    data.productId = id;

    try {
      const response = await createBatch(data);

      if ("error" in response) {
        throw new Error(response.error);
      }

      toast({
        title: "Lote Registrado",
        description: "O lote foi registrado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setIsModalOpen(false);
      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao registar lote",
        description:
          error?.message || "Ocorreu um erro ao tentar salvar o lote.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (error) {
    return <Text color="red.500">Erro: {error}</Text>;
  }

  if (!product) {
    return <Text>Produto não encontrado.</Text>;
  }

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5;
    const startPage = Math.max(0, batchPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);

    const pages = [...Array(endPage - startPage + 1).keys()].map(
      (index) => startPage + index
    );

    return (
      <Flex justify="center" mt="4">
        <Stack direction={{ base: "column", md: "row" }} spacing="2">
          {batchPage > 1 && (
            <Button
              variant="outline"
              onClick={() => setBatchPage(0)}
              colorScheme="teal"
              size="sm"
            >
              Primeira
            </Button>
          )}
          {batchPage > 1 && (
            <Button
              variant="outline"
              onClick={() => setBatchPage(batchPage - 1)}
              colorScheme="teal"
              size="sm"
              ml={{ base: 0, md: 2 }}
              mt={{ base: 2, md: 0 }}
            >
              Anterior
            </Button>
          )}
          {pages.map((page) => (
            <Button
              key={page}
              size="sm"
              variant={batchPage === page ? "solid" : "outline"}
              onClick={() => setBatchPage(page)}
              colorScheme={batchPage === page ? "teal" : undefined}
              mt={{ base: 2, md: 0 }}
              mx={{ base: 1, md: 2 }}
            >
              {page + 1}
            </Button>
          ))}
          {batchPage < totalPages - 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setBatchPage(batchPage + 1)}
              colorScheme="teal"
              mt={{ base: 2, md: 0 }}
              mr={{ base: 0, md: 2 }}
            >
              Próxima
            </Button>
          )}
          {batchPage !== totalPages && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setBatchPage(totalPages - 1)}
              colorScheme="teal"
              mt={{ base: 2, md: 0 }}
            >
              Última
            </Button>
          )}
        </Stack>
      </Flex>
    );
  };

  return (
    <Box p="2">
      <Stack spacing="6">
        <Box>
          <Box
            p="6"
            borderWidth="0.5px"
            borderRadius="sm"
            shadow="sm"
            position="relative"
          >
            <Button
              onClick={() =>
                router.push(`/dashboard/product/upsert?id=${product.productId}`)
              }
              colorScheme="blue"
              position="absolute"
              top="4"
              right="4"
              size="sm"
            >
              Editar
            </Button>
            <VStack spacing="4" align="start">
              <Heading
                as="h1"
                size="md"
                fontWeight="bold"
                textShadow="1px 1px rgba(0, 0, 0, 0.2)"
                color="teal.600"
              >
                Detalhes do Produto
              </Heading>
              <Grid
                templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
                gap="6"
                w="full"
              >
                <GridItem>
                  <Image
                    src={product.image || generic}
                    alt={product.name}
                    objectFit="cover"
                    width="300"
                    height="200"
                    style={{
                      objectFit: "cover",
                      borderRadius: "0.375rem", 
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      cursor: "pointer",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.transform = "scale(1.05)")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  />
                </GridItem>

                <GridItem>
                  <Box>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Código:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.code}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Nome:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.name}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Descrição:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.description || "Não disponível"}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Categoria:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.categoryName}
                      </Text>
                    </Text>
                  </Box>
                </GridItem>
                <GridItem>
                  <Box>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Preço de venda:
                      <Text as="span" fontWeight="normal" ml="2">
                        {formatCurrency(product.price)}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Quantidade:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.quantity}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Quantidade Mínima:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.minimumQuantity}
                      </Text>
                    </Text>
                    <Text fontSize="md" mb="2" fontWeight="semibold">
                      Perissável:
                      <Text as="span" fontWeight="normal" ml="2">
                        {product.perishable ? "SIM" : "NÃO"}
                      </Text>
                    </Text>
                  </Box>
                </GridItem>
              </Grid>
            </VStack>
          </Box>
          <Box m="4" display="flex" justifyContent="right">
            <Button
              onClick={() => setIsModalOpen(true)}
              colorScheme="green"
              size="sm"
            >
              Registar Entrada
            </Button>
          </Box>

          <Heading as="h2" size="md">
            Lotes
          </Heading>
          <TableContainer mt="4">
            <Table variant="simple" size="sm">
              <Thead>
                <Tr>
                  <Th>Fornecedor</Th>
                  <Th>Data de Entrada</Th>
                  <Th>Data de Validade</Th>
                  <Th>Quantidade</Th>
                  <Th>Preço de Compra</Th>
                  <Th>Lucro por Unidade</Th>
                  <Th>Lucro Total</Th>
                  <Th>Margem de Lucro</Th>
                </Tr>
              </Thead>
              <Tbody>
                {batch.map((batchItem, index) => {
                  const purchasePricePerUnit =
                    (batchItem.price + batchItem.associatedCosts) /
                    batchItem.quantity; 
                  const profitPerUnit = product.price - purchasePricePerUnit;
                  const totalProfit = profitPerUnit * batchItem.quantity;
                  const profitMargin = (profitPerUnit / product.price) * 100;
                  return (
                    <Tr key={index}>
                      <Td>{batchItem.supplierName}</Td>
                      <Td>{formatDate(batchItem.entryDate)}</Td>
                      <Td>{formatDate(batchItem.expirationDate)}</Td>
                      <Td>{batchItem.quantity}</Td>
                      <Td>{formatCurrency(batchItem.price)} </Td>
                      <Td>{formatCurrency(profitPerUnit)} </Td>
                      <Td>{formatCurrency(totalProfit)} </Td>
                      <Td>{profitMargin.toFixed(2)}%</Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
          {renderPagination()}
        </Box>
      </Stack>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size="full"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Registrar Novo Lote</ModalHeader>
          <ModalCloseButton />
          <RegisterBatchForm
            onSubmit={handleRegisterBatch}
            onClose={() => setIsModalOpen(false)}
          />
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default ProductDetailsPage;
