import { Education } from "./types";
import { TOKEN_KEY, USER_ID_KEY } from "../../../authProvider";

export interface PaginationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FetchEducationResponse {
  data: Education[];
  meta: PaginationMeta;
}

export const fetchEducation = async (
  page = 1,
  take = 100,
  order: "ASC" | "DESC" = "ASC",
  sort = "createdAt",
  q?: string
): Promise<FetchEducationResponse> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!token || !userId) {
      throw new Error("User is not authenticated");
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      take: take.toString(),
      order,
      sort,
      ...(q && { q }),
    });

    const response = await fetch(
      `http://localhost:3000/education/enabled/${userId}?${queryParams}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const { data, meta } = await response.json();

    if (!Array.isArray(data)) {
      throw new Error(
        "Invalid response format: expected 'data' to be an array"
      );
    }

    if (!meta) {
      throw new Error("Invalid response format: missing 'meta' property");
    }

    return { data, meta };
  } catch (error) {
    console.error("Error fetching education:", error);
    throw error;
  }
};
