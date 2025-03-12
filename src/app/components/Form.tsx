import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  SimpleGrid,
  GridItem,
  Flex,
  Button,
  Textarea,
  InputGroup,
  InputRightElement,
  Select,
} from "@chakra-ui/react";
import {
  Controller,
  UseFormRegister,
  Control,
  FieldErrors,
} from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactSelect from "react-select";

interface FormProps {
  register: UseFormRegister<any>;
  handleSubmit: (
    callback: (data: any) => void
  ) => (e?: React.BaseSyntheticEvent) => void;
  onSubmit: (data: any) => void;
  errors: any;
  control: Control<any>;
  brands: { id: string; description: string }[];
  motoTypes: { id: string; description: string }[];
  clientOptions: { value: string; label: string }[];
  setQuery: (value: string) => void;
  fetchClients: (query: string) => void;
  setValue: (field: string, value: any) => void;
  isSubmitting: boolean;
  bookId: string | null;
}

const Form: React.FC<FormProps> = ({
  register,
  handleSubmit,
  onSubmit,
  errors,
  control,
  brands,
  motoTypes,
  clientOptions,
  setQuery,
  fetchClients,
  setValue,
  isSubmitting,
  bookId,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacingX={4} spacingY={2}>
        <GridItem>
          <FormControl isInvalid={!!errors.registrationNumber}>
            <FormLabel>Matricula</FormLabel>
            <Input
              disabled
              placeholder="Gerada Automaticamente"
              {...register("registrationNumber", {})}
            />
            <FormErrorMessage>
              {errors.registrationNumber?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.brandId}>
            <FormLabel>Marca</FormLabel>
            <Select {...register("brandId", { required: "Campo obrigatório" })}>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.description}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.brandId?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.model}>
            <FormLabel>Modelo</FormLabel>
            <Input
              placeholder="Digite o modelo"
              {...register("model", { required: "Campo obrigatório" })}
            />
            <FormErrorMessage>{errors.model?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.manufactureYear}>
            <FormLabel>Ano de Fabricação</FormLabel>
            <Controller
              name="manufactureYear"
              control={control}
              render={({ field }) => (
                <DatePicker
                  {...field}
                  selected={field.value ? new Date(field.value, 0, 1) : null} // Pass just the year as a Date object
                  onChange={(date) => {
                    if (date) {
                      setValue("manufactureYear", date.getFullYear()); // Only store the year
                    }
                  }}
                  showYearPicker
                  dateFormat="yyyy"
                  customInput={<Input placeholder="Selecione o ano" />}
                />
              )}
            />
            <FormErrorMessage>
              {errors.manufactureYear?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>
        <GridItem>
          <FormControl isInvalid={!!errors.bicycleTypeId}>
            <FormLabel>Tipo de Velocípede</FormLabel>
            <Select
              {...register("bicycleTypeId", { required: "Campo obrigatório" })}
            >
              {motoTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.description}
                </option>
              ))}
            </Select>
            <FormErrorMessage>{errors.bicycleTypeId?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.customerId}>
            <FormLabel>Proprietário</FormLabel>
            <Controller
              name="customerId"
              control={control}
              rules={{ required: "Proprietário é obrigatório." }}
              render={({ field }) => (
                <ReactSelect
                  {...field}
                  placeholder="Pesquise e selecione o Proprietário"
                  options={clientOptions}
                  isSearchable
                  onInputChange={(inputValue) => {
                    setQuery(inputValue);
                    fetchClients(inputValue);
                  }}
                />
              )}
            />
            <FormErrorMessage>{errors.customerId?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.engineNumber}>
            <FormLabel>Número do Motor</FormLabel>
            <Input
              type="number"
              placeholder="Digite o número do motor"
              {...register("engineNumber", { required: "Campo obrigatório" })}
            />
            <FormErrorMessage>{errors.engineNumber?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.engineCapacity}>
            <FormLabel>Cilindrada</FormLabel>
            <InputGroup>
              <Input
                type="number"
                placeholder="Digite a cilindrada"
                {...register("engineCapacity", {
                  required: "Campo obrigatório",
                })}
              />
              <InputRightElement>m³</InputRightElement>
            </InputGroup>
            <FormErrorMessage>
              {errors.engineCapacity?.message}
            </FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.frameNumber}>
            <FormLabel>Número do Quadro</FormLabel>
            <Input
              type="number"
              placeholder="Digite o número do quadro"
              {...register("frameNumber", { required: "Campo obrigatório" })}
            />
            <FormErrorMessage>{errors.frameNumber?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.color}>
            <FormLabel>Cor</FormLabel>
            <Input
              placeholder="Digite a cor"
              {...register("color", { required: "Campo obrigatório" })}
            />
            <FormErrorMessage>{errors.color?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.circulation}>
            <FormLabel>Circulação</FormLabel>
            <Input
              placeholder="Digite o local de circulação"
              {...register("circulation")}
            />
          </FormControl>
        </GridItem>

        <GridItem>
          <FormControl isInvalid={!!errors.invoice}>
            <FormLabel>Fatura</FormLabel>
            <Input
              placeholder="Digite o número da fatura"
              {...register("invoice", { required: "Campo obrigatório" })}
            />
            <FormErrorMessage>{errors.invoice?.message}</FormErrorMessage>
          </FormControl>
        </GridItem>

        <GridItem colSpan={{ base: 1, md: 3 }}>
          <FormControl isInvalid={!!errors.observations}>
            <FormLabel>Observações</FormLabel>
            <Textarea
              placeholder="Adicione observações (opcional)"
              {...register("observations")}
            />
          </FormControl>
        </GridItem>
      </SimpleGrid>

      <Flex justify="center" mt={6}>
        <Button
          type="submit"
          colorScheme="teal"
          isLoading={isSubmitting}
          size="lg"
          px={8}
        >
          {bookId ? "Atualizar" : "Registrar"}
        </Button>
      </Flex>
    </form>
  );
};

export default Form;
