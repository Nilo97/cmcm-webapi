"use client";

import React, { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Center,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { signIn } from "./actions/auth";
import { useRouter } from "next/navigation";
import { AuthContext } from "./context/AuthContext";
import { invoke } from "@tauri-apps/api";

const LoginForm = () => {
  const router = useRouter();
  const toast = useToast();
  const { login } = useContext(AuthContext);

  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      await login(data); 
    } finally {
      setIsLoading(false);
    }
  };

  const onError = () => {
    toast({
      title: "Erro no login.",
      description: "Por favor, verifique os dados e tente novamente.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  };

  return (
    <Center h="100vh" bg="gray.100">
      <Box
        bg="white"
        p={8}
        rounded="md"
        shadow="md"
        w={{ base: "90%", md: "400px" }}
      >
        <Text fontSize="2xl" fontWeight="bold" mb={6} textAlign="center">
          Login
        </Text>
        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.username}>
              <FormLabel>Utilizador</FormLabel>
              <Input
                placeholder="Digite seu Utilizador"
                {...register("username", {
                  required: "Email é obrigatório",
                })}
              />
              {errors.username && (
                <Text color="red.500" mt={2}>
                  {errors.username.message as string}
                </Text>
              )}
            </FormControl>
            <FormControl isInvalid={!!errors.password}>
              <FormLabel>Senha</FormLabel>
              <Input
                type="password"
                placeholder="Digite sua senha"
                {...register("password", {
                  required: "Senha é obrigatória",
                  minLength: {
                    value: 6,
                    message: "A senha deve ter no mínimo 6 caracteres",
                  },
                })}
              />
              {errors.password && (
                <Text color="red.500" mt={2}>
                  {errors.password.message as string}
                </Text>
              )}
            </FormControl>
            <Button
              colorScheme="teal"
              size="lg"
              type="submit"
              w="full"
              isLoading={isLoading}
            >
              Entrar
            </Button>
          </VStack>
        </form>
      </Box>
    </Center>
  );
};

export default LoginForm;
