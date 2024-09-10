"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
  VStack,
  HStack,
  Flex,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useBreakpointValue,
  useColorModeValue,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { fetchProductSale } from "../actions/product";
import { SearchIcon } from "@chakra-ui/icons";
import { createSale } from "../actions/sale";
import { useRouter } from "next/navigation";
import { FaMobileAlt, FaMoneyCheckAlt } from "react-icons/fa";
import {
  FaMoneyBillWave,
  FaCreditCard,
  FaMoneyBillTransfer,
  FaRegCreditCard,
} from "react-icons/fa6";
import Select from "react-select";
import { formatCurrency } from "../actions/util";
import Invoice from "../components/Invoice";

const SalesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);

  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const paymentOptions = [
    {
      value: "CASH",
      label: "Dinheiro",
      icon: <FaMoneyBillWave color="green" />,
    },
    { value: "MPESA", label: "M-Pesa", icon: <FaMobileAlt color="red" /> },
    {
      value: "EMOLA",
      label: "eMola",
      icon: <FaMoneyCheckAlt color="orange" />,
    },
    { value: "CARD", label: "Cartão", icon: <FaCreditCard color="purple" /> },
    {
      value: "BANK_TRANSFER",
      label: "Transferência Bancária",
      icon: <FaMoneyBillTransfer color="teal" />,
    },
    {
      value: "MKESH",
      label: "Mkesh",
      icon: <FaRegCreditCard color="yellow" />,
    },
    {
      value: "CHEQUE",
      label: "Cheque",
      icon: <FaRegCreditCard color="gray" />,
    },
  ];

  const toast = useToast();

  const customStyles = {
    control: (base: any) => ({
      ...base,
      padding: "2px 6px",
      borderColor: useColorModeValue("gray.50", "gray.50"),
      boxShadow: "none",
      "&:hover": { borderColor: useColorModeValue("gray.50", "gray.50") },
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
  useEffect(() => {
    if (cart.length === 0) {
      setDiscount(0);
    }
  }, [cart]);

  const handleAddToCart = () => {
    console.log(selectedProduct);
    if (!selectedProduct || !selectedProduct.productId) {
      toast({
        title: "Artigo inválido.",
        description: "O Artigo não possui um ID válido.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const productInCart = cart.find(
      (item) => item.id === selectedProduct.productId
    );
    if (productInCart) {
      setCart(
        cart.map((item) =>
          item.id === selectedProduct.productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...selectedProduct, quantity }]);
    }

    setQuantity(1);
    setSelectedProduct(null);
  };

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

  const handleSearch = async () => {
    const result = await fetchProductSale(searchTerm);
    if ("data" in result) {
      setSelectedProduct(result.data);
      console.log(result.data);
    } else {
      toast({
        title: "Artigo não encontrado.",
        description: result.error || "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setSelectedProduct(null);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discountedTotal = total - discount;

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = Number(e.target.value);

    if (newDiscount < 0) {
      setDiscount(0);
    } else if (newDiscount > total) {
      setDiscount(total);
    } else {
      setDiscount(newDiscount);
    }
  };

  const handleFinishSale = async () => {
    if (cart.length === 0) {
      toast({
        title: "Carrinho vazio.",
        description: "Adicione itens ao carrinho antes de finalizar a venda.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
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
    setIsLoading(true);

    const saleItems = cart.map((item) => ({
      productId: item.productId,
      batchId: item?.batchId,
      quantity: item.quantity,
    }));

    let data = {
      discount: discount,
      saleItems: saleItems,
      totalAmount: discountedTotal,
      paymentMethod: selectedPayment?.value,
    };

    const result = await createSale(data);
    setIsLoading(false);

    if ("error" in result) {
      toast({
        title: "Erro ao finalizar venda.",
        description: result.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      if (result.data) {
        setPdfBlob(result.data);
      }

      toast({
        title: "Venda concluída!",
        description: "Os Artigos foram vendidos com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      setCart([]);
      setDiscount(0);
      setSelectedPayment(null);
      onOpen();
    }
  };

  return (
    <>
      <Box
        h="90vh"
        w="100vw"
        bg="gray.100"
        overflow="hidden"
        position="relative"
      >
        <Center h="full">
          <VStack
            spacing={4}
            w="full"
            maxW="1200px"
            bg="white"
            p={4}
            rounded="md"
            shadow="md"
            h="full"
            overflow="hidden"
          >
            <HStack spacing={2} w="full">
              <FormControl flex="1">
                <Box flex="2" m={{ base: "1rem 0", md: "0 10rem" }}>
                  <Flex align="center">
                    <InputGroup
                      size={useBreakpointValue({ base: "sm", md: "md" })}
                    >
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Digite o código do Artigo"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSearch();
                          }
                        }}
                        variant="filled"
                      />
                      <InputRightAddon width="6rem" bg="black">
                        <Button
                          size="md"
                          w="100%"
                          colorScheme="black"
                          onClick={() => handleSearch()}
                        >
                          Pesquisar
                        </Button>
                      </InputRightAddon>
                    </InputGroup>
                  </Flex>
                </Box>
              </FormControl>
            </HStack>

            {selectedProduct && (
              <Box w="full" p={3} bg="gray.50" rounded="md" shadow="sm">
                <HStack spacing={4}>
                  <Text fontSize="lg" fontWeight="bold" flex="1">
                    {selectedProduct.name}
                  </Text>
                  <Text flex="1">
                    Preço: {formatCurrency(selectedProduct.price)}
                  </Text>
                  <FormControl flex="1">
                    <FormLabel>Quantidade</FormLabel>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    />
                  </FormControl>
                </HStack>
                <Button
                  colorScheme="teal"
                  mt={3}
                  onClick={handleAddToCart}
                  size="sm"
                >
                  Adicionar ao Carrinho
                </Button>
              </Box>
            )}

            <Flex
              w="full"
              p={4}
              bg="gray.50"
              rounded="md"
              shadow="sm"
              mt={4}
              borderTop="2px"
              borderColor="teal.500"
              align="center"
              justify="space-between" // Distribui os itens ao longo do eixo principal
            >
              <FormControl maxW="250px">
                <FormLabel>Desconto</FormLabel>
                <Input
                  type="number"
                  min="0"
                  value={discount}
                  disabled={cart.length === 0}
                  onChange={handleDiscountChange}
                  placeholder="Digite o valor do desconto"
                />
              </FormControl>

              <Box width="40%" mt="6">
                <Select
                  options={paymentOptions}
                  formatOptionLabel={formatOptionLabel}
                  value={selectedPayment}
                  onChange={setSelectedPayment}
                  styles={customStyles}
                  placeholder="Escolha o método de pagamento"
                />
              </Box>

              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="red.400"
                textAlign="right"
                mt="3"
              >
                Total: {formatCurrency(discountedTotal)}
              </Text>
            </Flex>

            <Box
              w="full"
              p={3}
              bg="gray.50"
              rounded="md"
              shadow="sm"
              overflowY="auto"
              borderTop="1px"
              borderColor="gray.200"
            >
              <Text fontSize="lg" fontWeight="bold">
                Carrinho
              </Text>
              {cart.length === 0 ? (
                <Text>Seu carrinho está vazio.</Text>
              ) : (
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Artigo</Th>
                      <Th>Preço</Th>
                      <Th>Quantidade</Th>
                      <Th>Remover</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cart.map((item) => (
                      <Tr key={item.productId}>
                        <Td>{item.name}</Td>
                        <Td>{formatCurrency(item.price)}</Td>
                        <Td>
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) =>
                              handleQuantityChange(
                                item.productId,
                                Number(e.target.value)
                              )
                            }
                          />
                        </Td>
                        <Td>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => handleRemoveFromCart(item.productId)}
                          >
                            Remover
                          </Button>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Box>
          </VStack>
        </Center>
      </Box>

      <Box
        position="fixed"
        bottom="0"
        w="full"
        p={4}
        borderTop="1px"
        borderColor="gray.200"
        bg="white"
        shadow="md"
      >
        <HStack spacing={4} w="full" maxW="1100px" mx="auto">
          <Button
            colorScheme="blue"
            w="full"
            size="lg"
            onClick={handleFinishSale}
            disabled={isLoading}
            isLoading={isLoading}
          >
            Finalizar Venda
          </Button>
          <Button
            colorScheme="red"
            w="full"
            size="lg"
            disabled={isLoading}
            onClick={() => router.push(`/options`)}
          >
            Sair
          </Button>
        </HStack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Recibo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {pdfBlob ? <Invoice pdfBlob={pdfBlob} /> : <p>Carregando...</p>}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SalesPage;
