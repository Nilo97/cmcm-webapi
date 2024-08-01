"use client";
import React, { useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Stack,
  TableContainer,
  TableCaption,
  Flex,
  InputGroup,
  InputLeftElement,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Spinner,
  Highlight,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { Product } from "../types";
import { limitText } from "../actions/util";

interface ProductTableProps {
  products: Product[];
  onDelete: (productId: string) => void;
  onEdit: (product: Product) => void;
  onDetails: (product: Product) => void;
  onSearch: (value: string) => void;
  loading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
  onEdit,
  onSearch,
  loading,
  totalPages = 0,
  currentPage = 0,
  onPageChange,
  onDetails,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<string | null>(
    null
  );

  const handleViewDetails = (product: Product) => {
    onDetails(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = (productId: string) => {
    setProductIdToDelete(productId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productIdToDelete !== null) {
      onDelete(productIdToDelete);
      setProductIdToDelete(null);
      setDeleteConfirmationOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setProductIdToDelete(null);
    setDeleteConfirmationOpen(false);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const handleQuery = (e: any) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5; // Número de páginas para mostrar ao redor da página atual
    const startPage = Math.max(0, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);

    const pages = [...Array(endPage - startPage + 1).keys()].map(
      (index) => startPage + index
    );

    return (
      <Flex justify="center" mt="4">
        <Stack direction={{ base: "column", md: "row" }} spacing="2">
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => handlePageChange(0)}
              colorScheme="teal"
              size="sm"
            >
              Primeira
            </Button>
          )}
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
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
              variant={currentPage === page ? "solid" : "outline"}
              onClick={() => handlePageChange(page)}
              colorScheme={currentPage === page ? "teal" : undefined}
              mt={{ base: 2, md: 0 }}
              mx={{ base: 1, md: 2 }}
            >
              {page + 1}
            </Button>
          ))}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              colorScheme="teal"
              mt={{ base: 2, md: 0 }}
              mr={{ base: 0, md: 2 }}
            >
              Próxima
            </Button>
          )}
          {currentPage !== totalPages && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => handlePageChange(totalPages)}
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
    <Stack spacing="4">
      <Flex align="center" justify="center">
        <InputGroup size={{ base: "sm", md: "md" }} maxW="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar produto (Nome, Código, Descrição)... "
            onChange={(e) => handleQuery(e)}
            onKeyDown={(e: any) => {
              e.key === "Enter" ? handleQuery(e) : null;
            }}
            variant="filled"
          />
        </InputGroup>
      </Flex>
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <TableContainer>
            <Table
              variant="simple"
              fontSize={{ base: "xs", md: "sm" }}
              size="sm"
            >
              <TableCaption>Provided by Job Savana</TableCaption>
              <Thead>
                <Tr>
                  <Th>Código</Th>
                  <Th>Nome</Th>
                  <Th>Descrição</Th>
                  <Th>Categoria</Th>
                  <Th>Preço</Th>
                  <Th>Quantidade</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <Tr key={product.id}>
                    <Td>
                      <Highlight
                        query={query}
                        styles={{ px: "1", py: "1", bg: "orange.100" }}
                      >
                        {product.code}
                      </Highlight>
                    </Td>
                    <Td>
                      <Highlight
                        query={query}
                        styles={{ px: "1", py: "1", bg: "orange.100" }}
                      >
                        {limitText(product.name, 70)}
                      </Highlight>
                    </Td>
                    <Td>
                      <Highlight
                        query={query}
                        styles={{ px: "1", py: "1", bg: "orange.100" }}
                      >
                        {limitText(product.description, 20)}
                      </Highlight>
                    </Td>
                    <Td>{product.categoryName}</Td>
                    <Td>{product.price}</Td>
                    <Td>{product.quantity}</Td>
                    <Td>
                      <Button
                        size="xs"
                        leftIcon={<ViewIcon />}
                        onClick={() => handleViewDetails(product)}
                      >
                        Gerir
                      </Button>
                      <Button
                        ml="2"
                        size="xs"
                        leftIcon={<EditIcon />}
                        onClick={() => onEdit(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="xs"
                        colorScheme="red"
                        leftIcon={<DeleteIcon />}
                        ml="2"
                        onClick={() => handleDelete(product.id)}
                      >
                        Excluir
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {renderPagination()}
        </>
      )}

      <AlertDialog
        isOpen={deleteConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={handleCancelDelete}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar exclusão
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir este produto?
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={handleCancelDelete}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleConfirmDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Stack>
  );
};

export default ProductTable;
