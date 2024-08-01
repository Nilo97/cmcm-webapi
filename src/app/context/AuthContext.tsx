"use client";

import { createContext, useEffect, useState } from "react";
import { setCookie, parseCookies } from "nookies";
import { signIn, signUp } from "../actions/auth";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type registrationRequest = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (data: registrationRequest) => Promise<void>;
  register: (data: registrationRequest) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [isAuthenticated, setAutenticated] = useState<boolean | null>(false);
  const toast = useToast();
  const router = useRouter();

  async function login({ username, password }: registrationRequest) {
    const { token, error }: any = await signIn({
      username,
      password,
    });

    if (error) {
      toast({
        title: "Erro no login.",
        description:
          typeof error === "string" ? error : "Ocorreu um erro inesperado.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } else {
      setCookie(undefined, "token", token, {
        maxAge: 60 * 60 * 1,
      });

      if (token !== "" && token !== null && token !== undefined) {
        router.push("/options");
      }
    }
  }

  async function register({ username, password }: registrationRequest) {
    const { error }: any = await signUp({
      username,
      password,
    });

    if (error) {
      toast({
        title: error,
        status: "error",
        isClosable: true,
        position: "top",
      });
    } else {
      toast({
        title: "Account created.",
        description: "We've created your account for you.",
        status: "success",
        isClosable: true,
      });

      login({ username, password });
    }
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, register }}>
      {children}
    </AuthContext.Provider>
  );
}
