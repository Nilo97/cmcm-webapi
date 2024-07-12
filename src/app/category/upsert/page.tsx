"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  getCategoryById,
  createCategory,
  updateCategory,
} from "@/app/actions/categories";
import { useSearchParams } from "next/navigation";

interface CategoryFormInputs {
  name: string;
  description: string;
}

const CategoryRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<CategoryFormInputs>();
  const router = useRouter();
  const toast = useToast();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setCategoryId(id);
      loadCategoryData(id);
    }
  }, [searchParams.get("id")]);

  const loadCategoryData = async (id: string) => {
    try {
      const data = await getCategoryById(id);
      if ("error" in data) {
        throw new Error(data.error);
      }
      setValue("name", data.category.name);
      setValue("description", data.category.description);
    } catch (error) {
      console.error("Error loading category:", error);
      toast({
        title: "Erro ao carregar categoria",
        description:
          "Ocorreu um erro ao tentar carregar os dados da categoria.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (values: CategoryFormInputs) => {
    try {
      const { name, description } = values;

      if (categoryId) {
        const response = await updateCategory(categoryId, {
          name,
          description,
        });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Categoria Atualizada",
          description: "A categoria foi atualizada com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createCategory({ name, description });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Categoria Registrada",
          description: "A categoria foi registrada com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      router.push("/category");
    } catch (error) {
      console.error("Error creating/updating category:", error);
      toast({
        title: "Erro ao salvar categoria",
        description: "Ocorreu um erro ao tentar salvar a categoria.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Button mt="4" size="lg" onClick={() => router.back()}>
        Voltar
      </Button>

      <Box
        mt="8"
        mx={{ base: "auto", md: "20" }}
        p="4"
        borderWidth="1px"
        borderRadius="lg"
        boxShadow="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack spacing="6" align="stretch">
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Nome da Categoria</FormLabel>
              <Input
                id="name"
                size="lg"
                placeholder="Nome da Categoria"
                {...register("name", {
                  required: "Nome da Categoria é obrigatório",
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
                size="lg"
                placeholder="Descrição da Categoria"
                {...register("description", {
                  required: "Descrição é obrigatória",
                })}
              />
              <FormErrorMessage>
                {errors.description && errors.description.message}
              </FormErrorMessage>
            </FormControl>

            <Box mt="8" mx="auto" p="4">
              <Button
                type="submit"
                size="lg"
                colorScheme="teal"
                w="full"
                isLoading={isSubmitting}
              >
                {isSubmitting
                  ? "Salvando..."
                  : categoryId
                  ? "Atualizar Categoria"
                  : "Registrar Categoria"}
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default CategoryRegistrationForm;
