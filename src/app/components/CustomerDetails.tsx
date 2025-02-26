import React from "react";
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
  Badge,
  Icon,
} from "@chakra-ui/react";
import {
  FaIdCard,
  FaPhone,
  FaUser,
  FaBook,
  FaLocationArrow,
} from "react-icons/fa";
import { customer } from "../actions/types";

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
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="lg" boxShadow="xl">
        <ModalHeader textAlign="center" fontSize="2xl" fontWeight="bold">
          Detalhes do Utente
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
                  <Text>
                    <strong>Criado aos:</strong> 20/08/2024
                  </Text>
                </Stack>
              </Box>

              <Divider />

              {/* Livretes do Utente */}
              <Box>
                <Text fontSize="xl" fontWeight="bold" mb="2">
                  <Icon as={FaBook} color="orange.500" /> Livretes do Utente
                </Text>
                {/* {customer.books && customer.books.length > 0 ? (
                  <VStack align="stretch" spacing="3">
                    {customer.books.map((book, index) => (
                      <Box
                        key={index}
                        p="3"
                        bg="blue.50"
                        borderRadius="md"
                        boxShadow="sm"
                      >
                        <Stack spacing="1">
                          <Text>
                            <strong>Matrícula:</strong>{" "}
                            {book.registrationNumber}
                          </Text>
                          <Text>
                            <strong>Marca:</strong> {book.brand}
                          </Text>
                          <Text>
                            <strong>Modelo:</strong> {book.model}
                          </Text>
                          <Badge colorScheme="blue">{book.bicycleType}</Badge>
                        </Stack>
                      </Box>
                    ))}
                  </VStack>
                ) : (
                  <Text color="gray.500">Nenhum livrete encontrado.</Text>
                )} */}
              </Box>
            </VStack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default CustomerDetailsModal;
