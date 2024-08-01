import { parseCookies } from "nookies";
import { GeneralStats, Product, StatsResponse } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchStats(): Promise<GeneralStats | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/stats/general`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar Estatísticas");
    }

    const data: GeneralStats = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return { error: error.message };
  }
}

async function findTop5ProductsWithMinQuantity(): Promise<
  Product[] | { error: string }
> {
  try {
    const response = await fetch(`${BASE_URL}/api/stats/top-min-qtd`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar Estatísticas");
    }

    const data: Product[] = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching stas:", error);
    return { error: error.message || "Failed to fetch stas" };
  }
}

async function fetchYearMonthStats(): Promise<
  StatsResponse | { error: string }
> {
  try {
    const response = await fetch(`${BASE_URL}/api/stats/movements`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao carregar Estatísticas");
    }

    const data: StatsResponse = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching stats:", error);
    return { error: error.message || "Erro ao carregar Estatísticas" };
  }
}

export { fetchStats, findTop5ProductsWithMinQuantity, fetchYearMonthStats };
