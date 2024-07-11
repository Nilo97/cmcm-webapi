"use client";
import { useState } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Flex,
  FormLabel,
  Input as ChakraInput,
  Text,
  Box,
} from "@chakra-ui/react";
import ProductTable from "../components/ProductTable";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from 'next/navigation'

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  qtd: number;
}

const produtos: Product[] = [
  {
    id: 1,
    name: "Produto 1",
    description: "Descrição do Produto 1",
    price: 50.0,
    qtd: 5,
  },
  {
    id: 2,
    name: "Produto 2",
    description: "Descrição do Produto 2",
    price: 75.0,
    qtd: 150,
  },
  {
    id: 3,
    name: "Produto 3",
    description: "Descrição do Produto 3",
    price: 100.0,
    qtd: 50,
  },
];

const ProdutosPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(produtos);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter()

  const handleSearch = (value: string) => {
    // Implementar lógica de pesquisa aqui
    console.log("Pesquisando por:", value);
  };

  const handleDelete = (productId: number) => {
    // Implementar lógica de exclusão aqui
    console.log("Excluir produto com ID:", productId);
  };

  const handleEdit = (product: Product) => {
    setSelectedProduct(product);
    onOpen();
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    onClose();
  };

  return (
    <Container maxW="container.xl" mt="1" p={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb="4"
      >
        <Heading as="h1" size="lg" mb={{ base: 4, md: 0 }}>
          Lista de Produtos
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/product/register")}
          >
            Novo Produto
          </Button>
          <Button
            size="sm"
            colorScheme="pink"
            leftIcon={<DownloadIcon />}
            onClick={() => console.log("Exportar clicado")}
          >
            Exportar
          </Button>
        </Flex>
      </Flex>
      <ProductTable
        products={products}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearch}
      />

      <Modal isOpen={isOpen} onClose={handleCloseModal}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Editar Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Nome do Produto</FormLabel>
              <ChakraInput type="text" />
            </FormControl>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ProdutosPage;
