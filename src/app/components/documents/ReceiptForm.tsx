import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
} from "@chakra-ui/react";
import { UseFormHandleSubmit, UseFormRegister } from "react-hook-form";

interface ReceiptFormProps {
  register: UseFormRegister<any>;
  handleSubmit: UseFormHandleSubmit<any>;
  onSubmit: (data: any) => void;
}

export const ReceiptForm: React.FC<ReceiptFormProps> = ({
  register,
  handleSubmit,
  onSubmit,
}) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <VStack spacing={4} align="flex-start">
        <FormControl id="amount">
          <FormLabel>Amount</FormLabel>
          <Input type="number" {...register("amount", { required: true })} />
        </FormControl>
        <FormControl id="date">
          <FormLabel>Date</FormLabel>
          <Input type="date" {...register("date", { required: true })} />
        </FormControl>
        <Button type="submit" colorScheme="teal">
          Submit
        </Button>
      </VStack>
    </form>
  );
};
