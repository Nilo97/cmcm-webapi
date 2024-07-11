"use client";

import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Stack,
  TableContainer,
  TableCaption,
  Flex,
  InputGroup,
  InputLeftElement,
} from "@chakra-ui/react";
import { EditIcon, DeleteIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { useState } from "react";
import ProductDetailsModal from "./ProductDetails";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  qtd: number;
}

interface ProductTableProps {
  products: Product[];
  onDelete: (productId: number) => void;
  onEdit: (product: Product) => void;
  onSearch: (value: string) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onDelete,
  onEdit,
  onSearch,
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  return (
    <Stack spacing="4">
      <Flex align="center" justify="center">
        <InputGroup size={{ base: "sm", md: "md" }} maxW="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar produto..."
            onChange={(e) => onSearch(e.target.value)}
            onKeyDown={(e: any) => {
              e.key === "Enter" ? onSearch(e.target.value) : null;
            }}
            variant="filled"
          />
        </InputGroup>
      </Flex>
      <TableContainer>
        <Table variant="simple" fontSize={{ base: "xs", md: "sm" }} size="sm">
          <TableCaption>Provided by Job Savana</TableCaption>
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>Descrição</Th>
              <Th>Preço</Th>
              <Th>Quantidade</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {products.map((product) => (
              <Tr key={product.id}>
                <Td>{product.name}</Td>
                <Td>{product.description}</Td>
                <Td>{product.price}</Td>
                <Td>{product.qtd}</Td>
                <Td>
                  <Button
                    size="sm"
                    leftIcon={<ViewIcon />}
                    onClick={() => handleViewDetails(product)}
                  >
                    Ver
                  </Button>
                  <Button
                    ml="2"
                    size="sm"
                    leftIcon={<EditIcon />}
                    onClick={() => onEdit(product)}
                  >
                    Editar
                  </Button>
                  <Button
                    size="sm"
                    colorScheme="red"
                    leftIcon={<DeleteIcon />}
                    ml="2"
                    onClick={() => onDelete(product.id)}
                  >
                    Excluir
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
      <ProductDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </Stack>
  );
};

export default ProductTable;
