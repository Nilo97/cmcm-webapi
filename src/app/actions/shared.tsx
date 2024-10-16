import { Flex, Text } from "@chakra-ui/react";
import { FaMoneyBillWave, FaMobileAlt, FaMoneyCheckAlt, FaCreditCard, FaRegCreditCard } from "react-icons/fa";
import { FaMoneyBillTransfer } from "react-icons/fa6";

export const paymentOptions = [
  {
    value: "CASH",
    label: "Dinheiro",
    icon: <FaMoneyBillWave color="green" />,
  },
  {
    value: "MPESA",
    label: "M-Pesa",
    icon: <FaMobileAlt color="red" />,
  },
  {
    value: "EMOLA",
    label: "eMola",
    icon: <FaMoneyCheckAlt color="orange" />,
  },
  {
    value: "CARD",
    label: "Cartão",
    icon: <FaCreditCard color="purple" />,
  },
  {
    value: "BANK_TRANSFER",
    label: "Transferência Bancária",
    icon: <FaMoneyBillTransfer color="teal" />,
  },
  {
    value: "MKESH",
    label: "Mkesh",
    icon: <FaRegCreditCard color="yellow" />,
  },
  {
    value: "CHEQUE",
    label: "Cheque",
    icon: <FaRegCreditCard color="gray" />,
  },
];

export const formatOptionLabel = ({
    label,
    icon,
  }: {
    label: string;
    icon: JSX.Element;
  }) => (
    <Flex align="center">
      {icon}
      <Text ml={2}>{label}</Text>
    </Flex>
  );