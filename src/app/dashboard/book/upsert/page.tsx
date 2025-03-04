"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select as Cselect,
  FormErrorMessage,
  useToast,
  Heading,
  Divider,
  Flex,
  GridItem,
  SimpleGrid,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { getBookById, updateBook, createBook } from "@/app/actions/book";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrandResponse, customer, CustomerResponse } from "@/app/actions/types";
import { fetchPaginatedCustomers, getCustomers } from "@/app/actions/customer";
import Select, { SingleValue } from "react-select";
import { fetchPaginatedBrands, getBrands } from "@/app/actions/brand";
import { fetchPaginatedMotoTypes, getMotoTypes } from "@/app/actions/mototype";
import { ArrowBackIcon } from "@chakra-ui/icons";
import Form from "@/app/components/Form";

const bicycleTypes = ["Bicicleta", "Bicicleta", "Scooter"];

interface Book {
  id?: string;
  registrationNumber: string;
  brandId: string;
  model: string;
  manufactureYear: number;
  bicycleTypeId: string;
  engineNumber: string;
  engineCapacity: string;
  frameNumber: string;
  observations: string;
  customerId: string;
}

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
  const [manufactureYear, setManufactureYear] = useState<Date | null>(null);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [motoTypes, setMotoTypes] = useState<BrandResponse[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [showDropdown, setShowDropdown] = useState(false);
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== bookId) {
      setBookId(id);
      loadBookData(id);
    }

    fetchClients("");
    fetchBrands();
    fetchMotoTypes();
  }, [searchParams]);

  const fetchClients = async (searchTerm: string) => {
    const response = await fetchPaginatedCustomers(10, 0, searchTerm);
    if ("error" in response) {
      toast({
        title: "Erro ao carregar Proprietários.",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setCustomers(response.customers);
    }
  };

  const fetchBrands = async () => {
    const response = await getBrands();
    if ("error" in response) {
      toast({
        title: "Erro ao carregar marcas.",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setBrands(response);
    }
  };

  const fetchMotoTypes = async () => {
    const response = await getMotoTypes();
    if ("error" in response) {
      toast({
        title: "Erro ao carregar tipos.",
        description: response.error,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } else {
      setMotoTypes(response);
    }
  };

  const clientOptions = customers.map((client) => ({
    value: client.id,
    label: client.name,
  }));



  const loadBookData = async (id: string) => {
    try {
      const data = await getBookById(id);
      if ("error" in data) throw new Error(data.error);
    } catch (error) {
      toast({
        title: "Erro ao carregar livrete",
        description: "Não foi possível carregar os dados.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const onSubmit = async (data: any) => {
    const values = {
      ...data,
      customerId: data.customerId.value,
    };

    try {
      if (bookId) {
        await updateBook(bookId, values);
        toast({
          title: "livrete Atualizado",
          description: "Os dados foram atualizados com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createBook(values);
        if ("error" in response) throw new Error(response.error);
        toast({
          title: "livrete Registrado",
          description: "O livrete foi registrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      router.back();
    } catch (error) {
      toast({
        title: "Erro ao salvar livrete",
        description: `${error}`,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      mx="auto"
      mt={2}
      p={6}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="2xl"
      bg="white"
    >
      <Button
        leftIcon={<ArrowBackIcon />}
        colorScheme="gray"
        mb={4}
        onClick={() => router.back()} // Certifique-se de importar useRouter do Next.js
      >
        Voltar
      </Button>
      <Heading as="h2" size="lg" textAlign="center" mb={5} color="teal.600">
        {bookId ? "Atualizar livrete" : "Registrar livrete"}
      </Heading>
      <Divider mb={1} />

      <Form
        register={register}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        errors={errors}
        control={control}
        brands={brands}
        motoTypes={motoTypes}
        clientOptions={clientOptions}
        setQuery={setQuery}
        fetchClients={fetchClients}
        setValue={setValue}
        isSubmitting={isSubmitting}
        bookId={bookId}
      />
    </Box>
  );
};

export default BookRegistrationForm;
