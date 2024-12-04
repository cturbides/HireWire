import { CreateApplicantDto } from "./types";
import { TOKEN_KEY, USER_ID_KEY } from "../../../authProvider";

export const saveApplicant = async (
  applicantData: Omit<CreateApplicantDto, "userId">
): Promise<CreateApplicantDto> => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userId = localStorage.getItem(USER_ID_KEY);

    if (!token || !userId) {
      throw new Error("User is not authenticated");
    }

    const requestBody: CreateApplicantDto = {
      userId,
      skillIds: applicantData.skillIds,
      positionId: applicantData.positionId,
      educationIds: applicantData.educationIds,
      desiredSalary: applicantData.desiredSalary,
      recommendedBy: applicantData.recommendedBy,
      laboralExperienceIds: applicantData.laboralExperienceIds,
    };

    console.log("requestBody:", requestBody);

    const response = await fetch(`http://localhost:3000/applicants`, {
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

    const data: CreateApplicantDto = await response.json();

    return data;
  } catch (error) {
    console.error("Error creating applicant:", error);
    throw error;
  }
};
