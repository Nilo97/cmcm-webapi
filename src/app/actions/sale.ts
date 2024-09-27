import { parseCookies } from "nookies";
import { BatchResponse, Product } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function createSale(sales: any) {
  try {
    console.log(sales);
    const response = await fetch(`${BASE_URL}/api/sales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(sales),
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data?.message || "Error saling products." };
    } else {
      const contentType = response.headers.get("Content-Type");
      if (contentType && contentType.includes("application/pdf")) {
        const blob = await response.blob();
        return { data: blob };
      } else {
        return { error: "Unexpected response format." };
      }
    }
  } catch (error) {
    console.error("Error saling products:", error);
    return { error: "Error saling products." };
  }
}

export { createSale };
