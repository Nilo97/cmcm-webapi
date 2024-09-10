import { Box, Table, Thead, Tbody, Tr, Th, Td, Text } from "@chakra-ui/react";

export const HistoryTab = () => {
  // Dados fictícios de histórico. Normalmente, estes dados viriam de uma API ou serviço.
  const historyData = [
    {
      id: 1,
      date: "2024-09-01",
      openingTime: "08:00",
      closingTime: "18:00",
      totalSales: 500.0,
      user: "João Silva",
    },
    {
      id: 2,
      date: "2024-09-02",
      openingTime: "08:00",
      closingTime: "18:00",
      totalSales: 700.0,
      user: "Maria Sousa",
    },
  ];

  return (
    <Box>
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>Dia</Th>
            <Th>Hora de Abertura</Th>
            <Th>Hora de Fechamento</Th>
            <Th>Total Vendido</Th>
            <Th>Utilizador</Th>
          </Tr>
        </Thead>
        <Tbody>
          {historyData.map((record) => (
            <Tr key={record.id}>
              <Td>{record.date}</Td>
              <Td>{record.openingTime}</Td>
              <Td>{record.closingTime}</Td>
              <Td>{record.totalSales.toFixed(2)} MZN</Td>
              <Td>{record.user}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};
