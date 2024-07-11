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
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import ProductDetailsModal from "./ProductDetails";
import { Product } from "../types";

interface ProductTableProps {
  products: Product[];
  onDelete: (productId: number) => void;
  onEdit: (product: Product) => void;
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
  totalPages = 1,
  currentPage = 1,
  onPageChange,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [productIdToDelete, setProductIdToDelete] = useState<number | null>(
    null
  );

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const handleDelete = (productId: number) => {
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

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5; // Number of pages to show around the current page
    const startPage = Math.max(1, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + pagesToShow - 1);

    const pages = [...Array(endPage - startPage + 1).keys()].map(
      (index) => startPage + index
    );

    return (
      <Flex justify="center" mt="4">
        <Stack direction="row" spacing="2">
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => handlePageChange(1)}
              colorScheme="teal"
            >
              Primeira
            </Button>
          )}
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              colorScheme="teal"
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
            >
              {page}
            </Button>
          ))}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              colorScheme="teal"
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
            placeholder="Pesquisar produto..."
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e: any) => {
              e.key === "Enter" ? onSearch(e.target.value) : null;
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
                    <Td>{product.code}</Td>
                    <Td>{product.name}</Td>
                    <Td>{product.description}</Td>
                    <Td>{product.categoryName}</Td>
                    <Td>{product.price}</Td>
                    <Td>{product.quantity}</Td>
                    <Td>
                      <Button
                        size="sm"
                        leftIcon={<ViewIcon />}
                        onClick={() => handleViewDetails(product)}
                      >
                        Ver
                      </Button>
                      <Button
                        ml="2"
                        size="sm"
                        leftIcon={<EditIcon />}
                        onClick={() => onEdit(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        size="sm"
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
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />

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
