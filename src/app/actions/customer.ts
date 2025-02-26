import { parseCookies } from "nookies";
import { CustomerResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchPaginatedCustomers(
  size?: number,
  page?: number,
  query?: string
): Promise<
  { customers: CustomerResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = query
      ? `${BASE_URL}/customers/search?query=${query}&page=${page}&size=${size}`
      : `${BASE_URL}/customers/paginated?page=${page}&size=${size}`;

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
    return { customers: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching reservations:", error);
    return { error: error.message || "Failed to fetch reservations" };
  }
}

/**
 * Sends a GET request to the specified endpoint.
 * @returns The response data or an error message.
 */
async function getCustomers() {
  try {
    const response = await fetch(`${BASE_URL}/customers`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch customers");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching customers:", error);
    return { error: error.message };
  }
}

/**
 * Sends a POST request with the specified data to the endpoint.
 * @param data - The data to be sent in the request body.
 * @returns The response data or an error message.
 */
async function createClient<T, U>(data: T): Promise<U | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/customers`, {
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
    console.error(`Error posting customers:`, error);
    return { error: error.message || "Failed to post data" };
  }
}

export { getCustomers, createClient, fetchPaginatedCustomers };
