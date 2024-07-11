"use client";

import React from "react";
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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface ProductFormInputs {
  name: string;
  description: string;
  price: number;
  quantity: number;
  category: string;
}

const ProductRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormInputs>();
  const router = useRouter();

  const onSubmit = (values: ProductFormInputs) => {
    // Simulate an API call
    console.log(values);
  };

  return (
    <Box maxW="md" mx="auto" mt="8">
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="4" align="stretch">
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
              <option value="categoria1">Categoria 1</option>
              <option value="categoria2">Categoria 2</option>
              <option value="categoria3">Categoria 3</option>
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
            Registrar Produto
          </Button>
        </VStack>
      </form>

      {/* Voltar button */}
      <Button mt="4" size="sm" onClick={() => router.back()}>
        Voltar
      </Button>
    </Box>
  );
};

export default ProductRegistrationForm;
