"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Spinner,
  Table,
  TableCaption,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Button,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { CashFlowResponse } from "@/app/types";
import {
  formatCurrency,
  formatDate,
  formatTime,
  translateStatus,
  statusColor,
} from "@/app/actions/util";
import {
  fetchOpenedCashFlowsSummary,
  fetchPaginatedCashFlows,
} from "@/app/actions/chashflow";

const CashRegister = () => {
  const [cashFlows, setCashFlows] = useState<CashFlowResponse[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const toast = useToast();

  useEffect(() => {
    const loadPaginatedCashFlows = async (page: number, size: number) => {
      setLoading(true);
      const result = await fetchPaginatedCashFlows(page, size);
      if ("error" in result) {
        setError(result.error);
        toast({
          title: "Erro ao carregar fluxos de caixa",
          description: result.error,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      } else {
        setCashFlows(result.cashFlows);
        setTotalPages(result.totalPages);
      }
      setLoading(false);
    };

    const fetchSummary = async () => {
      try {
        const result = await fetchOpenedCashFlowsSummary();
        if ("error" in result) {
          toast({
            title: "Erro ao carregar saldo",
            description: result.error,
            status: "error",
            duration: 9000,
            isClosable: true,
          });
          return;
        }

        setTotalAmount(result.totalAmount);
      } catch (error) {
        toast({
          title: "Erro inesperado",
          description: "Ocorreu um erro ao tentar carregar o saldo.",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    };

    fetchSummary();
    loadPaginatedCashFlows(currentPage, 10); // Buscar 10 registros por página
  }, [currentPage, toast]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [...Array(totalPages).keys()];

    return (
      <Flex justify="center" mt="4">
        <Stack direction="row" spacing="2">
          {pages.map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              onClick={() => handlePageChange(page)}
              colorScheme={currentPage === page ? "teal" : undefined}
            >
              {page + 1}
            </Button>
          ))}
        </Stack>
      </Flex>
    );
  };

  return (
    <Container maxW="container.xl" mt="1" p={4}>
      <Flex justify="space-between" align="center" mb="4" w="100%">
        <Heading
          as="h1"
          size="lg"
          mb={{ base: 4, md: 0 }}
          textShadow="1px 1px #ccc"
          color="teal.400"
        >
          Fluxo de Caixa
        </Heading>

        <Heading as="h2" size="md" color="teal.400">
          Saldo: {formatCurrency(totalAmount)}
        </Heading>
      </Flex>

      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : error ? (
        <Box color="red.500">{error}</Box>
      ) : (
        <>
          <TableContainer>
            <Table variant="simple" size="sm">
              <TableCaption>Provided by Mosprey Innovations</TableCaption>
              <Thead>
                <Tr>
                  <Th>Dia</Th>
                  <Th>Hora de Abertura</Th>
                  <Th>Hora de Fechamento</Th>
                  <Th>Montante Inicial</Th>
                  <Th>Total Vendido</Th>
                  <Th>Utilizador</Th>
                  <Th>Estado</Th>
                </Tr>
              </Thead>
              <Tbody>
                {cashFlows.map((cashFlow) => (
                  <Tr key={cashFlow.id}>
                    <Td>{formatDate(cashFlow.openingTime)}</Td>
                    <Td>{formatTime(cashFlow.openingTime)}</Td>
                    <Td>{formatTime(cashFlow.closingTime)}</Td>
                    <Td>{formatCurrency(cashFlow.openingBalance)}</Td>
                    <Td>{formatCurrency(cashFlow.totalAmount)}</Td>
                    <Td>{cashFlow.userName}</Td>
                    <Td color={statusColor(cashFlow.status)}>
                      {translateStatus(cashFlow.status)}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>

          {renderPagination()}
        </>
      )}
    </Container>
  );
};

export default CashRegister;
