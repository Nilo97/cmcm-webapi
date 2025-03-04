import { parseCookies } from "nookies";
import { Licence } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchLicences(
  size: number,
  page: number,
  query?: string
): Promise<{ licences: Licence[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/licences/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/licences/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch licences");
    }

    return { licences: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching licences:", error);
    return { error: error.message || "Failed to fetch licences" };
  }
}

async function getLicenceById(
  id: string | null
): Promise<{ licence: Licence } | { error: string }> {
  try {
    const url = `${BASE_URL}/licences/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch licences");
    }

    return { licence: data };
  } catch (error: any) {
    console.error("Error fetching licences:", error);
    return { error: error.message || "Failed to fetch licences" };
  }
}

async function createLicence(licenceData: any) {
  try {
    const response = await fetch(`${BASE_URL}/licences`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(licenceData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Failed to create licence." };
    }
  } catch (error) {
    console.error("Error creating licence:", error);
    return { error: "Failed to create licence." };
  }
}

async function updateLicence(
  licenceId: string,
  licenceData: any
): Promise<Licence | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/licences/${licenceId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(licenceData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update licence");
    }

    return data;
  } catch (error: any) {
    console.error("Error updating licence:", error);
    return { error: error.message || "Failed to update licence" };
  }
}

async function deleteLicence(
  licenceId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/licences/${licenceId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to delete licence");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting licence:", error);
    return { error: error.message || "Failed to delete licence" };
  }
}

async function downloadLicence(id: string): Promise<Blob | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/licences/download/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to download licence");
    }

    return await response.blob();
  } catch (error: any) {
    console.error("Error downloading licence:", error);
    return { error: error.message || "Failed to download licence" };
  }
}
async function convertToBook(
  id: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/licences/${id}/convert`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to convert licence");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error converting licence:", error);
    return { error: error.message || "Failed to convert licence" };
  }
}

async function fetchlicenceByCustomer(
  customerId: string
): Promise<{ licence: Licence[] } | { error: string }> {
  try {
    const url = `${BASE_URL}/licences/customer/${customerId}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch licence");
    }

    return { licence: data }; // Retorna a lista de livros diretamente
  } catch (error: any) {
    console.error("Error fetching licence by customer:", error);
    return { error: error.message || "Failed to fetch licence" };
  }
}

export {
  downloadLicence,
  fetchLicences,
  createLicence,
  updateLicence,
  deleteLicence,
  getLicenceById,
  fetchlicenceByCustomer,
  convertToBook,
};
