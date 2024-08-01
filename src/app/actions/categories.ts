import { parseCookies } from "nookies";
import { Category } from "../types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchCategories() {
  try {
    const response = await fetch(`${BASE_URL}/api/categories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch categories");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return { error: error.message };
  }
}

async function fetchPaginatedCategories(
  size: number,
  page: number,
  query?: string
): Promise<{ categories: Category[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/api/categories/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/api/categories/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch categories");
    }

    return { categories: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching categories:", error);
    return { error: error.message || "Failed to fetch categories" };
  }
}
async function getCategoryById(
  id: String
): Promise<{ category: Category } | { error: string }> {
  try {
    const url = `${BASE_URL}/api/categories/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch category");
    }

    return { category: data };
  } catch (error: any) {
    console.error("Error fetching category:", error);
    return { error: error.message || "Failed to fetch category" };
  }
}

async function createCategory(categoryData: any) {
  try {
    const response = await fetch(`${BASE_URL}/api/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Failed to create category." };
    }
  } catch (error) {
    console.error("Error creating category:", error);
    return { error: "Failed to create category." };
  }
}

async function updateCategory(
  categoryId: string,
  categoryData: any
): Promise<Category | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(categoryData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update category");
    }

    return data;
  } catch (error: any) {
    console.error("Error updating category:", error);
    return { error: error.message || "Failed to update category" };
  }
}

async function deleteCategory(
  categoryId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/api/categories/${categoryId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to delete category");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting category:", error);
    return { error: error.message || "Failed to delete category" };
  }
}

async function uploadCategories(
  file: File
): Promise<{ success: boolean } | { error: string }> {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/categories/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to upload categories");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error uploading categories:", error);
    return { error: error.message || "Failed to upload categories" };
  }
}

export {
  fetchPaginatedCategories,
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  uploadCategories,
  getCategoryById,
};
