import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Text,
  Stack,
  Box,
  Divider,
  VStack,
  Icon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Button,
} from "@chakra-ui/react";
import {
  FaIdCard,
  FaPhone,
  FaUser,
  FaBook,
  FaLocationArrow,
  FaDownload,
} from "react-icons/fa";
import { customer, Book, Licence } from "../actions/types";
import { downloadBook, fetchBooksByCustomer } from "../actions/book";
import { DownloadIcon } from "@chakra-ui/icons";
import { FaBookAtlas } from "react-icons/fa6";
import { downloadLicence, fetchlicenceByCustomer } from "../actions/licence";

interface CustomerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: customer | null;
}

const CustomerDetailsModal: React.FC<CustomerDetailsModalProps> = ({
  isOpen,
  onClose,
  customer,
}) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [licences, setLicences] = useState<Licence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isLicenceDownloading, setIsLicenceDownloading] = useState(false);

  const handleDownload = async (book: any) => {
    if (!book) return;
    setIsDownloading(true);
    const result = await downloadBook(book.id);

    if ("error" in result) {
      console.error("Download failed:", result.error);
    } else {
      const url = window.URL.createObjectURL(
        new Blob([result], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${book.registrationNumber}.zip`); // Changed to .zip
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    setIsDownloading(false);
  };

  const handleLicenceDownload = async (licence: Licence) => {
    if (!licence) return;
    setIsLicenceDownloading(true);
    const result = await downloadLicence(licence.id);

    if ("error" in result) {
      console.error("Download failed:", result.error);
    } else {
      const url = window.URL.createObjectURL(
        new Blob([result], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${licence.licenceNumber}.zip`); // Changed to .zip
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    setIsLicenceDownloading(false);
  };

  useEffect(() => {
    if (isOpen && customer) {
      fetchCustomerBooks(customer.id);
      fetchCustomerLicences(customer.id);
    }
  }, [isOpen, customer]);

  const fetchCustomerBooks = async (customerId: string) => {
    setLoading(true);
    setError(null);

    const response = await fetchBooksByCustomer(customerId);

    if ("error" in response) {
      setError(response.error);
    } else {
      setBooks(response.books);
    }

    setLoading(false);
  };

  const fetchCustomerLicences = async (customerId: string) => {
    setLoading(true);
    setError(null);

    const response = await fetchlicenceByCustomer(customerId);

    if ("error" in response) {
      setError(response.error);
    } else {
      setLicences(response.licence);
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl">
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Detalhes do Proprietário
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          {customer && (
            <VStack spacing="5" align="stretch">
              {/* Dados Pessoais */}
              <Box p="4" borderRadius="md" bg="gray.50">
                <Stack spacing="3">
                  <Text fontSize="lg" fontWeight="bold">
                    <Icon as={FaUser} color="blue.500" /> {customer.name}
                  </Text>
                  <Text>
                    <Icon as={FaIdCard} color="green.500" />{" "}
                    <strong>Documento:</strong> {customer.documentNumber}
                  </Text>
                  <Text>
                    <Icon as={FaPhone} color="purple.500" />{" "}
                    <strong>Contacto:</strong> {customer.phoneNumber}
                  </Text>
                  <Text>
                    <Icon as={FaLocationArrow} color="purple.500" />{" "}
                    <strong>Endereço:</strong> {customer.address}
                  </Text>
                </Stack>
              </Box>

              <Divider />

              {/* Título da Tabela */}
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb="2">
                  <Icon as={FaBook} color="orange.500" /> Livretes do
                  Proprietário
                </Text>
              </Box>

              {/* Loading / Error / Books Table */}
              {loading ? (
                <Spinner size="lg" />
              ) : error ? (
                <Text color="red.500">{error}</Text>
              ) : books.length > 0 ? (
                <Box w="100%" overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Nº Registro</Th>
                        <Th>Marca</Th>
                        <Th>Modelo</Th> <Th>Baixar</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {books.map((book) => (
                        <Tr key={book.id}>
                          <Td>{book.registrationNumber}</Td>
                          <Td>{book.brand}</Td>
                          <Td>{book.model}</Td>
                          <Td>
                            <Button
                              size="xs"
                              leftIcon={<DownloadIcon />}
                              onClick={() => handleDownload(book)}
                              isLoading={isDownloading}
                              loadingText="baixando..."
                            >
                              Baixar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text textAlign="center">Nenhum livrete encontrado.</Text>
              )}

              {/* Título da Tabela */}
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb="2">
                  <Icon as={FaBookAtlas} color="blue.500" /> Licenças do
                  Proprietário
                </Text>
              </Box>

              {/* Loading / Error / Books Table */}
              {loading ? (
                <Spinner size="lg" />
              ) : error ? (
                <Text color="red.500">{error}</Text>
              ) : books.length > 0 ? (
                <Box w="100%" overflowX="auto">
                  <Table variant="simple">
                    <Thead>
                      <Tr>
                        <Th>Nº de licença </Th>
                        <Th>observações</Th>

                        <Th>Circulação</Th>
                        <Th>Baixar</Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {licences.map((licence) => (
                        <Tr key={licence.id}>
                          <Td>{licence.licenceNumber}</Td>
                          <Td>{licence.obs}</Td>
                          <Td>-</Td>
                          <Td>
                            <Button
                              size="xs"
                              leftIcon={<DownloadIcon />}
                              onClick={() => handleLicenceDownload(licence)}
                              isLoading={isLicenceDownloading}
                              loadingText="baixando..."
                            >
                              Baixar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </Box>
              ) : (
                <Text textAlign="center">Nenhuma licença encontrada.</Text>
              )}
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomerDetailsModal;
