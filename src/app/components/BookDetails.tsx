import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Stack,
  Box,
  Divider,
  VStack,
  Icon,
  Flex,
} from "@chakra-ui/react";
import {
  FaHashtag,
  FaTag,
  FaClipboardList,
  FaCalendar,
  FaBicycle,
  FaCog,
  FaCogs,
  FaBarcode,
  FaInfoCircle,
  FaUser,
  FaDownload,
} from "react-icons/fa";
import jsPDF from "jspdf";
import { Book } from "../actions/types";
import { useState } from "react";
import { downloadBook } from "../actions/book";

interface BookDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  book: Book | null;
}

const BookDetailsModal: React.FC<BookDetailsModalProps> = ({
  isOpen,
  onClose,
  book,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
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

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl">
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Detalhes do Livrete
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          {book && (
            <VStack spacing="5" align="stretch">
              <Box p="4" borderRadius="md" bg="gray.50">
                <Stack spacing="3">
                  <Text>
                    <Icon as={FaHashtag} color="blue.500" /> Nº Registro:{" "}
                    {book.registrationNumber}
                  </Text>
                  <Text>
                    <Icon as={FaTag} color="green.500" /> Marca: {book.brand}
                  </Text>
                  <Text>
                    <Icon as={FaClipboardList} color="purple.500" /> Modelo:{" "}
                    {book.model}
                  </Text>
                  <Text>
                    <Icon as={FaCalendar} color="orange.500" /> Ano:{" "}
                    {book.manufactureYear}
                  </Text>
                  <Text>
                    <Icon as={FaBicycle} color="teal.500" /> Tipo:{" "}
                    {book.bicycleType}
                  </Text>
                  <Text>
                    <Icon as={FaCog} color="blue.600" /> Nº Motor:{" "}
                    {book.engineNumber}
                  </Text>
                  <Text>
                    <Icon as={FaCogs} color="red.500" /> Capacidade Motor:{" "}
                    {book.engineCapacity}
                  </Text>
                  <Text>
                    <Icon as={FaBarcode} color="gray.600" /> Nº Quadro:{" "}
                    {book.frameNumber}
                  </Text>
                  <Text>
                    <Icon as={FaUser} color="blue.500" /> Proprietário:{" "}
                    {book.customerName}
                  </Text>
                  <Divider />
                  <Text>
                    <Icon as={FaInfoCircle} color="yellow.600" /> Observações:{" "}
                    {book.observations || "Nenhuma"}
                  </Text>
                </Stack>
              </Box>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            <Button
              leftIcon={<FaDownload />}
              colorScheme="blue"
              onClick={handleDownload}
              isLoading={isDownloading}
              loadingText="baixando..."
            >
              Baixar Livrete
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BookDetailsModal;
