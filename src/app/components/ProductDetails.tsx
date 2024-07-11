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
import { Product } from "../types";

interface ProductDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
}

const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  isOpen,
  onClose,
  product,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Detalhes do Produto</ModalHeader>
        <ModalCloseButton />
        <ModalBody mb="2">
          {product && (
            <Stack spacing="4">
              <Text>
                <strong>Nome:</strong> {product.name}
              </Text>
              <Text>
                <strong>Descrição:</strong> {product.description}
              </Text>
              <Text>
                <strong>Code:</strong> {product.code}
              </Text>
              <Text>
                <strong>Categoria:</strong> {product.categoryName}
              </Text>
              <Text>
                <strong>Quantidade:</strong> {product.quantity}
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

export default ProductDetailsModal;
