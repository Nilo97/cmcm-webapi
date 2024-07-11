import { parseCookies } from "nookies";

const BASE_URL = "http://localhost:8083"; // Replace with your actual API base URL
// const { ["falcon.token"]: token } = parseCookies();
const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJmYWxjb24iLCJzdWIiOiJhcm9uZSIsImV4cCI6MTcyODU4NzcyOH0.IkAv7it8BLqCK-mSSfQyxiSM539He7Xs7fcqz9iVlmc";

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

export { fetchCategories };
