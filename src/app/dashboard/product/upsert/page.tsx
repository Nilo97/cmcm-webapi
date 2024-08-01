"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  Input,
  Textarea,
  Select,
  VStack,
  HStack,
  FormErrorMessage,
  useToast,
  FormLabel,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { fetchCategories } from "@/app/actions/categories";
import {
  getProductById,
  createProduct,
  updateProduct,
} from "@/app/actions/product";
import { useSearchParams } from "next/navigation";
import {
  FaBarcode,
  FaTag,
  FaClipboard,
  FaMoneyBillWave,
  FaListOl,
  FaBoxOpen,
} from "react-icons/fa6";
import { FaCalendarAlt, FaCheckCircle } from "react-icons/fa";

interface Category {
  id: number;
  name: string;
  description: string;
}

interface ProductFormInputs {
  name: string;
  description: string;
  price: number;
  category: string;
  code: string;
  initialQuantity: number;
  expirationDate: string;
  perishable: boolean;
  minimumQuantity: number;
}

const ProductRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<ProductFormInputs>();
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [productId, setProductId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setProductId(id);
      loadProductData(id);
    }
    loadCategories();
  }, [searchParams.get("id")]);

  const loadProductData = async (id: string) => {
    try {
      const data = await getProductById(id);
      if ("error" in data) {
        throw new Error(data.error);
      }
      setValue("name", data.product.name);
      setValue("code", data.product.code);
      setValue("description", data.product.description);
      setValue("price", data.product.price);
      setValue("category", data.product.categoryId);
      setValue("initialQuantity", data.product.initialQuantity);
      setValue("expirationDate", data.product.expirationDate);
      setValue("perishable", data.product.perishable);
      setValue("minimumQuantity", data.product.minimumQuantity);
    } catch (error) {
      console.error("Error loading product:", error);
      toast({
        title: "Erro ao carregar produto",
        description: "Ocorreu um erro ao tentar carregar os dados do produto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      if ("error" in data) {
        throw new Error(data.error);
      }
      setCategories(data);
    } catch (error) {
      console.error("Error loading categories:", error);
      toast({
        title: "Erro ao carregar categorias",
        description: "Ocorreu um erro ao tentar carregar as categorias.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (values: ProductFormInputs) => {
    try {
      const {
        name,
        code,
        description,
        price,
        category,
        initialQuantity,
        expirationDate,
        perishable,
        minimumQuantity,
      } = values;

      const categoryId = category;

      if (productId) {
        const response = await updateProduct(productId, {
          name,
          code,
          description,
          price,
          categoryId,
          initialQuantity,
          minimumQuantity,
          expirationDate,
          perishable,
        });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Produto Atualizado",
          description: "O produto foi atualizado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createProduct({
          name,
          code,
          description,
          price,
          categoryId,
          initialQuantity,
          expirationDate,
          minimumQuantity,
          perishable,
        });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Produto Registrado",
          description: "O produto foi registrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      router.push("/dashboard/product");
    } catch (error) {
      console.error("Error creating/updating product:", error);
      toast({
        title: "Erro ao salvar produto",
        description:
          error instanceof Error ? error.message : "Erro desconhecido",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button mt="1" size="md" onClick={() => router.back()}>
        Voltar
      </Button>

      <Box mt="2" mx={{ base: "auto", md: "20" }} p="2">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="6" align="stretch">
            <HStack spacing="6" justify="space-between" alignItems="flex-start">
              <FormControl isInvalid={!!errors.code} flex="1 0 45%">
                <FormLabel htmlFor="code" display="flex" alignItems="center">
                  <FaBarcode style={{ marginRight: "8px" }} /> Código do Produto
                </FormLabel>
                <Input
                  id="code"
                  size="lg"
                  placeholder="Código do Produto"
                  {...register("code", {
                    required: "Código do Produto é obrigatório",
                  })}
                />
                <FormErrorMessage>
                  {errors.code && errors.code.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.name} flex="1 0 45%">
                <FormLabel htmlFor="name" display="flex" alignItems="center">
                  <FaTag style={{ marginRight: "8px" }} /> Nome do Produto
                </FormLabel>
                <Input
                  id="name"
                  size="lg"
                  placeholder="Nome do Produto"
                  {...register("name", {
                    required: "Nome do Produto é obrigatório",
                  })}
                />
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel
                htmlFor="description"
                display="flex"
                alignItems="center"
              >
                <FaClipboard style={{ marginRight: "8px" }} /> Descrição
              </FormLabel>
              <Textarea
                id="description"
                size="lg"
                placeholder="Descrição do Produto"
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <HStack spacing="6" justify="space-between" alignItems="flex-start">
              <FormControl isInvalid={!!errors.price} flex="1 0 45%">
                <FormLabel htmlFor="price" display="flex" alignItems="center">
                  <FaMoneyBillWave style={{ marginRight: "8px" }} /> Preço
                </FormLabel>
                <Input
                  variant="outline"
                  id="price"
                  size="lg"
                  type="number"
                  step="0.01"
                  placeholder="Preço"
                  {...register("price", {
                    required: "Preço é obrigatório",
                    min: {
                      value: 0,
                      message: "O preço deve ser maior ou igual a 0",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.price && errors.price.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.category} flex="1 0 45%">
                <FormLabel
                  htmlFor="category"
                  display="flex"
                  alignItems="center"
                >
                  <FaListOl style={{ marginRight: "8px" }} /> Categoria
                </FormLabel>
                <Select
                  variant="outline"
                  id="category"
                  size="lg"
                  placeholder="Selecione a Categoria"
                  {...register("category", {
                    required: "Categoria é obrigatória",
                  })}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id.toString()}>
                      {category.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.category && errors.category.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing="6" justify="space-between" alignItems="flex-start">
              <FormControl isInvalid={!!errors.initialQuantity} flex="1 0 45%">
                <FormLabel
                  htmlFor="initialQuantity"
                  display="flex"
                  alignItems="center"
                >
                  <FaBoxOpen style={{ marginRight: "8px" }} /> Quantidade
                  Inicial
                </FormLabel>
                <Input
                  variant="outline"
                  id="initialQuantity"
                  size="lg"
                  type="number"
                  placeholder="Quantidade Inicial"
                  {...register("initialQuantity", {
                    required: "Quantidade Inicial é obrigatória",
                    min: {
                      value: 0,
                      message: "A quantidade deve ser maior ou igual a 0",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.initialQuantity && errors.initialQuantity.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!errors.minimumQuantity} flex="1 0 45%">
                <FormLabel
                  htmlFor="minimumQuantity"
                  display="flex"
                  alignItems="center"
                >
                  <FaBoxOpen style={{ marginRight: "8px" }} /> Quantidade Mínima
                  no stock
                </FormLabel>
                <Input
                  variant="outline"
                  id="minimumQuantity"
                  size="lg"
                  type="number"
                  placeholder="Quantidade Mínima Inicial"
                  {...register("minimumQuantity", {
                    required: "Quantidade  Mínima é obrigatória",
                    min: {
                      value: 0,
                      message: "A quantidade deve ser maior ou igual a 0",
                    },
                  })}
                />
                <FormErrorMessage>
                  {errors.minimumQuantity && errors.minimumQuantity.message}
                </FormErrorMessage>
              </FormControl>
            </HStack>

            <HStack spacing="6" justify="space-between" alignItems="flex-start">
              <FormControl flex="1 0 45%">
                <FormLabel
                  htmlFor="expirationDate"
                  display="flex"
                  alignItems="center"
                >
                  <FaCalendarAlt style={{ marginRight: "8px" }} /> Data de
                  Validade
                </FormLabel>
                <Input
                  id="expirationDate"
                  size="lg"
                  type="date"
                  {...register("expirationDate")}
                />
              </FormControl>
            </HStack>
            <Box mx="auto">
              <Button
                type="submit"
                size="lg"
                colorScheme="teal"
                w="full"
                isLoading={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : productId
                  ? "Atualizar Produto"
                  : "Registrar Produto"}
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default ProductRegistrationForm;
