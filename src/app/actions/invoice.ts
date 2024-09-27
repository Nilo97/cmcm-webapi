import { parseCookies } from "nookies";
import { InvoiceResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function createInvoice(invoice: any) {
  try {
    console.log(invoice);
    const response = await fetch(`${BASE_URL}/api/invoices`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(invoice),
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data?.message || "Error processing invoice." };
    } else {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob();
        return { data: blob };
      } else {
        return { data: {} };

        // return { error: "Unexpected response format." };
      }
    }
  } catch (error) {
    console.error("Error processing invoice:", error);
    return { error: "Error processing invoice." };
  }
}

async function fetchPaginatedInvoices(
  size?: number,
  page?: number,
  query?: string
): Promise<
  { invoices: InvoiceResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = query
      ? `${BASE_URL}/api/invoices/search?query=${query}&page=${page}&size=${size}`
      : `${BASE_URL}/api/invoices?page=${page}&size=${size}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch invoices");
    }

    const data = await response.json();
    return { invoices: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching invoices:", error);
    return { error: error.message || "Failed to fetch invoices" };
  }
}

export { createInvoice, fetchPaginatedInvoices };
