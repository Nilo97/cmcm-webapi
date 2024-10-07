"use client";

import React, { useState, useEffect } from "react";
import {
  ChakraProvider,
  Box,
  Flex,
  Text,
  HStack,
  Button,
  Input,
  Divider,
  VStack,
  Icon,
  InputGroup,
  InputRightElement,
  useColorModeValue,
  useToast,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { DeleteIcon, SearchIcon } from "@chakra-ui/icons";
import { fetchProducts } from "../actions/product";
import { CartItem, Product } from "../actions/types";
import { formatCurrency, truncateText } from "../actions/util";
import Select, { SingleValue } from "react-select";
import { fetchPaginatedCustomers } from "../actions/customer";
import {
  FaMoneyBillWave,
  FaMobileAlt,
  FaMoneyCheckAlt,
  FaCreditCard,
  FaRegCreditCard,
} from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";
import SaleCard from "../components/sales/SaleCard";
import CartTable from "../components/CartTable";
import { createSale } from "../actions/sale";
import Invoice from "../components/Invoice";
import { useRouter } from "next/navigation";
import ShoppingCart from "../components/ShoppingCartProps";

const TAX_RATE = 0.16;
const PAGE_SIZE = 8;

interface Client {
  id: string;
  name: string;
}

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

const POS: React.FC = () => {
  const router = useRouter();

  const [cart, setCart] = useState<CartItem[]>([]);

  const [products, setProducts] = useState<Product[]>([]);

  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [payment, setPayment] = useState<number | "">("");
  const [change, setChange] = useState<number>(0);
  const [dateTime, setDateTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const bgActive = useColorModeValue("teal.500", "teal.300");
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [discount, setDiscount] = useState<number>(0);
  const [isSumitting, setIsSumitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchClients = async () => {
      const response = await fetchPaginatedCustomers(10, 0);
      if ("error" in response) {
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

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDiscount = Number(e.target.value);

    if (newDiscount < 0) {
      setDiscount(0);
    } else if (newDiscount > getTotalWithTax()) {
      setDiscount(getTotalWithTax());
    } else {
      setDiscount(newDiscount);
    }
  };

  const formattedDate = dateTime.toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const formattedTime = dateTime.toLocaleTimeString("pt-PT", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const addToCart = (product: any) => {
    const existingProductIndex = cart.findIndex(
      (item) => item.productId === product.productId
    );
    if (existingProductIndex !== -1) {
      const newCart = [...cart];
      newCart[existingProductIndex].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
    setQuantity(1);
  };

  const handleQuantityChange = (id: string, newQuantity: number) => {
    console.log(id);
    setCart(
      cart.map((item) =>
        item.productId === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setPayment(value);
    calculateChange(value);
  };

  const calculateChange = (amountPaid: number) => {
    const total = getTotalWithTax();
    if (amountPaid >= total) {
      setChange(amountPaid - total);
    } else {
      setChange(0);
    }
  };

  const getTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  const getTax = () => {
    return getTotal() * TAX_RATE;
  };

  const getTotalWithTax = () => {
    const total = getTotal() + getTax();
    return total - discount;
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.productId !== id));
  };

  useEffect(() => {
    fetchAllProducts(currentPage);
  }, [currentPage, searchQuery]);

  const fetchAllProducts = async (page: number) => {
    try {
      const data = await fetchProducts(PAGE_SIZE, page, searchQuery);

      if ("error" in data) {
        throw new Error(data.error);
      }
      setProducts(data.products);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
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
    setIsSumitting(true);

    const saleItems = cart.map((item) => ({
      productId: item.productId,
      batchId: item?.batchId,
      quantity: item.quantity,
    }));

    let data = {
      discount: discount,
      saleItems: saleItems,
      totalAmount: getTotalWithTax() - discount,
      paymentMethod: selectedPayment?.value,
      customer: selectedCustomer?.value,
    };

    const result = await createSale(data);
    setIsSumitting(false);

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
        description: "Os Produtos foram vendidos com sucesso.",
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
    <ChakraProvider>
      <Flex height="100vh" direction="column" p={2} bg="gray.50">
        <Box
          bg={bgActive}
          p={4}
          color="white"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          maxW="full"
          width="100%"
          position="fixed"
          top={0}
          left={0}
          zIndex={1000}
        >
          <Text
            fontSize={{ base: "xl", sm: "2xl" }}
            fontWeight="bold"
            color="white"
            letterSpacing="0.5px"
          >
            Terminal de Vendas (POS)
          </Text>
          <HStack spacing={{ base: 2, md: 6 }} align="center">
            <Text fontSize="sm" color="whiteAlpha.800" fontWeight="bold">
              {formattedDate} {formattedTime}
            </Text>
            <Text fontSize="sm" color="whiteAlpha.900">
              Usuário: Caixa 1
            </Text>
            <Button
              colorScheme="red"
              variant="solid"
              _hover={{ bg: "red.600", transform: "scale(1.05)" }}
              _active={{ bg: "red.700", transform: "scale(1)" }}
              onClick={() => router.push("/options")}
              size="sm"
              px={4}
            >
              Sair
            </Button>
          </HStack>
        </Box>

        <Flex
          mt="70px"
          height="100%"
          flex="1"
          direction={{ base: "column", md: "row" }}
        >
          <Box
            width={{ base: "100%", md: "40%" }}
            bg="white"
            p={4}
            borderRadius="md"
            boxShadow="lg"
            height="100%"
            overflow="hidden"
          >
            <Text fontSize="lg" fontWeight="bold" mb={4}>
              Produtos Disponíveis
            </Text>

            <InputGroup
              size="lg"
              mb={6}
              borderRadius="full"
              boxShadow="md"
              bg="gray.50"
              maxW="600px"
              mx="auto"
            >
              <Input
                placeholder="Pesquisar produtos..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                borderRadius="full"
                border="none"
                boxShadow="none"
                _focus={{
                  border: "none",
                  boxShadow: "0 0 0 3px rgba(20, 184, 166, 0.6)",
                }}
                _hover={{
                  bg: "gray.100",
                }}
                pl={6}
                pr="4rem"
                height="48px"
                bg="white"
              />
              <InputRightElement width="4rem">
                <Icon as={SearchIcon} />
              </InputRightElement>
            </InputGroup>

            <Box overflowY="auto" maxHeight="700px">
              <SaleCard
                products={products}
                searchTerm={searchTerm}
                currentPage={currentPage}
                addToCart={addToCart}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
                loading={isLoading}
              />
            </Box>
          </Box>
          <ShoppingCart
            cart={cart}
            removeFromCart={removeFromCart}
            handleQuantityChange={handleQuantityChange}
            handleDiscountChange={handleDiscountChange}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            paymentOptions={paymentOptions}
            clientOptions={clientOptions}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
            payment={payment}
            handlePaymentChange={handlePaymentChange}
            handleFinishSale={handleFinishSale}
            discount={discount}
            getTotal={getTotal}
            getTax={getTax}
            getTotalWithTax={getTotalWithTax}
            isSubmitting={isSumitting}
            change={change}
            formatCurrency={formatCurrency}
            isSale={true}
          />
        </Flex>

        <Modal isOpen={isOpen} onClose={onClose} size="lg">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Talão</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {pdfBlob ? <Invoice pdfBlob={pdfBlob} /> : <p>Carregando...</p>}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Flex>
    </ChakraProvider>
  );
};

export default POS;
