import { TOKEN_KEY } from "../../../authProvider";

export interface Position {
  id: string;
  name: string | null;
  state: boolean;
  minSalary: number;
  maxSalary: number;
  riskLevel: RiskLevel;
  available: boolean;
  description: string | null;
}

export enum RiskLevel {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export interface PaginationMeta {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface FetchPositionsResponse {
  data: Position[];
  meta: PaginationMeta;
}

export const fetchAvailablePositions = async (
  page = 1,
  take = 10
): Promise<FetchPositionsResponse> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch(
      `http://localhost:3000/positions/available?page=${page}&take=${take}`,
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
    console.error("Error fetching available positions:", error);
    throw error;
  }
};
