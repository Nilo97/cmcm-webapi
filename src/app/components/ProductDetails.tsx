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

interface Product {
  name: string;
  description: string;
  price: number;
}

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
        <ModalBody>
          {product && (
            <Stack spacing="4">
              <Text>
                <strong>Nome:</strong> {product.name}
              </Text>
              <Text>
                <strong>Descrição:</strong> {product.description}
              </Text>
              <Text>
                <strong>Preço:</strong> {product.price}
              </Text>
            </Stack>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProductDetailsModal;
