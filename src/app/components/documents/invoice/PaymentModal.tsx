import React, { useState } from "react";
import {
  Box,
  Button,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useToast,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { payInvoice } from "@/app/actions/invoice";
import Select, { SingleValue } from "react-select";
import { formatOptionLabel, paymentOptions } from "@/app/actions/shared";
import { formatCurrency } from "@/app/actions/util";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPayment: () => void;
  invoice: {
    docId: string;
    reference: string;
    total: number;
  } | null;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onPayment,
  invoice,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const handlePaymentSubmit = async () => {
    if (!selectedPayment || !invoice) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione um método de pagamento.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await payInvoice({
        paymentMethod: selectedPayment.value,
        docId: invoice.docId,
      });

      if (response.error) {
        toast({
          title: "Erro",
          description: response.error,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Sucesso",
          description: "Pagamento realizado com sucesso.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onPayment();
        onClose();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao realizar o pagamento.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent
        borderRadius="lg"
        boxShadow="lg"
        maxW="400px"
        p={4}
        bg={useColorModeValue("white", "gray.800")}
      >
        <ModalHeader fontSize="lg" fontWeight="bold" textAlign="center">
          Efectuar Pagamento
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {invoice ? (
            <Box mb={4}>
              <Text
                fontSize="md"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                <strong>Referência:</strong> {invoice.reference}
              </Text>
              <Text fontSize="lg" fontWeight="medium" color="green.500">
                <strong>Total:</strong> {formatCurrency(invoice.total)}
              </Text>
              <Box mt={4}>
                <Select
                  options={paymentOptions}
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                  formatOptionLabel={formatOptionLabel}
                  placeholder="Escolha o método de pagamento"
                  styles={{
                    control: (base) => ({
                      ...base,
                      borderRadius: "md",
                      borderColor: useColorModeValue("#CBD5E0", "#4A5568"),
                      "&:hover": {
                        borderColor: useColorModeValue("#A0AEC0", "#2D3748"),
                      },
                    }),
                  }}
                />
              </Box>
            </Box>
          ) : (
            <Text
              fontSize="md"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              Informações da fatura não disponíveis.
            </Text>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="red"
            variant="outline"
            mr={3}
            size="sm"
            onClick={onClose}
            _hover={{ bg: useColorModeValue("blue.50", "blue.900") }}
          >
            Cancelar
          </Button>
          <Button
            colorScheme="teal"
            onClick={handlePaymentSubmit}
            isLoading={loading}
            size="sm"
            spinner={<Spinner size="sm" />}
          >
            Confirmar Pagamento
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default PaymentModal;
