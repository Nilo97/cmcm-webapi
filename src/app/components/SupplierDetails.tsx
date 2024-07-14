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
} from "@chakra-ui/react";
import { Supplier } from "../types";

interface SupplierDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

const SupplierDetailsModal: React.FC<SupplierDetailsModalProps> = ({
  isOpen,
  onClose,
  supplier,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes do Fornecedor</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="2">
          {supplier && (
            <Stack spacing="4">
              <Text>
                <strong>Nome:</strong> {supplier.name}
              </Text>
              <Text>
                <strong>Contacto:</strong> {supplier.contactInfo}
              </Text>
              <Text>
                <strong>Criado Por:</strong> Faruque Braimo
              </Text>
              <Text>
                <strong>Criado aos:</strong> 20/08/2024
              </Text>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SupplierDetailsModal;
