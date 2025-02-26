import { parseCookies } from "nookies";
import { BrandResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchPaginatedMotoTypes(
  size?: number,
  page?: number,
  query?: string
): Promise<
  { motoTypes: BrandResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = query
      ? `${BASE_URL}/motoTypes/search?query=${query}&page=${page}&size=${size}`
      : `${BASE_URL}/motoTypes/paginated?page=${page}&size=${size}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch reservations");
    }

    const data = await response.json();
    return { motoTypes: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    return { error: error.message || "Failed to fetch reservations" };
  }
}

/**
 * Sends a GET request to the specified endpoint.
 * @returns The response data or an error message.
 */
async function getMotoTypes() {
  try {
    const response = await fetch(`${BASE_URL}/bicycle-types/all`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch motoTypes");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching motoTypes:", error);
    return { error: error.message };
  }
}

/**
 * Sends a POST request with the specified data to the endpoint.
 * @param data - The data to be sent in the request body.
 * @returns The response data or an error message.
 */
async function createMotoType<T, U>(data: T): Promise<U | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/bicycle-types`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to post data");
    }

    return (await response.json()) as U;
  } catch (error: any) {
    console.error(`Error posting motoTypes:`, error);
    return { error: error.message || "Failed to post data" };
  }
}

export { getMotoTypes, createMotoType, fetchPaginatedMotoTypes };
