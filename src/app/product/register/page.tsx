"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  VStack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { fetchCategories } from "@/app/actions/categories";
import { createProduct } from "@/app/actions/product";

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
}

const ProductRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>();
  const router = useRouter();
  const toast = useToast();
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

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
      const { name, code, description, price, category } = values;

      const categoryId = parseInt(category);

      const response = await createProduct({
        name,
        code,
        description,
        price,
        categoryId,
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

      router.push("/product");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        title: "Erro ao registrar produto",
        description: "Ocorreu um erro ao tentar registrar o produto.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Button mt="4" size="sm" onClick={() => router.back()}>
        Voltar
      </Button>

      <Box maxW="md" mx="auto" mt="8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="4" align="stretch">
            <FormControl isInvalid={!!errors.code}>
              <FormLabel htmlFor="name">Código do Produto</FormLabel>
              <Input
                id="name"
                placeholder="Código do Produto"
                {...register("code", {
                  required: "Código do Produto é obrigatório",
                })}
              />
              <FormErrorMessage>
                {errors.code && errors.code.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Nome do Produto</FormLabel>
              <Input
                id="name"
                placeholder="Nome do Produto"
                {...register("name", {
                  required: "Nome do Produto é obrigatório",
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.description}>
              <FormLabel htmlFor="description">Descrição</FormLabel>
              <Textarea
                id="description"
                placeholder="Descrição do Produto"
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.price}>
              <FormLabel htmlFor="price">Preço</FormLabel>
              <Input
                id="price"
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

            <FormControl isInvalid={!!errors.category}>
              <FormLabel htmlFor="category">Categoria</FormLabel>
              <Select
                id="category"
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

            <Button
              mt="4"
              colorScheme="teal"
              isLoading={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Registrando..." : "Registrar Produto"}
            </Button>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default ProductRegistrationForm;
