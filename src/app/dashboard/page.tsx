"use client";
import { useEffect, useState } from "react";
import {
  Box,
  Heading,
  SimpleGrid,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Flex,
  Select,
} from "@chakra-ui/react";
import { FaArrowUp, FaArrowDown, FaListOl } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FaBasketShopping, FaPeopleCarryBox } from "react-icons/fa6";
import {
  fetchYearMonthStats,
  fetchStats,
  findTop5ProductsWithMinQuantity,
} from "../actions/stats";
import { GeneralStats, Product, StatsResponse } from "../actions/types";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0"];

const Dashboard = () => {
  const [stats, setStats] = useState<GeneralStats | null>(null);
  const [lowStockData, setLowStockData] = useState<Product[]>([]);
  const [yearMonthStats, setYearMonthStats] = useState<StatsResponse | null>(
    null
  );
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [years, setYears] = useState<number[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsData = await fetchStats();
        if ("error" in statsData) {
          setError(statsData.error);
          return;
        }
        setStats(statsData);

        const lowStockData = await findTop5ProductsWithMinQuantity();
        if ("error" in lowStockData) {
          setError(lowStockData.error);
          return;
        }
        setLowStockData(lowStockData);

        const yearMonthData = await fetchYearMonthStats();
        if ("error" in yearMonthData) {
          setError(yearMonthData.error);
          return;
        }
        setYearMonthStats(yearMonthData);

        const allYears = new Set<number>();
        yearMonthData.entries.forEach((entry) => allYears.add(entry.year));
        yearMonthData.sales.forEach((sale) => allYears.add(sale.year));
        const sortedYears = Array.from(allYears).sort((a, b) => b - a);
        setYears(sortedYears);

        const currentYear = new Date().getFullYear();
        setSelectedYear(
          sortedYears.includes(currentYear) ? currentYear : sortedYears[0]
        );
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const dataEntriesExits = yearMonthStats
    ? yearMonthStats.entries
        .filter((entry: any) => entry.year === selectedYear)
        .map((entry: any) => ({
          month: new Date(entry.year, entry.month - 1).toLocaleString(
            "default",
            {
              month: "long",
            }
          ),
          entries: entry.count,
          exits:
            yearMonthStats.sales.find(
              (s: any) => s.year === entry.year && s.month === entry.month
            )?.count || 0,
        }))
    : [];

  const chartData = lowStockData.map((item, index) => ({
    name: item.name,
    quantity: item.quantity,
    fill: colors[index % colors.length],
  }));

  if (loading) {
    return (
      <Flex align="center" justify="center" bg="gray.50" p="10" height="100vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Alert status="error" mb="6">
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Flex align="center" mb="4">
            <FaBasketShopping style={{ marginRight: "8px" }} />
            <Heading as="h3" size="md">
              Produtos
            </Heading>
          </Flex>
          <Text>Total de Produtos: {stats?.products ?? "N/A"}</Text>
        </Box>
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Flex align="center" mb="4">
            <FaListOl style={{ marginRight: "8px" }} />
            <Heading as="h3" size="md">
              Categorias
            </Heading>
          </Flex>
          <Text>Total de Categorias: {stats?.categories ?? "N/A"}</Text>
        </Box>
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Flex align="center" mb="4">
            <FaPeopleCarryBox style={{ marginRight: "8px" }} />
            <Heading as="h3" size="md">
              Funcionários
            </Heading>
          </Flex>
          <Text>Total de Fornecedores: {stats?.customers ?? "N/A"}</Text>
        </Box>
      </SimpleGrid>

      <Flex direction="column" gap="6" mt="6">
        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Heading as="h3" size="md" mb="4">
            Inventário
          </Heading>
          <Flex align="center" mb="4" gap="4">
            <Flex align="center" gap="2">
              <FaArrowUp color="#38A169" />
              <Text>Entradas</Text>
            </Flex>
            <Flex align="center" gap="2">
              <FaArrowDown color="#F56565" />
              <Text>Saídas</Text>
            </Flex>
          </Flex>
          <Select
            placeholder="Selecione o ano"
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            mb="4"
            value={selectedYear ?? ""}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </Select>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataEntriesExits}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="entries" fill="#38A169" barSize={40} />
              <Bar dataKey="exits" fill="#F56565" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box p="6" bg="white" shadow="sm" borderRadius="md">
          <Heading as="h3" size="md" mb="4">
            Produtos com Menos Quantidades (5)
          </Heading>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantity" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Flex>
    </>
  );
};

export default Dashboard;
