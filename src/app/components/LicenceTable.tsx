"use client";

import React, { useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  Stack,
  TableContainer,
  TableCaption,
  Flex,
  InputGroup,
  InputLeftElement,
  Spinner,
  Highlight,
  useToast,
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { limitText } from "../actions/util";
import { Licence } from "../actions/types";
import CustomerDetailsModal from "./CustomerDetails";
import { convertToBook, downloadLicence } from "../actions/licence";
import LicenceDetailsModal from "./LicenceDetails";

interface LicenceTableProps {
  licences: Licence[];
  onDelete: (licenceId: string) => void;
  onEdit: (licence: Licence) => void;
  onSearch: (value: string) => void;
  loading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  isConverting: boolean;
  handleConvert: (licence: Licence) => void;
}

const LicenceTable: React.FC<LicenceTableProps> = ({
  licences,
  onDelete,
  onEdit,
  onSearch,
  loading,
  totalPages = 0,
  currentPage = 0,
  onPageChange,
  handleConvert,
  isConverting,
}) => {
  const [selectedLicence, setSelectedLicence] = useState<Licence | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] =
    useState<boolean>(false);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const [licenceIdToDelete, setLicenceIdToDelete] = useState<string | null>(
    null
  );

  const handleViewDetails = (licence: Licence) => {
    setSelectedLicence(licence);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedLicence(null);
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (licenceIdToDelete !== null) {
      onDelete(licenceIdToDelete);
      setLicenceIdToDelete(null);
      setDeleteConfirmationOpen(false);
    }
  };

  return (
    <Stack spacing="4">
      <Flex align="center" justify="center">
        <InputGroup size={{ base: "sm", md: "md" }} maxW="md">
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Pesquisar licença..."
            onChange={(e) => {
              setQuery(e.target.value);
              onSearch(e.target.value);
            }}
            variant="filled"
          />
        </InputGroup>
      </Flex>
      {loading ? (
        <Flex justify="center" align="center" minH="200px">
          <Spinner size="xl" />
        </Flex>
      ) : (
        <TableContainer>
          <Table variant="simple" fontSize={{ base: "xs", md: "sm" }} size="sm">
            <TableCaption>Provided by Prifuturo Consultoria</TableCaption>
            <Thead>
              <Tr>
                <Th>Nº de licença</Th>
                <Th>Nº de Matricula</Th>
                <Th>Marca</Th>
                <Th>Modelo</Th>
                <Th>Tipo</Th>
                <Th>Nº Motor</Th>
                <Th>Proprietário</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {licences.map((licence) => (
                <Tr key={licence.id}>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(licence.licenceNumber, 20)}
                    </Highlight>
                  </Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(licence.registrationNumber, 20)}
                    </Highlight>
                  </Td>
                  <Td>{licence.brand}</Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(licence.model, 20)}
                    </Highlight>
                  </Td>
                  <Td>{licence.bicycleType}</Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(licence.engineNumber, 20)}
                    </Highlight>
                  </Td>
                  <Td>
                    <Highlight
                      query={query || ""}
                      styles={{ px: "1", py: "1", bg: "orange.100" }}
                    >
                      {limitText(licence.customerName, 20)}
                    </Highlight>
                  </Td>

                  <Td>
                    <Button
                      size="xs"
                      leftIcon={<ViewIcon />}
                      onClick={() => handleViewDetails(licence)}
                    >
                      Ver mais detalhes
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
      <LicenceDetailsModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        licence={selectedLicence}
        isConverting={isConverting}
        handleConvert={handleConvert}
      />
    </Stack>
  );
};

export default LicenceTable;
