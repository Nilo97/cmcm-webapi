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
} from "@chakra-ui/react";
import { fetchProductSale } from "../actions/product";
import { SearchIcon } from "@chakra-ui/icons";
import { createSale } from "../actions/sale";
import { useRouter } from "next/navigation";

const SalesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [discount, setDiscount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const toast = useToast();

  useEffect(() => {
    if (cart.length === 0) {
      setDiscount(0);
    }
  }, [cart]);

  const handleAddToCart = () => {
    console.log(selectedProduct)
    if (!selectedProduct || !selectedProduct.productId) {
      toast({
        title: "Produto inválido.",
        description: "O produto não possui um ID válido.",
        status: "warning",
        duration: 5000,
        isClosable: true,
      });
      return;
    }
  
    const productInCart = cart.find((item) => item.id === selectedProduct.productId);
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
      console.log(result.data)
    } else {
      toast({
        title: "Produto não encontrado.",
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
      toast({
        title: "Venda concluída!",
        description: "Os produtos foram vendidos com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      setCart([]);
      setDiscount(0);
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
                      onChange={(e) => {
                          setSearchTerm(e.target.value);
                        }}
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
                      </InputRigh<InputGroup size={{ base: "sm", md: "md" }}>
                      <InputLeftElement pointerEvents="none">
                        <SearchIcon color="gray.300" />
                      </InputLeftElement>
                      <Input
                        placeholder="Digite o código do produto"
                      tAddon>
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
                    Preço: {selectedProduct.price.toFixed(2)} MT
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
            >
              <FormControl flex="1" maxW="250px">
                <FormLabel>Desconto</FormLabel>
                <Input
                  type="number"
                  min="0"
                  value={discount}
                  disabled={cart.length === 0}
                  onChange={handleDiscountChange}
                  placeholder="Digite o valor do desconto"
                  size="sm"
                />
              </FormControl>
              <Flex flex="1" justify="center"></Flex>
              <Text
                fontSize="2xl"
                fontWeight="bold"
                color="red.400"
                flex="1"
                textAlign="right"
              >
                Total : {discountedTotal.toFixed(2)} MT
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
                      <Th>Produto</Th>
                      <Th>Preço</Th>
                      <Th>Quantidade</Th>
                      <Th>Remover</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {cart.map((item) => (
                      <Tr key={item.productId}>
                        <Td>{item.name}</Td>
                        <Td>{item.price.toFixed(2)} MT</Td>
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
            Cancelar
          </Button>
        </HStack>
      </Box>
    </>
  );
};

export default SalesPage;
