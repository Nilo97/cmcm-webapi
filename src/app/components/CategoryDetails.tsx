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
import { Category } from "../types";


interface CategoryDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category | null;
}

const CategoryDetailsModal: React.FC<CategoryDetailsModalProps> = ({
  isOpen,
  onClose,
  category,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes da Categoria</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="2">
          {category && (
            <Stack spacing="4">
              <Text>
                <strong>Nome:</strong> {category.name}
              </Text>
              <Text>
                <strong>Descrição:</strong> {category.description}
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

export default CategoryDetailsModal;
