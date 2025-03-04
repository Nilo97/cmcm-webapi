"use client";

import React, { useState, useEffect } from "react";
import {
  Container,
  Heading,
  Button,
  useDisclosure,
  Flex,
  useToast,
  Spinner,
} from "@chakra-ui/react";
import { FaUpload } from "react-icons/fa6";
import { AddIcon, DownloadIcon } from "@chakra-ui/icons";
import { useRouter } from "next/navigation";
import {
  fetchLicences,
  deleteLicence,
  convertToBook,
} from "@/app/actions/licence";
import { Licence } from "@/app/actions/types";
import LicenceTable from "@/app/components/LicenceTable";

const PAGE_SIZE = 7;

const LicencesPage: React.FC = () => {
  const [licences, setLicences] = useState<Licence[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const toast = useToast();
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isConverting, setIsConverting] = useState(false);
  useEffect(() => {
    fetchAllLicences(currentPage);
  }, [currentPage, searchQuery, isConverting]);

  const fetchAllLicences = async (page: number) => {
    setLoading(true);
    try {
      const data = await fetchLicences(PAGE_SIZE, page, searchQuery);
      if ("error" in data) {
        throw new Error(data.error);
      }
      setLicences(data.licences);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Erro ao buscar licenças:", error);
      toast({
        title: "Erro ao buscar licenças",
        description: "Ocorreu um erro ao buscar os licenças.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleConvert = async (licence: Licence) => {
    if (!licence) return;
    setIsConverting(true);

    const result = await convertToBook(licence.id);

    if ("error" in result) {
      console.error("Conversion failed:", result.error);
    } else {
      toast({
        title: "Licença convertida",
        description: "A Licença foi convertida com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    }

    setIsConverting(false);
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleDelete = async (licenceId: string) => {
    setLoading(true);
    try {
      const response = await deleteLicence(licenceId);
      if ("error" in response) {
        throw new Error(response.error);
      }
      toast({
        title: "licença Deletado",
        description: "O licença foi deletado com sucesso.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      fetchAllLicences(currentPage);
    } catch (error) {
      console.error("Erro ao deletar licença:", error);
      toast({
        title: "Erro ao deletar licença",
        description: "Ocorreu um erro ao deletar o licença.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (licence: Licence) => {
    router.push(`/dashboard/licence/upsert?id=${licence.id}`);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Container maxW="container.xl" mt="1" p={4}>
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="space-between"
        align="center"
        mb="4"
      >
        <Heading as="h1" size="lg" textShadow="1px 1px #ccc">
          Lista de licenças
        </Heading>
        <Flex>
          <Button
            colorScheme="teal"
            mr="2"
            size="sm"
            leftIcon={<AddIcon />}
            onClick={() => router.push("/dashboard/licence/upsert")}
          >
            Nova licença
          </Button>
          {/* <Button
            size="sm"
            colorScheme="pink"
            leftIcon={<DownloadIcon />}
            onClick={() => console.log("Exportar clicado")}
            disabled
          >
            Exportar
          </Button> */}
        </Flex>
      </Flex>

      <LicenceTable
        licences={licences}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onSearch={handleSearch}
        loading={loading}
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        isConverting={isConverting}
        handleConvert={handleConvert}
      />
    </Container>
  );
};

export default LicencesPage;
