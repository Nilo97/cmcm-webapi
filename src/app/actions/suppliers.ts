import { parseCookies } from "nookies";
import { customer } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchcustomers() {
  try {
    const response = await fetch(`${BASE_URL}/customers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar Proprietárioes");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Erro ao buscar Proprietárioes:", error);
    return { error: error.message };
  }
}

async function fetchPaginatedcustomers(
  size: number,
  page: number,
  query?: string
): Promise<{ customers: customer[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/customers/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/customers/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar Proprietárioes");
    }

    return { customers: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Erro ao buscar Proprietárioes:", error);
    return { error: error.message || "Falha ao buscar Proprietárioes" };
  }
}

async function getcustomerById(
  id: string
): Promise<{ customer: customer } | { error: string }> {
  try {
    const url = `${BASE_URL}/customers/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar Proprietário");
    }

    return { customer: data };
  } catch (error: any) {
    console.error("Erro ao buscar Proprietário:", error);
    return { error: error.message || "Falha ao buscar Proprietário" };
  }
}

async function createcustomer(customerData: any) {
  try {
    const response = await fetch(`${BASE_URL}/customers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Falha ao criar Proprietário." };
    }
  } catch (error) {
    console.error("Erro ao criar Proprietário:", error);
    return { error: "Falha ao criar Proprietário." };
  }
}

async function updatecustomer(
  customerId: string,
  customerData: any
): Promise<customer | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao atualizar Proprietário");
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao atualizar Proprietário:", error);
    return { error: error.message || "Falha ao atualizar Proprietário" };
  }
}

async function deletecustomer(
  customerId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao deletar Proprietário");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao deletar Proprietário:", error);
    return { error: error.message || "Falha ao deletar Proprietário" };
  }
}

async function uploadcustomers(
  file: File
): Promise<{ success: boolean } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/customers/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao enviar Proprietárioes");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar Proprietárioes:", error);
    return { error: error.message || "Falha ao enviar Proprietárioes" };
  }
}

export {
  fetchPaginatedcustomers,
  fetchcustomers,
  createcustomer,
  updatecustomer,
  deletecustomer,
  uploadcustomers,
  getcustomerById,
};
