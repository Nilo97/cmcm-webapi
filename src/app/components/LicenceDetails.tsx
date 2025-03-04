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
  useToast,
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
  FaExchangeAlt,
  FaCar,
  FaFileInvoice,
  FaPalette,
} from "react-icons/fa";
import jsPDF from "jspdf";
import { Licence } from "../actions/types";
import { useState } from "react";
import { convertToBook, downloadLicence } from "../actions/licence";
import { FaPersonMilitaryToPerson, FaPlateWheat } from "react-icons/fa6";

interface LicenceDetailsModalProps {
  isOpen: boolean;
  isConverting: boolean;
  onClose: () => void;
  handleConvert: (licence: Licence) => void;
  licence: Licence | null;
}

const LicenceDetailsModal: React.FC<LicenceDetailsModalProps> = ({
  isOpen,
  onClose,
  handleConvert,
  licence,
  isConverting,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!licence) return;
    setIsDownloading(true);
    const result = await downloadLicence(licence.id);

    if ("error" in result) {
      console.error("Download failed:", result.error);
    } else {
      const url = window.URL.createObjectURL(
        new Blob([result], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${licence.registrationNumber}.zip`); // Changed to .zip
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
          Detalhes da Licença
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody pb="6">
          {licence && (
            <VStack spacing="5" align="stretch">
              <Box p="4" borderRadius="md" bg="gray.50">
                <Stack spacing="3">
                  <Text>
                    <Icon as={FaHashtag} color="blue.500" /> Nº de licença :{" "}
                    {licence.licenceNumber}
                  </Text>

                  <Text>
                    <Icon as={FaPersonMilitaryToPerson} color="blue.500" /> Nº
                    de Matricula: {licence.registrationNumber}
                  </Text>
                  <Text>
                    <Icon as={FaTag} color="green.500" /> Marca: {licence.brand}
                  </Text>
                  <Text>
                    <Icon as={FaClipboardList} color="purple.500" /> Modelo:{" "}
                    {licence.model}
                  </Text>
                  <Text>
                    <Icon as={FaCalendar} color="orange.500" /> Ano:{" "}
                    {licence.manufactureYear}
                  </Text>
                  <Text>
                    <Icon as={FaBicycle} color="teal.500" /> Tipo:{" "}
                    {licence.bicycleType}
                  </Text>
                  <Text>
                    <Icon as={FaCog} color="blue.600" /> Nº de Motor:{" "}
                    {licence.engineNumber}
                  </Text>
                  <Text>
                    <Icon as={FaCogs} color="red.500" /> Capacidade Motor:{" "}
                    {licence.engineCapacity}
                  </Text>
                  <Text>
                    <Icon as={FaBarcode} color="gray.600" /> Nº de Quadro:{" "}
                    {licence.frameNumber}
                  </Text>
                  <Text>
                    <Icon as={FaUser} color="blue.500" /> Proprietário:{" "}
                    {licence.customerName}
                  </Text>

                  <Text>
                    <Icon as={FaFileInvoice} color="green.500" /> Factura:{" "}
                    {licence.invoice || "Não disponível"}
                  </Text>
                  <Text>
                    <Icon as={FaPalette} color="red.500" /> Cor:{" "}
                    {licence.color || "Não especificada"}
                  </Text>
                  <Text>
                    <Icon as={FaCar} color="purple.500" /> Circulação:{" "}
                    {licence.circulation || "Desconhecida"}
                  </Text>
                  <Divider />
                  <Text>
                    <Icon as={FaInfoCircle} color="yellow.600" /> Observações:{" "}
                    {licence.observations || "Nenhuma"}
                  </Text>
                  <Divider />
                </Stack>
              </Box>
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex justify="center" w="full">
            <Box display="flex" gap={4}>
              <Button
                leftIcon={<FaDownload />}
                colorScheme="teal"
                onClick={handleDownload}
                isLoading={isDownloading}
                loadingText="Baixando..."
              >
                Baixar Licença
              </Button>

              <Button
                leftIcon={<FaExchangeAlt />}
                colorScheme="orange"
                onClick={() => {
                  if (licence != null) {
                    handleConvert(licence);
                    onClose();
                  }
                }}
                isLoading={isConverting}
                loadingText="Convertendo..."
              >
                Converter em Livrete
              </Button>
            </Box>
          </Flex>
          ;
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default LicenceDetailsModal;
