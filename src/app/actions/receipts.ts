import { parseCookies } from "nookies";
import { ReceiptResponse } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchPaginatedReceipts(
  size?: number,
  page?: number,
  query?: string
): Promise<
  { receipts: ReceiptResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = query
      ? `${BASE_URL}/api/receipts/search?query=${query}&page=${page}&size=${size}`
      : `${BASE_URL}/api/receipts?page=${page}&size=${size}`;

    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to fetch receipts");
    }

    const data = await response.json();
    return { receipts: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching receipts:", error);
    return { error: error.message || "Failed to fetch receipts" };
  }
}

export { fetchPaginatedReceipts };
