"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  HStack,
  VStack,
  Select as Cselect,
  FormErrorMessage,
  useToast,
  Heading,
  Divider,
  Flex,
  GridItem,
  SimpleGrid,
  List,
  ListItem,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { getBookById, updateBook, createBook } from "@/app/actions/book";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { customer, CustomerResponse } from "@/app/actions/types";
import { fetchPaginatedCustomers, getCustomers } from "@/app/actions/customer";
import Select, { SingleValue } from "react-select";

const brands = ["Toyota", "Suzuki B", "Marca C"];
const bicycleTypes = ["Bicicleta", "Bicicleta", "Scooter"];

interface Book {
  id?: string;
  registrationNumber: string;
  brand: string;
  model: string;
  manufactureYear: number;
  bicycleType: string;
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== bookId) {
      setBookId(id);
      loadBookData(id);
    }

    fetchClients();
  }, [searchParams]);

  const fetchClients = async () => {
    const response = await fetchPaginatedCustomers(10, 0);
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

  const loadCustomers = async () => {
    try {
      const data = await getCustomers();
      if ("error" in data) {
        throw new Error(data.error);
      }
      setCustomers(data);
    } catch (error) {
      console.error("Error loading utentes:", error);
      toast({
        title: "Erro ao carregar utentes",
        description: "Ocorreu um erro ao tentar carregar as utentes.",
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
      // router.push("/dashboard/books");
      // router.push("/dashboard/books");
    } catch (error) {
      toast({
        title: "Erro ao salvar livrete",
        description: "Não foi possível salvar os dados.",
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
      boxShadow="xl"
    >
      <Heading as="h2" size="xl" textAlign="center" mb={4} color="teal.500">
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
            <FormControl isInvalid={!!errors.brand}>
              <FormLabel>Marca</FormLabel>
              <Cselect
                {...register("brand", { required: "Campo obrigatório" })}
              >
                {brands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </Cselect>

              {errors.brand && (
                <FormErrorMessage>
                  {typeof errors.brand === "string"
                    ? errors.brand
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
            <FormControl isInvalid={!!errors.bicycleType}>
              <FormLabel>Tipo de Velocípede</FormLabel>
              <Cselect
                {...register("bicycleType", { required: "Campo obrigatório" })}
              >
                {bicycleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </Cselect>

              {errors.bicycleType && (
                <FormErrorMessage>
                  {typeof errors.bicycleType === "string"
                    ? errors.bicycleType
                    : "Campo é obrigatório."}
                </FormErrorMessage>
              )}
            </FormControl>
          </GridItem>
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
                    placeholder="Selecione o Utente"
                    options={clientOptions}
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
          <GridItem>
            <FormControl isInvalid={!!errors.engineNumber}>
              <FormLabel>Número do Motor</FormLabel>
              <Input
                {...register("engineNumber", { required: "Campo obrigatório" })}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.engineCapacity}>
              <FormLabel>Capacidade do Motor</FormLabel>
              <Input
                {...register("engineCapacity", {
                  required: "Campo obrigatório",
                })}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isInvalid={!!errors.frameNumber}>
              <FormLabel>Número do Quadro</FormLabel>
              <Input
                {...register("frameNumber", { required: "Campo obrigatório" })}
              />
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
