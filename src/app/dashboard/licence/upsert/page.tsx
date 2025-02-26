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
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getLicenceById,
  updateLicence,
  createLicence,
} from "@/app/actions/licence";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { BrandResponse, customer, CustomerResponse } from "@/app/actions/types";
import { fetchPaginatedCustomers, getCustomers } from "@/app/actions/customer";
import Select, { SingleValue } from "react-select";
import { ArrowBackIcon } from "@chakra-ui/icons";

const bicycleTypes = ["Bicicleta", "Bicicleta", "Scooter"];

interface Licence {
  id?: string;
  registrationNumber: string;
  brandId: string;
  model: string;
  manufactureYear: number;
  bicycleTypeId: string;
  engineNumber: string;
  engineCapacity: string;
  frameNumber: string;
  obs: string;
  customerId: string;
}

const LicenceRegistrationForm: React.FC = () => {
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
  const [LicenceId, setLicenceId] = useState<string | null>(null);
  const [customers, setCustomers] = useState<CustomerResponse[]>([]);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== LicenceId) {
      setLicenceId(id);
      loadLicenceData(id);
    }
    fetchClients("");
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

  const loadLicenceData = async (id: string) => {
    try {
      const data = await getLicenceById(id);
      if ("error" in data) throw new Error(data.error);
    } catch (error) {
      toast({
        title: "Erro ao carregar licença",
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
      if (LicenceId) {
        await updateLicence(LicenceId, values);
        toast({
          title: "licença Atualizado",
          description: "Os dados foram atualizados com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        const response = await createLicence(values);
        if ("error" in response) throw new Error(response.error);
        toast({
          title: "licença Registrado",
          description: "O licença foi registrado com sucesso.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      }
      router.back();
    } catch (error) {
      toast({
        title: "Erro ao salvar licença",
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
      p={8}
      borderWidth={1}
      borderRadius="xl"
      boxShadow="2xl"
      bg="white"
      maxW="3xl"
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
        {LicenceId ? "Atualizar Licença" : "Registrar Licença"}
      </Heading>
      <Divider mb={6} />

      <form onSubmit={handleSubmit(onSubmit)}>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={5}>
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <FormControl isInvalid={!!errors.customerId} id="customerId">
              <FormLabel fontWeight="bold" color="gray.700">
                Proprietário
              </FormLabel>
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

          <GridItem colSpan={{ base: 1, md: 3 }}>
            <FormControl isInvalid={!!errors.obs}>
              <FormLabel fontWeight="bold" color="gray.700">
                Observações
              </FormLabel>
              <Textarea
                {...register("obs")}
                placeholder="Adicione informações adicionais..."
                borderColor="gray.300"
                _hover={{ borderColor: "teal.400" }}
                focusBorderColor="teal.500"
              />
            </FormControl>
          </GridItem>
        </SimpleGrid>

        <Flex justify="center" mt={8}>
          <Button
            type="submit"
            colorScheme="teal"
            isLoading={isSubmitting}
            size="lg"
            px={10}
            _hover={{ bg: "teal.600" }}
            transition="0.3s"
          >
            {LicenceId ? "Atualizar" : "Registrar"}
          </Button>
        </Flex>
      </form>
    </Box>
  );
};

export default LicenceRegistrationForm;
