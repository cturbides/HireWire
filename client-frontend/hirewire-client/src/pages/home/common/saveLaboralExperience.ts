import { LaboralExperience } from "./types";
import { TOKEN_KEY, USER_ID_KEY } from "../../../authProvider";

export const saveLaboralExperience = async (
  experience: Omit<LaboralExperience, "id">
): Promise<LaboralExperience> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!token || !userId) {
      throw new Error("User is not authenticated");
    }

    const requestBody = {
      ...experience,
      userId,
    };

    const response = await fetch(`http://localhost:3000/laboralExperiences`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: LaboralExperience = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating laboral experience:", error);
    throw error;
  }
};
