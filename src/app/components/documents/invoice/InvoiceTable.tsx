"use client";

import React, { useState } from "react";
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
  Spinner,
  Highlight,
  Badge,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  useBreakpointValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import {
  EditIcon,
  DeleteIcon,
  SearchIcon,
  ViewIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import { InvoiceResponse } from "@/app/actions/types";
import { formatDate } from "@/app/actions/util";
import { FaSignOutAlt } from "react-icons/fa";
import { FaDollarSign } from "react-icons/fa6";

interface InvoiceTableProps {
  invoices: InvoiceResponse[];
  onEdit: (invoice: InvoiceResponse) => void;
  onDetails: (invoice: InvoiceResponse) => void;
  onPayment: () => void;
  onSearch: (value: string) => void;
  onPay: (invoice: InvoiceResponse) => void;
  loading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
}

const InvoiceTable: React.FC<InvoiceTableProps> = ({
  invoices,
  onEdit,
  onPayment,
  onSearch,
  loading,
  totalPages = 0,
  currentPage = 0,
  onPageChange,
  onDetails,
  onPay,
}) => {
  const [selectedInvoice, setSelectedInvoice] =
    useState<InvoiceResponse | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [query, setQuery] = useState<string>("");

  const handleQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 5;
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

  const handleCloseModal = () => {
    setSelectedInvoice(null);
    onClose();
    onPayment();
  };

  return (
    <Stack spacing="4">
      <Accordion allowToggle mb="4">
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Filtros e Busca
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Flex
              direction="column"
              mb="4"
              p="4"
              bg="gray.50"
              borderRadius="md"
              boxShadow="md"
            >
              <Flex
                direction={{ base: "column", md: "row" }}
                mb="4"
                align="center"
                justify="space-between"
              >
                <InputGroup
                  size="sm"
                  mb={{ base: "4", md: "0" }}
                  mr={{ base: "0", md: "4" }}
                >
                  <InputLeftElement pointerEvents="none">
                    <SearchIcon color="gray.300" />
                  </InputLeftElement>
                  <Input
                    placeholder="Pesquisar fatura"
                    onChange={handleQuery}
                    variant="filled"
                  />
                </InputGroup>
                <Button
                  borderRadius="md"
                  bgGradient="linear(to-r, teal.500, green.500)"
                  size="sm"
                  color="white"
                >
                  Aplicar Filtros
                </Button>
              </Flex>
            </Flex>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <TableContainer>
            <Table variant="simple" fontSize="sm">
              <TableCaption>Lista de Faturas</TableCaption>
              <Thead>
                <Tr>
                  <Th>Criado aos</Th>
                  <Th>Cliente</Th>
                  <Th>Data da Factura</Th>
                  <Th>Data de Validade</Th>
                  <Th>Termos de Pagamento</Th>
                  <Th>Status</Th>
                  <Th>Ações</Th>
                </Tr>
              </Thead>
              <Tbody>
                {invoices.map((invoice) => (
                  <Tr key={invoice.id}>
                    <Td>{formatDate(invoice.createdAt)}</Td>
                    <Td>{invoice.customer}</Td>
                    <Td>{formatDate(invoice.dueDate)}</Td>
                    <Td>{formatDate(invoice.documentDate)}</Td>
                    <Td>{invoice.paymentTerms}</Td>
                    <Td>{invoice.paymentStatus}</Td>
                    <Td>
                      <Menu>
                        <MenuButton
                          ml="2"
                          size="xs"
                          as={Button}
                          rightIcon={<ChevronDownIcon />}
                        >
                          Ações
                        </MenuButton>
                        <MenuList>
                          <MenuItem icon={<FaDollarSign />} onClick={() => {}}>
                            Efectuar Pagamento
                          </MenuItem>
                          <MenuItem icon={<FaSignOutAlt />}>Cancelar </MenuItem>
                          <MenuItem icon={<EditIcon />}>Baixar</MenuItem>
                          <MenuItem icon={<ViewIcon />}>Ver detalhes</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          {renderPagination()}

          <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
              <ModalCloseButton />
              <ModalBody>
                {/* {selectedInvoice &&
                  //   <PaymentComponent
                  //     invoice={selectedInvoice}
                  //     onClose={handleCloseModal}
                  //   />
                  payment} */}
              </ModalBody>
            </ModalContent>
          </Modal>
        </>
      )}
    </Stack>
  );
};

export default InvoiceTable;
