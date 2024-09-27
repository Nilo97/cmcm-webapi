"use client";

import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton,
  Text,
  Select,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { formatCurrency } from "../actions/util";
import { CartItem } from "../types";

type CartTableProps = {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onChangeQuantity: (id: string, newQuantity: number) => void;
  onChangeTax: (id: string, newTax: string) => void;
};

const taxOptions = [
  { value: "16%", label: "IVA (16%)" },
  { value: "exempt", label: "Isento" },
  { value: "included", label: "Incluso" },
];

const CartTable: React.FC<CartTableProps> = ({
  cartItems,
  onRemoveItem,
  onChangeQuantity,
  onChangeTax,
}) => {
  return cartItems.length === 0 ? (
    <Text fontSize="sm">Seu carrinho está vazio.</Text>
  ) : (
    <Table variant="simple" size="xs">
      <Thead>
        <Tr>
          <Th p={1} fontSize="xs">
            Produto
          </Th>
          <Th p={1} fontSize="xs">
            Preço
          </Th>
          <Th p={1} fontSize="xs">
            Quantidade
          </Th>
          <Th p={1} fontSize="xs">
            Imposto
          </Th>
          <Th p={1} fontSize="xs">
            Remover
          </Th>
        </Tr>
      </Thead>
      <Tbody>
        {cartItems.map((item: CartItem) => (
          <Tr key={item.productId}>
            <Td p={1} fontSize="xs">
              {item.name}
            </Td>
            <Td p={1} fontSize="xs">
              {formatCurrency(item.price)}
            </Td>
            <Td p={1} fontSize="xs">
              <NumberInput
                size="xs"
                min={1}
                value={item.quantity}
                onChange={(valueString) =>
                  onChangeQuantity(item.productId, Number(valueString))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </Td>
            <Td p={1} fontSize="xs">
              <Select
                size="xs"
                placeholder="Selecione imposto"
                onChange={(e) => onChangeTax(item.productId, e.target.value)}
                defaultValue="included"
              >
                {taxOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Td>
            <Td p={1} fontSize="xs">
              <IconButton
                size="xs"
                icon={<DeleteIcon />}
                aria-label="Remover item"
                onClick={() => onRemoveItem(item.productId)}
                colorScheme="red"
              />
            </Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};

export default CartTable;
