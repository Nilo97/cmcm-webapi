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
import { fetchBooks, deleteBook } from "@/app/actions/book";
import { Book } from "@/app/actions/types";
import BookTable from "@/app/components/BookTable";

const PAGE_SIZE = 7;

const BooksPage: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    fetchAllBooks(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllBooks = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchBooks(PAGE_SIZE, page, searchQuery);
      if ("error" in data) {
        throw new Error(data.error);
      }
      setBooks(data.books);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar Livretes:", error);
      toast({
        title: "Erro ao buscar Livretes",
        description: "Ocorreu um erro ao buscar os Livretes.",
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

  const handleDelete = async (bookId: string) => {
    setLoading(true);
    try {
      const response = await deleteBook(bookId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "Livrete Deletado",
        description: "O Livrete foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllBooks(currentPage);
    } catch (error) {
      console.error("Erro ao deletar Livrete:", error);
      toast({
        title: "Erro ao deletar Livrete",
        description: "Ocorreu um erro ao deletar o Livrete.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book: Book) => {
    router.push(`/dashboard/book/upsert?id=${book.id}`);
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
        <Heading as="h1" size="lg" textShadow="1px 1px #ccc">
          Lista de Livretes
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/dashboard/book/upsert")}
          >
            Novo Livrete
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

      {loading ? (
        <Flex justify="center" align="center" height="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <BookTable
          books={books}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onSearch={handleSearch}
          loading={loading}
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default BooksPage;
