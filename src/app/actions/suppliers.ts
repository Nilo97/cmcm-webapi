import { parseCookies } from "nookies";
import { customer } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchcustomers() {
  try {
    const response = await fetch(`${BASE_URL}/api/customers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar Utentees");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Erro ao buscar Utentees:", error);
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
      throw new Error(data?.message || "Falha ao buscar Utentees");
    }

    return { customers: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Erro ao buscar Utentees:", error);
    return { error: error.message || "Falha ao buscar Utentees" };
  }
}

async function getcustomerById(
  id: string
): Promise<{ customer: customer } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/customers/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar Utente");
    }

    return { customer: data };
  } catch (error: any) {
    console.error("Erro ao buscar Utente:", error);
    return { error: error.message || "Falha ao buscar Utente" };
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
      return { error: data?.message || "Falha ao criar Utente." };
    }
  } catch (error) {
    console.error("Erro ao criar Utente:", error);
    return { error: "Falha ao criar Utente." };
  }
}

async function updatecustomer(
  customerId: string,
  customerData: any
): Promise<customer | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/customers/${customerId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(customerData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao atualizar Utente");
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao atualizar Utente:", error);
    return { error: error.message || "Falha ao atualizar Utente" };
  }
}

async function deletecustomer(
  customerId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/customers/${customerId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao deletar Utente");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao deletar Utente:", error);
    return { error: error.message || "Falha ao deletar Utente" };
  }
}

async function uploadcustomers(
  file: File
): Promise<{ success: boolean } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/customers/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao enviar Utentees");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar Utentees:", error);
    return { error: error.message || "Falha ao enviar Utentees" };
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
