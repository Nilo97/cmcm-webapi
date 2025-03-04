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
import Form from "@/app/components/Form";
import { getBrands } from "@/app/actions/brand";
import { getMotoTypes } from "@/app/actions/mototype";

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
  const [brands, setBrands] = useState<BrandResponse[]>([]);
  const [motoTypes, setMotoTypes] = useState<BrandResponse[]>([]);

  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const id = searchParams.get("id");
    if (id && id !== LicenceId) {
      setLicenceId(id);
      loadLicenceData(id);
    }
    fetchClients("");
    fetchBrands();
    fetchMotoTypes();
  }, [searchParams]);

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
          title: "licença Registrada",
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
        onClick={() => router.back()} 
      >
        Voltar
      </Button>

      <Heading as="h2" size="lg" textAlign="center" mb={5} color="teal.600">
        {LicenceId ? "Atualizar Licença" : "Registrar Licença"}
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
        bookId={LicenceId}
      />
    </Box>
  );
};

export default LicenceRegistrationForm;
