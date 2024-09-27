import React from "react";
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";

export const CreditNoteForm: React.FC = () => {
  const { register } = useFormContext();

  return (
    <VStack spacing={4} align="flex-start">
      <FormControl id="reason">
        <FormLabel>Reason for Credit</FormLabel>
        <Textarea {...register("reason", { required: true })} />
      </FormControl>
      <FormControl id="creditAmount">
        <FormLabel>Credit Amount</FormLabel>
        <Input
          type="number"
          {...register("creditAmount", { required: true })}
        />
      </FormControl>
    </VStack>
  );
};
