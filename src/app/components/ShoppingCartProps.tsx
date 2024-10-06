import React from "react";
import {
  Box,
  Flex,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  Divider,
} from "@chakra-ui/react";
import Select, { SingleValue } from "react-select";
import CartTable from "./CartTable";

interface Option {
  value: string;
  label: string;
}

interface ShoppingCartProps {
  cart: any[];
  removeFromCart: (id: string) => void;
  handleQuantityChange: (id: string, newQuantity: number) => void;
  handleDiscountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selectedCustomer: Option | null;
  setSelectedCustomer: (value: SingleValue<Option>) => void;
  paymentOptions: Option[];
  clientOptions: Option[];
  selectedPayment: Option | null;
  setSelectedPayment: (value: SingleValue<Option>) => void;
  payment: number | "";
  handlePaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleFinishSale: () => void;
  discount: number;
  getTotal: () => number;
  getTax: () => number;
  getTotalWithTax: () => number;
  isSubmitting: boolean;
  change: number;
  formatCurrency: (amount: number) => string;
  isSale: boolean;
}

const ShoppingCart: React.FC<ShoppingCartProps> = ({
  cart,
  removeFromCart,
  handleQuantityChange,
  handleDiscountChange,
  selectedCustomer,
  setSelectedCustomer,
  paymentOptions,
  clientOptions,
  selectedPayment,
  setSelectedPayment,
  payment,
  handlePaymentChange,
  handleFinishSale,
  discount,
  getTotal,
  getTax,
  getTotalWithTax,
  isSubmitting,
  change,
  formatCurrency,
  isSale,
}) => {
  return (
    <Box width={{ base: "100%", md: "60%" }} ml={4}>
      <Flex direction="column" height="100%" overflow="hidden">
        <Box bg="white" p={4} borderRadius="md" boxShadow="md" flex="1">
          <Text fontSize="lg" fontWeight="bold" mb={4}>
            Carrinho de Compras
          </Text>
          {cart.length === 0 ? (
            <Text>Pronto para processar produtos.</Text>
          ) : (
            <Box overflowY="auto" maxHeight="350px">
              <CartTable
                cartItems={cart}
                onRemoveItem={removeFromCart}
                onChangeQuantity={handleQuantityChange}
                onChangeTax={(id: string, newTax: string): void => {
                  throw new Error("Function not implemented.");
                }}
              />
            </Box>
          )}
        </Box>

        <Box bg="gray.50" p={4} borderRadius="md" boxShadow="lg" mt={4}>
          <HStack spacing={4} align="flex-start" flexWrap="wrap">
            <VStack spacing={2} align="stretch" flex="1">
              <Select
                placeholder="Selecione o cliente"
                value={selectedCustomer}
                onChange={setSelectedCustomer}
                options={[
                  { value: "novo", label: "Cliente Instantâneo" },
                  ...clientOptions,
                ]}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: "white",
                  }),
                  option: (styles, { isSelected }) => ({
                    ...styles,
                    color: "black",
                    backgroundColor: isSelected ? "#ddd" : "white",
                  }),
                }}
              />

              <Select
                options={paymentOptions}
                value={selectedPayment}
                onChange={setSelectedPayment}
                placeholder="Escolha o método de pagamento"
              />
              <Input
                placeholder="Desconto (%)"
                type="number"
                bg="white"
                borderRadius="md"
                boxShadow="sm"
                value={discount}
                disabled={cart.length === 0}
                onChange={handleDiscountChange}
              />
            </VStack>

            <VStack align="end" spacing={1} flex="1">
              <Text
                fontSize="2xl"
                fontWeight="bold"
                mb={4}
                color="teal.600"
                textAlign="right"
              >
                Resumo
              </Text>
              <Text fontSize="lg" color="gray.700" textAlign="right">
                Subtotal: {formatCurrency(getTotal())}
              </Text>
              <Text fontSize="lg" color="gray.700" textAlign="right">
                Imposto (16%): {formatCurrency(getTax())}
              </Text>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="teal.700"
                textAlign="right"
              >
                Total: {formatCurrency(getTotalWithTax())}
              </Text>
            </VStack>
          </HStack>

          <Divider my={4} borderColor="gray.300" />

          <HStack spacing={4}>
            <Input
              placeholder="Digite o valor pago"
              isDisabled={selectedPayment?.value !== "CASH"}
              value={payment}
              onChange={handlePaymentChange}
              type="number"
              bg="white"
              borderRadius="md"
              boxShadow="sm"
              _hover={{ bg: "gray.200" }}
              _focus={{
                borderColor: "teal.500",
                boxShadow: "0 0 0 1px teal.500",
              }}
            />
            <Button
              colorScheme="teal"
              width="50%"
              onClick={handleFinishSale}
              disabled={isSubmitting}
              isLoading={isSubmitting}
              _hover={{ bg: "teal.600" }}
              _active={{ bg: "teal.700" }}
            >
              {isSale ? "Finalizar Venda" : "Processar Pagamento"}
            </Button>
          </HStack>

          <Text
            mt={2}
            fontSize="lg"
            fontWeight="bold"
            color={change < 0 ? "red.500" : "green.500"}
            textAlign="right"
          >
            Troco: {formatCurrency(change)}
          </Text>
        </Box>
      </Flex>
    </Box>
  );
};

export default ShoppingCart;
