import { parseCookies } from "nookies";
import { BatchResponse, Product } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

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

async function fetchProductDetails(
  productId: string | null,
  batchPage: number = 1,
  batchSize: number = 5
): Promise<
  { batches: BatchResponse[]; totalPages: number } | { error: string }
> {
  try {
    const url = `${BASE_URL}/api/products/batches/${productId}?page=${batchPage}&size=${batchSize}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch product details");
    }

    return { batches: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return { error: error.message || "Failed to fetch product details" };
  }
}

async function fetchProductSale(
  code: string
): Promise<{ data: Product } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/products/sale/query/${code}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to get product");
    }

    return { data: data };
  } catch (error: any) {
    console.error("Error fetching product details:", error);
    return { error: error.message || "Failed to get product" };
  }
}

async function getProductById(
  id: string | null
): Promise<{ product: Product } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/products/${id}`;
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

    return { product: data };
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

async function createBatch(batch: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/products/entries`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(batch),
    });

    if (!response.ok) {
      const data = await response.json();
      return { error: data?.message || "Failed to create product." };
    } else {
      return { data: "" };
    }
  } catch (error) {
    console.error("Error creating product:", error);
    return { error: "Failed to create product." };
  }
}

async function updateProduct(
  productId: string,
  productData: any
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
  productId: string
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

async function uploadProducts(
  file: File
): Promise<{ success: boolean } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/products/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to upload products");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error uploading products:", error);
    return { error: error.message || "Failed to upload products" };
  }
}

export {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProducts,
  getProductById,
  fetchProductDetails,
  createBatch,
  fetchProductSale,
};
