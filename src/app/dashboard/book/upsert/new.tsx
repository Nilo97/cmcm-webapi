"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Divider,
  FormControl,
  FormLabel,
  GridItem,
  Heading,
  useToast,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { CustomerResponse } from "@/app/actions/types";
import { fetchPaginatedCustomers } from "@/app/actions/customer";
import Select from "react-select";

const BookRegistrationForm: React.FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    setValue,
    control,
  } = useForm();

  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const [bookId, setBookId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== bookId) {
      setBookId(id);
    }
    fetchClients(""); // Carrega os clientes inicialmente
  }, [searchParams]);

  const fetchClients = async (searchTerm: string) => {
    const response = await fetchPaginatedCustomers(10, 0, searchTerm);
    if ("error" in response) {
      toast({
        title: "Erro ao carregar utentes.",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setCustomers(response.customers);
    }
  };

  const clientOptions = customers.map((client) => ({
    value: client.id,
    label: client.name,
  }));

  return (
    <Box
      mx="auto"
      mt={6}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="xl"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={4} color="teal.500">
        {bookId ? "Atualizar livrete" : "Registrar livrete"}
      </Heading>
      <Divider mb={4} />

      {/* Seleção de Cliente com Pesquisa */}
      <GridItem>
        <FormControl mr={2} isInvalid={!!errors.customerId} id="customerId">
          <FormLabel> Utente:</FormLabel>
          <Controller
            name="customerId"
            control={control}
            rules={{ required: "Utente é obrigatório." }}
            render={({ field }) => (
              <Select
                {...field}
                placeholder="Pesquise e selecione o Utente"
                options={clientOptions}
                isSearchable
                onInputChange={(inputValue) => {
                  setQuery(inputValue);
                  fetchClients(inputValue); // Atualiza os clientes conforme digita
                }}
                styles={{
                  control: (styles) => ({
                    ...styles,
                    backgroundColor: "white",
                  }),
                  option: (styles, { isSelected }) => ({
                    ...styles,
                    color: "black",
                    backgroundColor: isSelected ? "#ddd" : "white",
                  }),
                }}
              />
            )}
          />
        </FormControl>
      </GridItem>
    </Box>
  );
};

export default BookRegistrationForm;
