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

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      if ("error" in data) {
        throw new Error(data.error);
      }
      setCustomers(data);
    } catch (error) {
      console.error("Error loading Proprietários:", error);
      toast({
        title: "Erro ao carregar Proprietários",
        description: "Ocorreu um erro ao tentar carregar as Proprietários.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

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
      mt={6}
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
      <Divider mb={4} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4} spacingY={2}>
          <GridItem>
            <FormControl isInvalid={!!errors.registrationNumber}>
              <FormLabel>Número de Registro</FormLabel>
              <Input
                {...register("registrationNumber", {
                  required: "Campo obrigatório",
                })}
              />

              {errors.registrationNumber && (
                <FormErrorMessage>
                  {typeof errors.registrationNumber === "string"
                    ? errors.registrationNumber
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.brandId}>
              <FormLabel>Marca</FormLabel>
              <Cselect
                {...register("brandId", { required: "Campo obrigatório" })}
              >
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.description}
                  </option>
                ))}
              </Cselect>

              {errors.brandId && (
                <FormErrorMessage>
                  {typeof errors.brandId === "string"
                    ? errors.brandId
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.model}>
              <FormLabel>Modelo</FormLabel>
              <Input
                {...register("model", { required: "Campo obrigatório" })}
              />
              {errors.model && (
                <FormErrorMessage>
                  {typeof errors.model === "string"
                    ? errors.model
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.manufactureYear}>
              <FormLabel>Ano de Fabricação</FormLabel>
              <DatePicker
                selected={manufactureYear}
                onChange={(date: Date | null) => {
                  if (date) {
                    const year = date.getFullYear();
                    setManufactureYear(date);
                    setValue("manufactureYear", year);
                  }
                }}
                showYearPicker
                dateFormat="yyyy"
                customInput={<Input />}
              />

              {errors.manufactureYear && (
                <FormErrorMessage>
                  {typeof errors.manufactureYear === "string"
                    ? errors.manufactureYear
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.bicycleTypeId}>
              <FormLabel>Tipo de Velocípede</FormLabel>
              <Cselect
                {...register("bicycleTypeId", {
                  required: "Campo obrigatório",
                })}
              >
                {motoTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.description}
                  </option>
                ))}
              </Cselect>

              {errors.bicycleTypeId && (
                <FormErrorMessage>
                  {typeof errors.bicycleTypeId === "string"
                    ? errors.bicycleTypeId
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.customerId} id="customerId">
              <FormLabel color="gray.700">Proprietário</FormLabel>
              <Controller
                name="customerId"
                control={control}
                rules={{ required: "Proprietário é obrigatório." }}
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="Pesquise e selecione o Proprietário"
                    options={clientOptions}
                    isSearchable
                    onInputChange={(inputValue) => {
                      setQuery(inputValue);
                      fetchClients(inputValue);
                    }}
                    styles={{
                      control: (styles) => ({
                        ...styles,
                        backgroundColor: "white",
                        borderColor: errors.customerId ? "red.500" : "gray.300",
                        ":hover": { borderColor: "teal.400" },
                      }),
                      option: (styles, { isSelected }) => ({
                        ...styles,
                        backgroundColor: isSelected ? "teal.100" : "white",
                        color: "black",
                        ":hover": { backgroundColor: "teal.50" },
                      }),
                    }}
                  />
                )}
              />
              {errors.customerId && (
                <FormErrorMessage>
                  {typeof errors.customerId === "string"
                    ? errors.customerId
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.engineNumber}>
              <FormLabel>Número do Motor</FormLabel>
              <Input
                type="number"
                {...register("engineNumber", { required: "Campo obrigatório" })}
              />
              {errors.engineNumber && (
                <FormErrorMessage>
                  {typeof errors.engineNumber === "string"
                    ? errors.engineNumber
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.engineCapacity}>
              <FormLabel>Cilindrada </FormLabel>

              <InputGroup size="md">
                <Input
                  type="number"
                  {...register("engineCapacity", {
                    required: "Campo obrigatório",
                  })}
                />
                <InputRightElement width="4.5rem">m³</InputRightElement>
              </InputGroup>

              {errors.engineCapacity && (
                <FormErrorMessage>
                  {typeof errors.engineCapacity === "string"
                    ? errors.engineCapacity
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.frameNumber}>
              <FormLabel>Número do Quadro</FormLabel>
              <Input
                type="number"
                {...register("frameNumber", { required: "Campo obrigatório" })}
              />
              {errors.frameNumber && (
                <FormErrorMessage>
                  {typeof errors.frameNumber === "string"
                    ? errors.frameNumber
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <FormControl isInvalid={!!errors.observations}>
              <FormLabel>Observações</FormLabel>
              <Textarea {...register("observations")} />
            </FormControl>
          </GridItem>
        </SimpleGrid>
        <Flex justify="center" mt={6}>
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            size="lg"
            px={8}
          >
            {bookId ? "Atualizar" : "Registrar"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default BookRegistrationForm;
