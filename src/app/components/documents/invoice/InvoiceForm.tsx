import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Button,
  Text,
  Box,
  Heading,
  Flex,
  useToast,
  Textarea,
  FormErrorMessage,
  Grid,
  NumberInput,
  NumberInputField,
  InputRightElement,
  InputGroup,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { formatCurrency } from "@/app/actions/util";
import Select, { SingleValue } from "react-select";
import { createInvoice } from "@/app/actions/invoice";
import { fetchPaginatedCustomers } from "@/app/actions/customer";
import { CartItem, ProductOption } from "@/app/actions/types";
import CartTable from "../../CartTable";
import ProductSelect from "../../ProductSelect";

type InvoiceFormProps = {
  handleSearch: (searchTerm: string) => Promise<{ data?: any; error?: string }>;
  selectedProduct: any;
  setSelectedProduct: (value: any) => void;
};

interface InvoiceFormInputs {
  selectedClient: string;
  newClient: string;
  invoiceDate: string;
  dueDate: string;
  paymentTerms: string;
  discount?: number;
  observations?: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

interface Client {
  id: string;
  name: string;
}

type PaymentOption = { value: string; label: string };

export const InvoiceForm: React.FC<InvoiceFormProps> = ({
  handleSearch,
  selectedProduct,
  setSelectedProduct,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const [cart, setCart] = useState<CartItem[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [products, setProducts] = useState<ProductOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();
  const [clients, setClients] = useState<Client[]>([]);

  const paymentOptions: PaymentOption[] = [
    { value: "now", label: "Imediato" },
    { value: "15", label: "15 Dias" },
    { value: "30", label: "30 Dias" },
    { value: "60", label: "60 Dias" },
  ];

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetchPaginatedCustomers(10, 0);
      if ("error" in response) {
        // toast({
        //   title: "Erro ao carregar quartos.",
        //   description: response.error,
        //   status: "error",
        //   duration: 5000,
        //   isClosable: true,
        // });
      } else {
        setClients(response.customers);
      }
    };

    fetchClients();
  }, []);

  const clientOptions = clients.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  const handleRemoveFromCart = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCart(
      cart.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const onChangeTax = (id: string, newTax: string) => {
    setCart(
      cart.map((item) =>
        item.productId === id ? { ...item, tax: newTax } : item
      )
    );
  };
  const handleAddToCart = (value: any) => {
    if (!value || !value.productId) {
      toast({
        title: "Produto inválido.",
        description: "O Produto não possui um ID válido.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const productInCart = cart.find(
      (item) => item.productId === value.productId
    );
    if (productInCart) {
      setCart(
        cart.map((item) =>
          item.productId === value.productId
            ? { ...item, quantity: quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...value, quantity }]);
    }

    setQuantity(1);
    setSelectedProduct(null);
  };

  const handlePaymentTermsChange = (
    selectedOption: SingleValue<PaymentOption>
  ) => {
    setValue("paymentTerms", selectedOption?.value || "");
    console.log(selectedOption?.value);
  };

  const calculateTax = (item: CartItem) => {
    const taxPercentage = item.tax === "16%" ? 0.16 : 0;
    return item.price * item.quantity * taxPercentage;
  };

  const calculateTotals = (value: number) => {
    const subtotal = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const taxTotal = cart.reduce((acc, item) => acc + calculateTax(item), 0);

    const discount = subtotal * 0.15;
    const total = subtotal + taxTotal - value;

    return { subtotal, discount, total, taxTotal };
  };

  function createInvoiceRequest(formData: any, cart: any[], total: number) {
    const documentLines = cart.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      tax: item.tax || "included",
    }));

    const documentRequest = {
      totalAmount: total,
      observation: formData.observations || "",
      discount: formData.discount || 0,
      documentDate: formData.invoiceDate,
      dueDate: formData.dueDate,
      documentType: "INVOICE",
      documentLines: documentLines,
      customer:
        formData.selectedClient?.value === "novo"
          ? formData.newClient
          : formData.selectedClient?.value,
    };

    return {
      document: documentRequest,
      paymentTerms: formData.paymentTerms.value,
    };
  }
  const onSubmit = async (formData: any) => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio.",
        description: "Adicione itens ao carrinho antes de emitir a factura.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const invoice = createInvoiceRequest(formData, cart, total);
    const result = await createInvoice(invoice);

