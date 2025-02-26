import { parseCookies } from "nookies";
import { Book } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
const { ["token"]: token } = parseCookies();

async function fetchBooks(
  size: number,
  page: number,
  query?: string
): Promise<{ books: Book[]; totalPages: number } | { error: string }> {
  try {
    const url =
      query !== ""
        ? `${BASE_URL}/books/search?query=${query}&page=${page}&size=${size}`
        : `${BASE_URL}/books/paginated?page=${page}&size=${size}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch books");
    }

    return { books: data.content, totalPages: data.totalPages };
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return { error: error.message || "Failed to fetch books" };
  }
}

async function getBookById(
  id: string | null
): Promise<{ book: Book } | { error: string }> {
  try {
    const url = `${BASE_URL}/books/${id}`;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to fetch books");
    }

    return { book: data };
  } catch (error: any) {
    console.error("Error fetching books:", error);
    return { error: error.message || "Failed to fetch books" };
  }
}

async function createBook(bookData: any) {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      return { error: data?.message || "Failed to create book." };
    }
  } catch (error) {
    console.error("Error creating book:", error);
    return { error: "Failed to create book." };
  }
}

async function updateBook(
  bookId: string,
  bookData: any
): Promise<Book | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bookData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.message || "Failed to update book");
    }

    return data;
  } catch (error: any) {
    console.error("Error updating book:", error);
    return { error: error.message || "Failed to update book" };
  }
}

async function deleteBook(
  bookId: string
): Promise<{ success: boolean } | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/books/${bookId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to delete book");
    }

    return { success: true };
  } catch (error: any) {
    console.error("Error deleting book:", error);
    return { error: error.message || "Failed to delete book" };
  }
}

async function downloadBook(id: string): Promise<Blob | { error: string }> {
  try {
    const response = await fetch(`${BASE_URL}/books/download/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data?.message || "Failed to download book");
    }

    return await response.blob();
  } catch (error: any) {
    console.error("Error downloading book:", error);
    return { error: error.message || "Failed to download book" };
  }
}

export {
  downloadBook,
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  getBookById,
};
