"use client"; 

import { useEffect, useState } from "react";
import { OpeningClosingTab } from "@/app/components/OpeningClosingTab";
import {
  Box,
  Heading,
  Text,
  Center,
  Spinner,
  Button,
  useToast,
} from "@chakra-ui/react";
import { CashFlowResponse } from "@/app/types";
import { fetchCurrentCashFlow } from "@/app/actions/chashflow";
import { useRouter } from "next/navigation";

const CashRegister = () => {
  const [cashFlow, setCashFlow] = useState<CashFlowResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    const loadCurrentCashFlow = async () => {
      setLoading(true);
      try {
        const result = await fetchCurrentCashFlow();
        if ("error" in result) {
          throw new Error(result.error);
        }
        setCashFlow(result);
      } catch (err) {
        setError("Erro ao carregar o fluxo de caixa.");
        toast({
          title: "Erro ao carregar dados.",
          description: (err as Error).message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    loadCurrentCashFlow();
  }, [toast]);

  const handleGoBack = () => {
    router.back()
  };

  return (
    <Center minH="100vh" bgGradient="linear(to-r, teal.500, green.500)" p={4}>
      <Box
        p={8}
        w="full"
        maxW="600px"
        bg="white"
        boxShadow="xl"
        borderRadius="md"
        textAlign="center"
      >
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={handleGoBack}
          mb={6}
          alignSelf="start"
        >
          Voltar
        </Button>
        <Heading as="h2" size="lg" mb={6} color="teal.600" fontWeight="bold">
           Caixa
        </Heading>
        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="lg" color="teal.400" />
            <Text mt={4} fontSize="lg" color="gray.600">
              Carregando...
            </Text>
          </Box>
        ) : error ? (
          <Text color="red.500" fontSize="lg">
            {error}
          </Text>
        ) : (
          <OpeningClosingTab cashFlow={cashFlow} />
        )}
      </Box>
    </Center>
  );
};

export default CashRegister;
