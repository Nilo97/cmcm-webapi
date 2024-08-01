import { parseCookies } from "nookies";
import { Company } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function getCompanyById(
  id: string
): Promise<{ company: Company } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/companies/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar empresa");
    }

    return { company: data };
  } catch (error: any) {
    console.error("Erro ao buscar empresa:", error);
    return { error: error.message || "Falha ao buscar empresa" };
  }
}

export { getCompanyById };
