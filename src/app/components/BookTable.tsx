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
import { limitText } from "../actions/util";
import { Book, Brand, BicycleType } from "../actions/types";
import CustomerDetailsModal from "./CustomerDetails";
import BookDetailsModal from "./BookDetails";

interface BookTableProps {
  books: Book[];
  onDelete: (bookId: string) => void;
  onEdit: (book: Book) => void;
  onSearch: (value: string) => void;
  loading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const BookTable: React.FC<BookTableProps> = ({
  books,
  onDelete,
  onEdit,
  onSearch,
  loading,
  totalPages = 0,
  currentPage = 0,
  onPageChange,
}) => {
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [bookIdToDelete, setBookIdToDelete] = useState<string | null>(null);

  const handleViewDetails = (book: Book) => {
    setSelectedBook(book);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedBook(null);
    setIsModalOpen(false);
  };

  const handleDelete = (bookId: string) => {
    setBookIdToDelete(bookId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = () => {
    if (bookIdToDelete !== null) {
      onDelete(bookIdToDelete);
      setBookIdToDelete(null);
      setDeleteConfirmationOpen(false);
    }
  };

  return (
    <Stack spacing="4">
      <Flex align="center" justify="center">
        <InputGroup size={{ base: "sm", md: "md" }} maxW="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar Livrete (Matricula, Marca, Modelo)..."
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
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
        <TableContainer>
          <Table variant="simple" fontSize={{ base: "xs", md: "sm" }} size="sm">
            <TableCaption>Provided by Prifuturo Consultoria</TableCaption>
            <Thead>
              <Tr>
                <Th>Nº de Matricula</Th>
                <Th>Marca</Th>
                <Th>Modelo</Th>
                <Th>Ano</Th>
                <Th>Tipo</Th>
                <Th>Nº Motor</Th>
                {/* <Th>Nº Quadro</Th> */}

                <Th>Proprietário</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {books.map((book) => (
                <Tr key={book.id}>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(book.registrationNumber, 20)}
                    </Highlight>
                  </Td>
                  <Td>{book.brand}</Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(book.model, 20)}
                    </Highlight>
                  </Td>
                  <Td>{book.manufactureYear}</Td>
                  <Td>{book.bicycleType}</Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(book.engineNumber, 20)}
                    </Highlight>
                  </Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(book.customerName, 20)}
                    </Highlight>
                  </Td>
                  <Td>
                    <Button
                      size="xs"
                      leftIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(book)}
                    >
                      Ver mais detalhes
                    </Button>
                    {/* <Button
                      ml="2"
                      size="xs"
                      leftIcon={<EditIcon />}
                      onClick={() => onEdit(book)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="xs"
                      colorScheme="red"
                      leftIcon={<DeleteIcon />}
                      ml="2"
                      onClick={() => handleDelete(book.id)}
                    >
                      Excluir
                    </Button> */}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <BookDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        book={selectedBook}
      />

      <AlertDialog
        isOpen={deleteConfirmationOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setDeleteConfirmationOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirmar exclusão
            </AlertDialogHeader>
            <AlertDialogBody>
              Tem certeza que deseja excluir este livrete?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setDeleteConfirmationOpen(false)}
              >
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

export default BookTable;
