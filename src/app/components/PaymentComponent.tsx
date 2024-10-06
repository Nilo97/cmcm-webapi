import React, { useState } from "react";
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  useToast,
  useColorModeValue,
  Input,
  SimpleGrid,
  Switch,
  Spinner,
} from "@chakra-ui/react";
import Select from "react-select";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaMobileAlt,
  FaMoneyCheckAlt,
  FaRegCreditCard,
} from "react-icons/fa";
import { ReservationResponse } from "../actions/types";
import { calculateDuration, calculateDifference } from "../actions/commom";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import { createPayment } from "../actions/payment";

interface PaymentComponentProps {
  reservation: ReservationResponse;
  onclose: () => void;
}

const paymentOptions = [
  { value: "CASH", label: "Dinheiro", icon: <FaMoneyBillWave color="green" /> },
  { value: "MPESA", label: "M-Pesa", icon: <FaMobileAlt color="red" /> },
  { value: "EMOLA", label: "eMola", icon: <FaMoneyCheckAlt color="orange" /> },
  { value: "CARD", label: "Cartão", icon: <FaCreditCard color="purple" /> },
  {
    value: "BANK_TRANSFER",
    label: "Transferência Bancária",
    icon: <FaMoneyBillTransfer color="teal" />,
  },
  { value: "MKESH", label: "Mkesh", icon: <FaRegCreditCard color="yellow" /> },
  { value: "CHEQUE", label: "Cheque", icon: <FaRegCreditCard color="gray" /> },
];

const PaymentComponent: React.FC<PaymentComponentProps> = ({
  reservation,
  onclose,
}) => {
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [subtotal, setSubtotal] = useState<number>(() =>
    calculateDuration(
      reservation.checkInTime,
      reservation.checkOutTime,
      reservation?.pricePerHour ?? 0
    )
  );
  const [ivaEnabled, setIvaEnabled] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();

  const pricePerHour = reservation?.pricePerHour ?? 0;

  // Cálculo do IVA (16%)
  const ivaRate = 0.16;
  const ivaAmount = ivaEnabled ? subtotal * ivaRate : 0;

  // Cálculo do total
  const totalPrice = subtotal + ivaAmount;

  const handlePayment = async () => {
    if (!selectedPayment) {
      toast({
        title: "Método de pagamento não selecionado",
        description: "Por favor, selecione um método de pagamento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const paymentData = {
      reservationId: reservation.id,
      totalAmount: totalPrice,
      paymentMethod: selectedPayment.value,
    };

    setLoading(true);
    try {
      const result = await createPayment(paymentData);

      if ("error" in result) {
        toast({
          title: "Erro ao processar pagamento",
          description: result.error,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Pagamento registado com sucesso!",
          description: "Obrigado por realizar o pagamento.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        onclose(); // Fecha o componente após sucesso
      }
    } catch (error: any) {
      toast({
        title: "Erro inesperado",
        description:
          error.message || "Ocorreu um erro ao processar o pagamento.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubtotalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSubtotal = parseFloat(event.target.value);
    if (!isNaN(newSubtotal)) {
      setSubtotal(newSubtotal);
    }
  };

  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "6px 10px",
      borderColor: useColorModeValue("gray.300", "gray.600"),
      boxShadow: "none",
      "&:hover": { borderColor: useColorModeValue("gray.400", "gray.500") },
    }),
    option: (base: any) => ({
      ...base,
      display: "flex",
      alignItems: "center",
    }),
    singleValue: (base: any) => ({
      ...base,
      display: "flex",
      alignItems: "center",
    }),
  };

  const formatOptionLabel = ({
    label,
    icon,
  }: {
    label: string;
    icon: JSX.Element;
  }) => (
    <Flex align="center">
      {icon}
      <Text ml={2}>{label}</Text>
    </Flex>
  );

  return (
    <Box
      maxW="sm"
      mx="auto"
      mt={4}
      p={4}
      borderWidth={1}
      borderRadius="md"
      bg={useColorModeValue("white", "gray.700")}
      boxShadow="md"
    >
      <Heading mb={4} textAlign="center" size="lg">
        Efectuar Pagamento
      </Heading>

      <VStack spacing={4} as="form">
        <Box width="100%">
          <Select
            options={paymentOptions}
            value={selectedPayment}
            onChange={setSelectedPayment}
            styles={customStyles}
            formatOptionLabel={formatOptionLabel}
            placeholder="Escolha o método de pagamento"
          />
        </Box>

        <Divider />

        <SimpleGrid columns={2} spacing={4} mt={4}>
          <Box fontWeight="bold">Quarto:</Box>
          <Box>{reservation.roomNumber}</Box>

          <Box fontWeight="bold">Tempo gasto:</Box>
          <Box>
            {calculateDifference(
              reservation.checkInTime,
              reservation.checkOutTime
            )}{" "}
          </Box>

          <Box fontWeight="bold">Valor por hora:</Box>
          <Box>{pricePerHour} MT</Box>

          <Box fontWeight="bold">Subtotal:</Box>
          <Input
            type="number"
            value={subtotal.toFixed(2)}
            onChange={handleSubtotalChange}
            size="md"
          />

          <Box fontWeight="bold">
            <Flex align="center">
              <Text mr={2}>IVA (16%)</Text>
              <Switch
                isChecked={ivaEnabled}
                onChange={(e) => setIvaEnabled(e.target.checked)}
              />
            </Flex>
          </Box>

          <Box>{ivaAmount.toFixed(2)} MT</Box>

          <Box fontWeight="bold">Total:</Box>
          <Box fontWeight="bold">{totalPrice.toFixed(2)} MT</Box>
        </SimpleGrid>

        <Button
          colorScheme="purple"
          width="full"
          size="md"
          mt={6}
          onClick={handlePayment}
          isDisabled={loading}
        >
          {loading ? <Spinner size="sm" /> : "Confirmar Pagamento"}
        </Button>

        <Button
          variant="outline"
          colorScheme="red"
          width="full"
          size="md"
          mt={2}
          onClick={onclose}
        >
          Cancelar
        </Button>
      </VStack>
    </Box>
  );
};

export default PaymentComponent;
