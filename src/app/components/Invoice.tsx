import React from "react";
import {
  Button,
  Box,
  Stack,
  Text,
  useToast,
  Icon,
  Divider,
  HStack,
  VStack,
} from "@chakra-ui/react";
import {
  MdPictureAsPdf,
  MdPrint,
  MdFileDownload,
  MdEmail,
} from "react-icons/md";

const Invoice = ({ pdfBlob }: { pdfBlob: Blob | null }) => {
  const toast = useToast();

  const handlePrint = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const printWindow = window.open(url, "_blank");
      if (printWindow) {
        printWindow.addEventListener("load", () => {
          printWindow.print();
        });
      }
    } else {
      toast({ title: "Nenhum PDF disponível.", status: "error" });
    }
  };
  const fileName = (): string => {
    const randomText = Math.random().toString(36).substring(2, 10);
    const today = new Date().toISOString().split("T")[0];
    return `Talão_${randomText}_${today}.pdf`;
  };

  const handleDownload = () => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName();
      link.click();
      URL.revokeObjectURL(url);
    } else {
      toast({ title: "Nenhum PDF disponível.", status: "error" });
    }
  };

  const handleEmail = async () => {
    if (pdfBlob) {
      const formData = new FormData();
      formData.append("file", pdfBlob, fileName());
      try {
        const response = await fetch("/api/send-email", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          toast({ title: "Email enviado com sucesso.", status: "success" });
        } else {
          const data = await response.json();
          toast({
            title: data.message || "Erro ao enviar email.",
            status: "error",
          });
        }
      } catch (error) {
        console.error("Erro ao enviar email:", error);
        toast({ title: "Erro ao enviar email.", status: "error" });
      }
    } else {
      toast({ title: "Nenhum PDF disponível.", status: "error" });
    }
  };

  return (
    <Box
      p={{ base: 4, md: 6 }}
      bg="gray.50"
      borderRadius="md"
      boxShadow="md"
      maxW="md"
      mx="auto"
      textAlign="center"
    >
      <Stack spacing={4} mb={6}>
        <Icon
          as={MdPictureAsPdf}
          boxSize={{ base: 8, md: 12 }}
          color="red.500"
        />
        <Text
          fontSize={{ base: "lg", md: "2xl" }}
          fontWeight="bold"
          color="green.800"
        >
          O Talão está pronto!
        </Text>
        <Text color="gray.600">
          Utilize os botões abaixo para imprimir, baixar ou enviar o Talão por
          email.
        </Text>
      </Stack>
      <Divider mb={4} />
      <VStack spacing={4} align="stretch">
        <Button
          colorScheme="teal"
          onClick={handlePrint}
          isDisabled={!pdfBlob}
          variant="solid"
          size={{ base: "sm", md: "md" }}
          leftIcon={<MdPrint />}
          borderRadius="md"
          _hover={{ bg: "teal.600", color: "white" }}
          _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
        >
          Imprimir Talão
        </Button>
        <Button
          colorScheme="purple"
          onClick={handleDownload}
          isDisabled={!pdfBlob}
          variant="solid"
          size={{ base: "sm", md: "md" }}
          leftIcon={<MdFileDownload />}
          borderRadius="md"
          _hover={{ bg: "purple.600", color: "white" }}
          _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
        >
          Baixar Talão
        </Button>
        <Button
          colorScheme="blue"
          onClick={handleEmail}
          isDisabled={!pdfBlob}
          variant="solid"
          size={{ base: "sm", md: "md" }}
          leftIcon={<MdEmail />}
          borderRadius="md"
          _hover={{ bg: "blue.600", color: "white" }}
          _disabled={{ bg: "gray.200", cursor: "not-allowed" }}
        >
          Enviar por Email
        </Button>
      </VStack>
    </Box>
  );
};

export default Invoice;
