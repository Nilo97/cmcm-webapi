"use client";

import React from "react";
import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  Divider,
  Image,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Grid,
} from "@chakra-ui/react";
import { Company, User } from "../actions/types";

interface CompanyDetailProps {
  company: Company;
  users: User[];
}

const CompanyDetail: React.FC<CompanyDetailProps> = ({ company, users }) => {
  const fontSize = "md";

  return (
    <Container maxW="container.lg">
      <Stack spacing={6}>
        <Stack direction="row" align="center" spacing={4}>
          <Image
            src={
              company.logo ||
              "https://engenhariaestudantil.wordpress.com/wp-content/uploads/2015/03/logo-ferragens.jpg"
            }
            alt={`${company.name} Logo`}
            boxSize="150px"
            objectFit="contain"
          />
          <Heading as="h1" size="2xl" textAlign="left">
            {company.name}
          </Heading>
        </Stack>

        <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={6}>
          <Box
            bg="white"
            p={6}
            borderRadius="md"
            boxShadow="md"
            border="1px"
            borderColor="gray.200"
          >
            <Heading as="h2" size="md" mb={4} textAlign="center">
              Detalhes da Empresa
            </Heading>
            <Stack spacing={4}>
              <Text fontSize={fontSize}>
                <strong>Endereço:</strong> {company.address}
              </Text>
              <Text fontSize={fontSize}>
                <strong>Email:</strong> {company.email}
              </Text>
              <Text fontSize={fontSize}>
                <strong>Telefone:</strong> {company.phone}
              </Text>
              <Text fontSize={fontSize}>
                <strong>NUIT:</strong> {company.NUIT}
              </Text>
              <Text fontSize={fontSize}>
                <strong>Plano:</strong> {company.plan}
              </Text>
            </Stack>
          </Box>

          <Box>
            <Stack spacing={4}>
              <Stack direction="row" justify="space-between" align="center">
                <Heading as="h3" size="lg">
                  Lista de Usuários
                </Heading>
                <Button colorScheme="teal" size="md">
                  Criar Usuário
                </Button>
              </Stack>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>usuário</Th>
                    <Th>Email</Th>
                    <Th>Ações</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {company.users.map((user) => (
                    <Tr key={user.id}>
                      <Td>{user.username}</Td>
                      <Td>{user.email}</Td>
                      <Td>
                        <Button colorScheme="blue" size="sm" mr={2}>
                          Editar
                        </Button>
                        <Button colorScheme="red" size="sm">
                          Excluir
                        </Button>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Stack>
          </Box>
        </Grid>
      </Stack>

      <Box textAlign="center" mt={6}>
        <Text fontSize="sm" color="gray.600">
          Atualizado recentemente
        </Text>
      </Box>
    </Container>
  );
};

export default CompanyDetail;
