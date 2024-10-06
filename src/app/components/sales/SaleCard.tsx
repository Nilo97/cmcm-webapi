import React, { useState } from "react";
import {
  Button,
  Stack,
  Flex,
  Spinner,
  useDisclosure,
  Box,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tooltip,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { InvoiceResponse, Product } from "@/app/actions/types";
import { formatCurrency, truncateText } from "@/app/actions/util";
import Image from "next/image";
import generic from "../../../../public/gnereic2.png";

interface SaleCardProps {
  products: Product[];
  searchTerm: string;
  totalPages?: number;
  loading: boolean;
  currentPage: number;
  onPageChange?: (page: number) => void;
  addToCart: (item: any) => void;
  setCurrentPage: (page: any) => void;
}

const SaleCard: React.FC<SaleCardProps> = ({
  products,
  searchTerm,
  loading,
  totalPages = 0,
  currentPage = 0,
  onPageChange,
  addToCart,
  setCurrentPage,
}) => {
  const [activeCategory, setActiveCategory] = useState("Todos");

  const categories = [
    "Todos",
    ...new Set(products.map((product) => product.categoryName)),
  ];

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const imageHeight = useBreakpointValue({
    base: 50,
    sm: 50,
    md: 100,
    lg: 150,
    xl: 200,
  });

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pagesToShow = 3;
    const startPage = Math.max(0, currentPage - Math.floor(pagesToShow / 2));
    const endPage = Math.min(totalPages - 1, startPage + pagesToShow - 1);

    const pages = [...Array(endPage - startPage + 1).keys()].map(
      (index) => startPage + index
    );

    return (
      <Flex justify="center">
        <Stack
          direction={{ base: "column", md: "row" }}
          spacing="2"
          maxW="600px"
        >
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentPage(0)}
              colorScheme="teal"
              size="sm"
            >
              Primeira
            </Button>
          )}
          {currentPage > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              colorScheme="teal"
              size="sm"
              ml={{ base: 0, md: 2 }}
              mt={{ base: 2, md: 0 }}
            >
              Anterior
            </Button>
          )}
          {pages.map((page) => (
            <Button
              key={page}
              size="sm"
              variant={currentPage === page ? "solid" : "outline"}
              onClick={() => setCurrentPage(page)}
              colorScheme={currentPage === page ? "teal" : undefined}
              mt={{ base: 2, md: 0 }}
              mx={{ base: 1, md: 2 }}
            >
              {page + 1}
            </Button>
          ))}
          {currentPage < totalPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              colorScheme="teal"
              mt={{ base: 2, md: 0 }}
              mr={{ base: 0, md: 2 }}
            >
              Próxima
            </Button>
          )}
          {currentPage !== totalPages && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCurrentPage(totalPages)}
              colorScheme="teal"
              mt={{ base: 2, md: 0 }}
            >
              Última
            </Button>
          )}
        </Stack>
      </Flex>
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "Todos" || product.categoryName === activeCategory;
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const gridTemplateColumns = useBreakpointValue({
    base: "1fr",
    sm: "repeat(2, 1fr)",
    md: "repeat(3, 1fr)",
    lg: "repeat(4, 1fr)",
    xl: "repeat(5, 1fr)",
  });

  return (
    <Stack spacing="4">
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <>
          <Tabs
            variant="soft-rounded"
            colorScheme="teal"
            onChange={(index) => setActiveCategory(categories[index])}
          >
            <TabList
              overflowX="auto"
              whiteSpace="nowrap"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {categories.map((category, index) => (
                <Tab key={index} flexShrink={0}>
                  {category}
                </Tab>
              ))}
            </TabList>

            <TabPanels>
              {categories.map((category, index) => (
                <TabPanel key={index}>
                  <Flex
                    wrap="wrap"
                    gap={4}
                    justify="center"
                    gridTemplateColumns={gridTemplateColumns}
                  >
                    {filteredProducts.map(
                      (product) =>
                        (activeCategory === "Todos" ||
                          product.categoryName === activeCategory) && (
                          <Box
                            key={product.productId}
                            p={4}
                            bg="white"
                            borderRadius="md"
                            boxShadow="md"
                            _hover={{
                              bg: "gray.50",
                              boxShadow: "lg",
                              transform: "scale(1.05)",
                            }}
                            cursor="pointer"
                            onClick={() => addToCart(product)}
                            width={{
                              base: "100%",
                              sm: "48%",
                              md: "30%",
                              lg: "22%",
                            }}
                            transition="transform 0.3s ease, box-shadow 0.3s ease"
                          >
                            <Box
                              position="relative"
                              mb={4}
                              borderRadius="md"
                              overflow="hidden"
                              display="flex"
                              justifyContent="center"
                              alignItems="center"
                              _hover={{ transform: "scale(1.05)" }}
                              transition="transform 0.3s ease"
                            >
                              <Image
                                src={product.image || generic}
                                alt={product.name}
                                objectFit="cover"
                                width="100"
                                height={imageHeight}
                              />
                            </Box>

                            <Box textAlign="center">
                              <Tooltip label={product.name} fontSize="md">
                                <Text
                                  fontSize="sm"
                                  fontWeight="bold"
                                  color="gray.800"
                                  isTruncated
                                  noOfLines={1}
                                >
                                  {truncateText(product.name, 12)}
                                </Text>
                              </Tooltip>

                              <Text
                                fontSize="sm"
                                color="gray.600"
                                fontWeight="semibold"
                                mt={2}
                                isTruncated
                              >
                                {formatCurrency(product.price)}
                              </Text>
                            </Box>
                          </Box>
                        )
                    )}
                  </Flex>
                </TabPanel>
              ))}
            </TabPanels>
          </Tabs>
          {renderPagination()}
        </>
      )}
    </Stack>
  );
};

export default SaleCard;
