import { Skill } from "./types";
import { TOKEN_KEY } from "../../../authProvider";

export interface PaginationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FetchSkillsResponse {
  data: Skill[];
  meta: PaginationMeta;
}

/**
 * Fetches enabled skills from the API.
 * @param page Page number (default: 1)
 * @param take Number of items per page (default: 10)
 * @param order Order of sorting (default: 'ASC')
 * @param sort Sorting field (default: 'createdAt')
 * @param q Optional search query
 * @returns A promise with the fetched skills and pagination metadata
 */
export const fetchSkills = async (
  page = 1,
  take = 100,
  order: "ASC" | "DESC" = "ASC",
  sort = "createdAt",
  q?: string
): Promise<FetchSkillsResponse> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
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
      `http://localhost:3000/skills/enabled?${queryParams}`,
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
    console.error("Error fetching skills:", error);
    throw error;
  }
};
