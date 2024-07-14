"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  FormErrorMessage,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  getSupplierById,
  createSupplier,
  updateSupplier,
} from "@/app/actions/suppliers";
import { useSearchParams } from "next/navigation";

interface SupplierFormInputs {
  name: string;
  contactInfo: string;
}

const SupplierRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<SupplierFormInputs>();
  const router = useRouter();
  const toast = useToast();
  const [supplierId, setSupplierId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = searchParams.get("id");

    if (id) {
      setSupplierId(id);
      loadSupplierData(id);
    }
  }, [searchParams.get("id")]);

  const loadSupplierData = async (id: string) => {
    try {
      const data = await getSupplierById(id);
      if ("error" in data) {
        throw new Error(data.error);
      }
      setValue("name", data.supplier.name);
      setValue("contactInfo", data.supplier.contactInfo);
    } catch (error) {
      console.error("Error loading supplier:", error);
      toast({
        title: "Erro ao carregar fornecedor",
        description: "Ocorreu um erro ao tentar carregar os dados do fornecedor.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (values: SupplierFormInputs) => {
    try {
      const { name, contactInfo } = values;

      if (supplierId) {
        const response = await updateSupplier(supplierId, {
          name,
          contactInfo,
        });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Fornecedor Atualizado",
          description: "O fornecedor foi atualizado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createSupplier({ name, contactInfo });

        if ("error" in response) {
          throw new Error(response.error);
        }

        toast({
          title: "Fornecedor Registrado",
          description: "O fornecedor foi registrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }

      router.push("/supplier");
    } catch (error) {
      console.error("Error creating/updating supplier:", error);
      toast({
        title: "Erro ao salvar fornecedor",
        description: "Ocorreu um erro ao tentar salvar o fornecedor.",
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
              <FormLabel htmlFor="name">Nome do Fornecedor</FormLabel>
              <Input
                id="name"
                size="lg"
                placeholder="Nome do Fornecedor"
                {...register("name", {
                  required: "Nome do Fornecedor é obrigatório",
                })}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!errors.contactInfo}>
              <FormLabel htmlFor="contactInfo">Informação de Contato</FormLabel>
              <Input
                id="contactInfo"
                size="lg"
                placeholder="Informação de Contato"
                {...register("contactInfo", {
                  required: "Informação de Contato é obrigatória",
                })}
              />
              <FormErrorMessage>
                {errors.contactInfo && errors.contactInfo.message}
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
                  : supplierId
                  ? "Atualizar Fornecedor"
                  : "Registrar Fornecedor"}
              </Button>
            </Box>
          </VStack>
        </form>
      </Box>
    </>
  );
};

export default SupplierRegistrationForm;
