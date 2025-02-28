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
} from "@chakra-ui/react";
import { DownloadIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { limitText } from "../actions/util";
import { Licence } from "../actions/types";
import CustomerDetailsModal from "./CustomerDetails";
import { downloadLicence } from "../actions/licence";

interface LicenceTableProps {
  licences: Licence[];
  onDelete: (licenceId: string) => void;
  onEdit: (licence: Licence) => void;
  onSearch: (value: string) => void;
  loading: boolean;
  totalPages?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
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
  const [isDownloading, setIsDownloading] = useState(false);

  const handleViewDetails = (licence: Licence) => {
    setSelectedLicence(licence);
    setIsModalOpen(true);
  };

  const handleDownload = async (licence: Licence) => {
    if (!licence) return;
    setIsDownloading(true);
    const result = await downloadLicence(licence.id);

    if ("error" in result) {
      console.error("Download failed:", result.error);
    } else {
      const url = window.URL.createObjectURL(
        new Blob([result], { type: "application/zip" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${licence.licenceNumber}.zip`); // Changed to .zip
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    }

    setIsDownloading(false);
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
                <Th>Proprietário</Th>
                <Th>Observações</Th>
                <Th>Ações</Th>
              </Tr>
            </Thead>
            <Tbody>
              {licences.map((licence) => (
                <Tr key={licence.id}>
                  <Highlight
                    query={query || ""}
                    styles={{ px: "1", py: "1", bg: "orange.100" }}
                  >
                    {limitText(licence.licenceNumber, 20)}
                  </Highlight>
                  <Td>{licence.customerName}</Td>
                  <Td>{limitText(licence.obs, 20)}</Td>

                  <Td>
                    <Button
                      size="xs"
                      leftIcon={<DownloadIcon />}
                      onClick={() => handleDownload(licence)}
                      disabled={isDownloading}
                    >
                      Baixar
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      )}
    </Stack>
  );
};

export default LicenceTable;
