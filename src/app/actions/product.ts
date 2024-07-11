import { parseCookies } from "nookies";
import { Product } from "../types";

const BASE_URL = "http://localhost:8083"; // Replace with your actual API base URL

// const { ["falcon.token"]: token } = parseCookies();

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmYWxjb24iLCJzdWIiOiJhcm9uZSIsImV4cCI6MTcyODU4NzcyOH0.IkAv7it8BLqCK-mSSfQyxiSM539He7Xs7fcqz9iVlmc";

async function fetchProducts(
  size: number,
  page: number,
  query?: string
): Promise<{ products: Product[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/api/products/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/api/products?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch products");
    }

    return { products: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return { error: error.message || "Failed to fetch products" };
  }
}

async function createProduct(productData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Failed to create product." };
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product." };
  }
}

async function updateProduct(
  productId: number,
  productData: Partial<Product>
): Promise<Product | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(productData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update product");
    }

    return data;
  } catch (error: any) {
    console.error("Error updating product:", error);
    return { error: error.message || "Failed to update product" };
  }
}

async function deleteProduct(
  productId: number
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to delete product");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return { error: error.message || "Failed to delete product" };
  }
}

export { fetchProducts, createProduct, updateProduct, deleteProduct };
