import { parseCookies } from "nookies";
import { Supplier } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchSuppliers() {
  try {
    const response = await fetch(`${BASE_URL}/api/suppliers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Falha ao buscar fornecedores");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Erro ao buscar fornecedores:", error);
    return { error: error.message };
  }
}

async function fetchPaginatedSuppliers(
  size: number,
  page: number,
  query?: string
): Promise<{ suppliers: Supplier[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/api/suppliers/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/api/suppliers/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar fornecedores");
    }

    return { suppliers: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Erro ao buscar fornecedores:", error);
    return { error: error.message || "Falha ao buscar fornecedores" };
  }
}

async function getSupplierById(
  id: string
): Promise<{ supplier: Supplier } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/suppliers/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao buscar fornecedor");
    }

    return { supplier: data };
  } catch (error: any) {
    console.error("Erro ao buscar fornecedor:", error);
    return { error: error.message || "Falha ao buscar fornecedor" };
  }
}

async function createSupplier(supplierData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/suppliers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Falha ao criar fornecedor." };
    }
  } catch (error) {
    console.error("Erro ao criar fornecedor:", error);
    return { error: "Falha ao criar fornecedor." };
  }
}

async function updateSupplier(
  supplierId: string,
  supplierData: any
): Promise<Supplier | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/suppliers/${supplierId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(supplierData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Falha ao atualizar fornecedor");
    }

    return data;
  } catch (error: any) {
    console.error("Erro ao atualizar fornecedor:", error);
    return { error: error.message || "Falha ao atualizar fornecedor" };
  }
}

async function deleteSupplier(
  supplierId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/suppliers/${supplierId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao deletar fornecedor");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao deletar fornecedor:", error);
    return { error: error.message || "Falha ao deletar fornecedor" };
  }
}

async function uploadSuppliers(
  file: File
): Promise<{ success: boolean } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/suppliers/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Falha ao enviar fornecedores");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Erro ao enviar fornecedores:", error);
    return { error: error.message || "Falha ao enviar fornecedores" };
  }
}

export {
  fetchPaginatedSuppliers,
  fetchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  uploadSuppliers,
  getSupplierById,
};
