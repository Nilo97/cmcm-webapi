"use client";
import { createContext, useState } from "react";
import { setCookie } from "nookies";
import { signIn, signUp } from "../actions/auth";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type RegistrationRequest = {
  username: string;
  password: string;
};

type AuthContextType = {
  isAuthenticated: boolean | null;
  login: (data: RegistrationRequest) => Promise<void>;
  register: (data: RegistrationRequest) => Promise<void>;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: any) {
  const [isAuthenticated, setAuthenticated] = useState<boolean | null>(false);
  const toast = useToast();
  const router = useRouter();

  async function login({ username, password }: RegistrationRequest) {
    const { token, error, user, email, companyId }: any = await signIn({
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

    } 
    
    else {
      setCookie(undefined, "token", token, {
        maxAge: 60 * 60 * 24 * 365,
      });

      setCookie(undefined, "user", user, {
        maxAge: 60 * 60 * 24 * 365, 
      });

      setCookie(undefined, "email", email, {
        maxAge: 60 * 60 * 24 * 365, 
      });

      setCookie(undefined, "companyId", companyId, {
        maxAge: 60 * 60 * 24 * 365, 
      });

      if (token !== "" && token !== null && token !== undefined) {
        setAuthenticated(true);
        router.push("/options");
      }
    }
  }

  async function register({ username, password }: RegistrationRequest) {
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
        title: "Conta criada.",
        description: "Sua conta foi criada com sucesso.",
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
