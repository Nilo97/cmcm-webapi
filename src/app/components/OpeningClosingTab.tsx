import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  useToast,
  Center,
  HStack,
  Icon,
  InputGroup,
  InputLeftElement,
  InputRightElement,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { FaCashRegister, FaSignOutAlt } from "react-icons/fa";
import { openCashFlow, closeCashFlow } from "../actions/chashflow";
import { CashFlowResponse } from "../types"; // Ajusta o caminho conforme necessário
import { formatCurrency } from "../actions/util";
import { CheckIcon } from "@chakra-ui/icons";

export const OpeningClosingTab = ({
  cashFlow,
}: {
  cashFlow: CashFlowResponse | null;
}) => {
  const [isCashOpen, setIsCashOpen] = useState(false);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    if (cashFlow) {
      setIsCashOpen(cashFlow.status === "OPENED");
      setOpeningBalance(cashFlow.totalAmount);
      setTotalAmount(cashFlow.totalAmount || 0);
    }
  }, [cashFlow]);

  const handleOpenCashRegister = async () => {
    try {
      const response = await openCashFlow({
        openingBalance: openingBalance,
      });
      if ("error" in response) {
        throw new Error(response.error);
      }
      setIsCashOpen(true);
      setTotalAmount(openingBalance);

      toast({
        title: "Caixa aberto com sucesso.",
        description: `Saldo inicial: ${formatCurrency(openingBalance)}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao abrir caixa.",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCloseCashRegister = async () => {
    try {
      const response = await closeCashFlow();
      if ("error" in response) {
        throw new Error(response.error);
      }
      setIsCashOpen(false);
      setTotalAmount(0);
      setOpeningBalance(0);

      toast({
        title: "Caixa fechado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Erro ao fechar caixa.",
        description: (error as Error).message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Center>
      <Box
        p={10}
        borderRadius="lg"
        boxShadow="xl"
        w="90%"
        maxW="500px"
        bg="white"
        textAlign="center"
        borderWidth={1}
        borderColor="gray.200"
      >
        <VStack spacing={6} align="stretch">
          {!isCashOpen ? (
            <>
              <FormControl>
                <FormLabel fontSize="lg" fontWeight="bold" color="gray.700">
                  Saldo Inicial
                </FormLabel>

                <InputGroup>
                  <Input
                    type="number"
                    value={openingBalance}
                    onChange={(e) => setOpeningBalance(Number(e.target.value))}
                    placeholder="Insira o saldo inicial"
                    variant="outline"
                  />
                  <InputRightElement
                    pointerEvents="none"
                    color="gray.300"
                    fontSize="1.2em"
                  >
                    MT
                  </InputRightElement>
                </InputGroup>
              </FormControl>
              <Button
                colorScheme="teal"
                onClick={handleOpenCashRegister}
                width="full"
                leftIcon={<Icon as={FaCashRegister} />}
                size="lg"
                fontSize="lg"
              >
                Abrir Caixa
              </Button>
            </>
          ) : (
            <>
              <Box textAlign="center">
                <Text
                  fontSize="2xl"
                  color="green.600"
                  fontWeight="bold"
                  lineHeight="1.2"
                >
                  {formatCurrency(totalAmount)}
                </Text>
                <Text fontSize="md" color="gray.600" mt={1}>
                  Saldo Actual
                </Text>
              </Box>

              <Button
                colorScheme="red"
                onClick={handleCloseCashRegister}
                width="full"
                leftIcon={<Icon as={FaSignOutAlt} />}
                size="lg"
                fontSize="lg"
              >
                Fechar Caixa
              </Button>
            </>
          )}
        </VStack>
      </Box>
    </Center>
  );
};