    if (result.error) {
      toast({
        title: "Erro ao emitir a factura",
        description: result.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else if (result.data) {
      toast({
        title: "Factura criada!",
        description: `Factura criada com sucesso`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      reset({
        selectedClient: "",
        newClient: "",
        invoiceDate: "",
        dueDate: "",
        paymentTerms: "",
        discount: undefined,
        observations: "",
        products: [],
      });

      setCart([]);
    }
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    handleAddToCart(product);
  };

  const handleSearchProduct = async (text: string) => {
    if (!text) return;

    setIsLoading(true);
    const result = await handleSearch(text);
    setIsLoading(false);

    if (result.data) {
      const productOptions = formatProductOptions(result.data.content);
      setProducts(productOptions);
      setSelectedProduct(productOptions[0]?.product || null);
    } else {
      setProducts([]);
      setSelectedProduct(null);
    }
  };

  const formatProductOptions = (products: any[]): ProductOption[] =>
    products.map((product) => ({
      value: product.productId,
      label: (
        <Flex alignItems="center">
          <Box>
            <Text fontWeight="bold">{product.name}</Text>
            <Text>Preço: {formatCurrency(product.price)}</Text>
          </Box>
        </Flex>
      ),
      product,
    }));

  const { subtotal, discount, total, taxTotal } = calculateTotals(
    Number(watch("discount") || 0)
  );

  return (
    <Box p={{ base: 4, md: 6 }}>
      <Heading
        as="h2"
        fontSize={{ base: "lg", md: "xl" }}
        mb={4}
        textAlign="center"
        color="teal.500"
      >
        Emissão de Fatura
      </Heading>

      <VStack spacing={6} align="stretch">
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <VStack spacing={4} align="stretch">
            <FormControl
              mr={2}
              isInvalid={!!errors.selectedClient}
              id="selectedClient"
            >
              <FormLabel> Cliente:</FormLabel>
              <Controller
                name="selectedClient"
                control={control}
                defaultValue={null}
                rules={{ required: "Cliente é obrigatório." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Selecione o cliente"
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
                )}
              />

              {errors.selectedClient && (
                <FormErrorMessage>
                  {typeof errors.selectedClient === "string"
                    ? errors.selectedClient
                    : "Cliente é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
            {watch("selectedClient")?.value === "novo" && (
              <FormControl mb={4} isInvalid={!!errors.newClient}>
                <FormLabel>Nome do cliente Instantâneo:</FormLabel>
                <Controller
                  name="newClient"
                  control={control}
                  rules={{
                    required: "Nome do cliente instantâneo é obrigatório.",
                  }}
                  render={({ field }) => (
                    <Input
                      size="sm"
                      {...field}
                      placeholder="Digite o nome do cliente instantâneo"
                    />
                  )}
                />
                {errors.newClient && (
                  <FormErrorMessage>
                    {typeof errors.newClient === "string"
                      ? errors.newClient
                      : "Nome do cliente instantâneo é obrigatório."}
                  </FormErrorMessage>
                )}
              </FormControl>
            )}
            <FormControl
              mr={2}
              isInvalid={!!errors.paymentTerms}
              id="paymentTerms"
            >
              <FormLabel> Termos de pagamento:</FormLabel>
              <Controller
                name="paymentTerms"
                control={control}
                defaultValue={null}
                rules={{ required: "termos de pagamento é obrigatório." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Selecione o cliente"
                    options={paymentOptions}
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
                )}
              />

              {errors.paymentTerms && (
                <FormErrorMessage>
                  {typeof errors.paymentTerms === "string"
                    ? errors.paymentTerms
                    : "termos de pagamento é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>

          <VStack spacing={4} align="stretch">
            <FormControl id="invoiceDate" isInvalid={!!errors.invoiceDate}>
              <FormLabel>Data de Emissão</FormLabel>
              <Input
                size="sm"
                type="date"
                {...register("invoiceDate", {
                  required: "Data de emissão é obrigatória.",
                })}
              />
              <FormErrorMessage>
                {typeof errors.invoiceDate === "string"
                  ? errors.invoiceDate
                  : "Data de emissão é obrigatório."}
              </FormErrorMessage>
            </FormControl>

            <FormControl id="dueDate" isInvalid={!!errors.dueDate}>
              <FormLabel>Data de Vencimento</FormLabel>
              <Input
                type="date"
                size="sm"
                {...register("dueDate", {
                  required: "Data de vencimento é obrigatória.",
                })}
              />
              <FormErrorMessage>
                {typeof errors.dueDate === "string"
                  ? errors.dueDate
                  : "Data de vencimento é obrigatório."}
              </FormErrorMessage>
            </FormControl>
          </VStack>
        </Grid>

        <Heading as="h3" fontSize="md" mb={2} color="gray.600">
          Detalhes dos Produtos
        </Heading>

        <ProductSelect
          products={products}
          onSearch={handleSearchProduct}
          onSelect={handleProductSelect}
          isLoading={isLoading}
        />

        <Box
          w="full"
          p={3}
          rounded="md"
          shadow="sm"
          overflowY="auto"
          borderTop="1px"
          borderColor="gray.200"
        >
          {cart.length === 0 ? (
            <Text>Carrinho está vazio.</Text>
          ) : (
            <CartTable
              cartItems={cart}
              onRemoveItem={handleRemoveFromCart}
              onChangeQuantity={handleQuantityChange}
              onChangeTax={onChangeTax}
            />
          )}
        </Box>

        <HStack spacing={6} align="start" wrap="wrap">
          <Box flex="1" minW="300px">
            <FormControl id="observations">
              <FormLabel>Observações</FormLabel>
              <Textarea
                placeholder="Digite suas observações aqui"
                {...register("observations")}
                size="sm"
                w="full"
              />
            </FormControl>
          </Box>

          <Box
            w={{ base: "full", md: "30%" }}
            p={3}
            rounded="md"
            shadow="sm"
            bg="gray.50"
            borderRadius="md"
          >
            <FormControl id="discount" isInvalid={!!errors.discount}>
              <HStack spacing={2} mb="1">
                <FormLabel mb={0} fontWeight="bold">
                  Desconto:
                </FormLabel>
                <InputGroup size="xs" maxW="40%">
                  <NumberInput
                    min={0}
                    value={watch("discount") || 0}
                    onChange={(valueString: any) =>
                      setValue("discount", Number(valueString))
                    }
                    isDisabled={cart.length === 0}
                  >
                    <NumberInputField
                      {...register("discount", {
                        valueAsNumber: true,
                        min: {
                          value: 0,
                          message: "O desconto deve ser um valor positivo.",
                        },
                      })}
                    />
                  </NumberInput>
                  <InputRightElement width="3rem">
                    <Text fontSize="xs">MT</Text>
                  </InputRightElement>
                </InputGroup>
              </HStack>
              <FormErrorMessage>Valor inválido</FormErrorMessage>
            </FormControl>

            <Text mb={2}>
              <span style={{ fontWeight: "bold" }}>Subtotal:</span>{" "}
              {formatCurrency(subtotal)}
            </Text>
            <Text mb={2}>
              <span style={{ fontWeight: "bold" }}>Imposto:</span>{" "}
              {formatCurrency(taxTotal)}
            </Text>
            <Text mb={2}>
              <span style={{ fontWeight: "bold" }}>Desconto:</span>{" "}
              {formatCurrency(Number(watch("discount") || 0))}
            </Text>
            <Text mb={2}>
              <span style={{ fontWeight: "bold" }}>Total:</span>{" "}
              {formatCurrency(total)}
            </Text>
          </Box>
        </HStack>

        <Flex justify="center" align="center" mt={4}>
          <Button
            colorScheme="teal"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Emitindo..."
            onClick={handleSubmit(onSubmit)}
            px={4}
            width={{ base: "100%", md: "50%" }}
            maxWidth="300px"
          >
            Emitir Fatura
          </Button>
        </Flex>
      </VStack>
    </Box>
  );
};

export default InvoiceForm;
