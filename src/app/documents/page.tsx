import React, { useState } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Flex,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  useForm,
  FormProvider,
  RegisterOptions,
  SubmitErrorHandler,
  SubmitHandler,
  UseFormRegisterReturn,
} from "react-hook-form";
import { ReceiptForm } from "../components/documents/ReceiptForm";
import { CreditNoteForm } from "../components/documents/CreditNoteForm";

const Document = () => {
  const methods = useForm();
  const [documentType, setDocumentType] = useState<DocumentType | "">("");

  const onSubmit = (data: any) => {
    console.log("Dados do Formulário: ", data);
  };

  const tabBgColor = useColorModeValue("gray.100", "gray.700");
  const tabSelectedColor = useColorModeValue("teal.500", "teal.200");
  const panelBgColor = useColorModeValue("white", "gray.800");

  return (
    <FormProvider {...methods}>
      <Box p={6} bg={panelBgColor} borderRadius="md" shadow="md">
        <Flex justify="center" mb={6}>
          <Heading as="h1" fontSize="2xl" color={tabSelectedColor}>
            Emissão de Documentos
          </Heading>
        </Flex>

        <Tabs
          variant="soft-rounded"
          onChange={(index) =>
            setDocumentType(Object.values(DocumentType)[index])
          }
        >
          <TabList justifyContent="center" mb={4}>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Recibo
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Factura
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Cotação
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Nota de Crédito
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Nota de Débito
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Guia de Remessa
            </Tab>
            <Tab
              bg={tabBgColor}
              _selected={{ color: "white", bg: tabSelectedColor }}
            >
              Guia de Transporte
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <ReceiptForm
                  register={function <TFieldName extends string = string>(
                    name: TFieldName,
                    options?: RegisterOptions<any, TFieldName> | undefined
                  ): UseFormRegisterReturn<TFieldName> {
                    throw new Error("Function not implemented.");
                  }}
                  handleSubmit={function (
                    onValid: SubmitHandler<any>,
                    onInvalid?: SubmitErrorHandler<any> | undefined
                  ): (e?: React.BaseSyntheticEvent) => Promise<void> {
                    throw new Error("Function not implemented.");
                  }}
                  onSubmit={function (data: any): void {
                    throw new Error("Function not implemented.");
                  }}
                />
                <button type="submit">Submit</button>
              </form>
            </TabPanel>
            <TabPanel>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <CreditNoteForm />
                <button type="submit">Submit</button>
              </form>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </FormProvider>
  );
};

export default Document;
