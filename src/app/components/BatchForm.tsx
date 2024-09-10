import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Select,
  Button,
  Text,
  ModalBody,
  ModalFooter,
  useToast,
  VStack,
  IconButton,
  HStack,
  Box,
} from "@chakra-ui/react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { fetchSuppliers } from "../actions/suppliers";

interface RegisterBatchFormProps {
  onSubmit: (data: any) => void;
  onClose: () => void;
}

const RegisterBatchForm: React.FC<RegisterBatchFormProps> = ({
  onSubmit,
  onClose,
}) => {
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {
      batchList: [
        {
          supplierId: "",
          entryDate: "",
          expirationDate: "",
          quantity: "",
          price: "",
          associatedCosts: "", // Novo campo
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "batchList",
  });

  useEffect(() => {
    const fetchSuppliersData = async () => {
      try {
        const suppliersResult = await fetchSuppliers();
        if ("error" in suppliersResult) {
          throw new Error(suppliersResult.error);
        } else {
          setSuppliers(suppliersResult);
        }
      } catch (error: any) {
        setError(error.message);
        toast({
          title: "Erro ao buscar fornecedores",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchSuppliersData();
  }, [toast]);

  return (
    <>
      {error && <Text color="red.500">Erro: {error}</Text>}
      <ModalBody p={0} h="full" maxH="full">
        <Box w="full" h="full" p={4} overflowY="auto">
          <form onSubmit={handleSubmit(onSubmit)}>
            <VStack spacing={4} align="stretch" mb="4">
              {fields.map((item, index) => (
                <Box
                  key={item.id}
                  p={4}
                  borderWidth="1px"
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <HStack spacing={4} align="start">
                    <FormControl>
                      <FormLabel>Fornecedor</FormLabel>
                      <Controller
                        name={`batchList.${index}.supplierId`}
                        control={control}
                        render={({ field }) => (
                          <Select
                            {...field}
                            placeholder="Selecione um fornecedor"
                          >
                            {suppliers.map((supplier) => (
                              <option key={supplier.id} value={supplier.id}>
                                {supplier.name}
                              </option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.batchList?.[index]?.supplierId && (
                        <Text color="red.500">
                          {errors.batchList[index].supplierId.message}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Data de Entrada</FormLabel>
                      <Input
                        type="date"
                        {...register(`batchList.${index}.entryDate`, {
                          required: "Data de entrada é obrigatória",
                        })}
                      />
                      {errors.batchList?.[index]?.entryDate && (
                        <Text color="red.500">
                          {errors.batchList[index].entryDate.message}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Data de Validade</FormLabel>
                      <Input
                        type="date"
                        {...register(`batchList.${index}.expirationDate`)}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Quantidade</FormLabel>
                      <Input
                        placeholder="20"
                        type="number"
                        step="0.01"
                        {...register(`batchList.${index}.quantity`, {
                          required: "Quantidade é obrigatória",
                        })}
                      />
                      {errors.batchList?.[index]?.quantity && (
                        <Text color="red.500">
                          {errors.batchList[index].quantity.message}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Preço de Compra</FormLabel>
                      <Input
                        type="number"
                        placeholder="150.2"
                        step="0.01"
                        {...register(`batchList.${index}.price`, {
                          required: "Preço é obrigatório",
                        })}
                      />
                      {errors.batchList?.[index]?.price && (
                        <Text color="red.500">
                          {errors.batchList[index].price.message}
                        </Text>
                      )}
                    </FormControl>
                    <FormControl>
                      <FormLabel>Custo de Logística</FormLabel>
                      <Input
                        type="number"
                        placeholder="50.0"
                        step="0.01"
                        {...register(`batchList.${index}.associatedCosts`, {
                          required: "Custo de Logística é obrigatório",
                        })}
                      />
                      {errors.batchList?.[index]?.associatedCosts && (
                        <Text color="red.500">
                          {errors.batchList[index].associatedCosts.message}
                        </Text>
                      )}
                    </FormControl>

                    <Box mt="9">
                      <IconButton
                        aria-label="Remove batch"
                        icon={<AiOutlineMinus />}
                        onClick={() => remove(index)}
                        colorScheme="red"
                        alignSelf="center"
                        size="sm"
                        color="white"
                      />
                    </Box>
                  </HStack>
                </Box>
              ))}
            </VStack>

            <Button
              mt="1"
              onClick={() =>
                append({
                  supplierId: "",
                  entryDate: "",
                  expirationDate: "",
                  quantity: "",
                  price: "",
                  associatedCosts: "",
                })
              }
              colorScheme="green"
              size="sm"
              leftIcon={<AiOutlinePlus />}
            >
              Adicionar Lote
            </Button>

            <ModalFooter mt="4">
              <Button onClick={onClose} mr="4">
                Cancelar
              </Button>
              <Button colorScheme="blue" type="submit">
                Salvar
              </Button>
            </ModalFooter>
          </form>
        </Box>
      </ModalBody>
    </>
  );
};

export default RegisterBatchForm;
