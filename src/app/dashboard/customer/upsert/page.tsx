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
  Heading,
  Divider,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getcustomerById,
  updatecustomer,
  createcustomer,
} from "@/app/actions/suppliers";

interface Customer {
  name: string;
  documentNumber: string;
  address: string;
  phoneNumber: string;
}

const CustomerRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<Customer>();

  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [customerId, setCustomerId] = useState<string | null>(null);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== customerId) {
      setCustomerId(id);
      loadCustomerData(id);
    }
  }, [searchParams]);

  const loadCustomerData = async (id: string) => {
    try {
      const data = await getcustomerById(id);
      if ("error" in data) throw new Error(data.error);
      setValue("name", data.customer.name);
      setValue("documentNumber", data.customer.documentNumber);
      setValue("address", data.customer.address);
      setValue("phoneNumber", data.customer.phoneNumber);
    } catch (error) {
      toast({
        title: "Erro ao carregar utente",
        description: "Não foi possível carregar os dados.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (values: Customer) => {
    try {
      if (customerId) {
        const response = await updatecustomer(customerId, values);
        if ("error" in response) throw new Error(response.error);
        toast({
          title: "Utente Atualizado",
          description: "Os dados foram atualizados com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createcustomer(values);
        if ("error" in response) throw new Error(response.error);
        toast({
          title: "Utente Registrado",
          description: "O utente foi registrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      router.push("/dashboard/customer");
    } catch (error) {
      toast({
        title: "Erro ao salvar utente",
        description: "Não foi possível salvar os dados.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="500px"
      mx="auto"
      mt="1"
      p="6"
      borderWidth="1px"
      borderRadius="lg"
      boxShadow="xl"
    >
      <Heading as="h2" size="lg" textAlign="center" mb="4">
        {customerId ? "Atualizar Utente" : "Registrar Utente"}
      </Heading>
      <Divider mb="4" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing="5" align="stretch">
          <FormControl isInvalid={!!errors.name}>
            <FormLabel>Nome</FormLabel>
            <Input
              size="lg"
              placeholder="Nome do Utente"
              {...register("name", { required: "Nome é obrigatório" })}
            />
            <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.documentNumber}>
            <FormLabel>Documento</FormLabel>
            <Input
              size="lg"
              placeholder="Número do Documento"
              {...register("documentNumber", {
                required: "Documento é obrigatório",
              })}
            />
            <FormErrorMessage>
              {errors.documentNumber?.message}
            </FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.address}>
            <FormLabel>Endereço</FormLabel>
            <Input
              size="lg"
              placeholder="Endereço do Utente"
              {...register("address", { required: "Endereço é obrigatório" })}
            />
            <FormErrorMessage>{errors.address?.message}</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={!!errors.phoneNumber}>
            <FormLabel>Telefone</FormLabel>
            <Input
              size="lg"
              placeholder="Número de Telefone"
              {...register("phoneNumber", {
                required: "Telefone é obrigatório",
              })}
            />
            <FormErrorMessage>{errors.phoneNumber?.message}</FormErrorMessage>
          </FormControl>

          <Button
            type="submit"
            size="lg"
            colorScheme="teal"
            w="full"
            isLoading={isSubmitting}
            mt="4"
          >
            {isSubmitting
              ? "Salvando..."
              : customerId
              ? "Atualizar"
              : "Registrar"}
          </Button>

          <Button
            mt="2"
            size="lg"
            variant="outline"
            colorScheme="gray"
            w="full"
            onClick={() => router.back()}
          >
            Voltar
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CustomerRegistrationForm;
