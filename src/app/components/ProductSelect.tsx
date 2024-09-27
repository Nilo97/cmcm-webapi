import React, { useState } from "react";
import {
  Box,
  Input,
  List,
  ListItem,
  Flex,
  Text,
  Image,
  Spinner,
  useDisclosure,
  Icon,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { ProductOption } from "../actions/types";

type ProductSelectProps = {
  products: ProductOption[];
  onSearch: (text: string) => void;
  onSelect: (product: any) => void;
  isLoading: boolean;
  selectedProduct?: any;
};

const ProductSelect: React.FC<ProductSelectProps> = ({
  products,
  onSearch,
  onSelect,
  isLoading,
  selectedProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [showList, setShowList] = useState<boolean>(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    setShowList(true);
    onSearch(value);
  };

  const handleProductSelect = (product: any) => {
    setSearchTerm(product.name);
    setShowList(false);
    onSelect(product);
  };

  const shouldShowList =
    showList && searchTerm && products.length > 0 && !selectedProduct;

  return (
    <Box position="relative">
      <InputGroup size="sm">
        <Input
          placeholder="Digite o nome ou código do produto"
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowList(true)}
          onBlur={() => setTimeout(() => setShowList(false), 200)}
        />
        <InputRightElement pointerEvents="none">
          <Icon as={SearchIcon} />
        </InputRightElement>
      </InputGroup>

      {isLoading && (
        <Flex justify="center" align="center" mt={4}>
          <Spinner />
        </Flex>
      )}
      {shouldShowList && (
        <List
          mt={4}
          spacing={2}
          border="1px"
          borderColor="gray.200"
          borderRadius="md"
          bg="white"
          boxShadow="md"
          position="absolute"
          width="100%"
          zIndex={1}
        >
          {products.length === 0 ? (
            <ListItem p={2} textAlign="center">
              <Text>Nenhum produto encontrado.</Text>
            </ListItem>
          ) : (
            products.map((option) => (
              <ListItem
                key={option.value}
                p={2}
                borderRadius="md"
                _hover={{ bg: "gray.100", cursor: "pointer" }}
                onClick={() => handleProductSelect(option.product)}
              >
                <Flex alignItems="center">
                  <Image
                    boxSize="30px"
                    src={option.product.image}
                    alt={option.product.name}
                    mr={2}
                  />
                  <Box>
                    <Text fontWeight="bold">{option.product.name}</Text>
                    <Text>Preço: {option.product.price}</Text>
                  </Box>
                </Flex>
              </ListItem>
            ))
          )}
        </List>
      )}
    </Box>
  );
};

export default ProductSelect;
