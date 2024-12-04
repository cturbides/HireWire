import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  MenuItem,
  Select,
  Button,
  CircularProgress,
} from "@mui/material";
import { useDataProvider, useNotify } from "react-admin";

const fetchApplicants = async ({
  skillId,
  positionId,
  educationId,
}: {
  skillId?: string;
  positionId?: string;
  educationId?: string;
}): Promise<any> => {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      throw new Error("User is not authenticated");
    }

    const response = await fetch("http://localhost:3000/applicants/filter", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skillId: skillId || undefined,
        positionId: positionId || undefined,
        educationId: educationId || undefined,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching applicants:", error);
    throw error;
  }
};

const FlexibleApplicantFilter = () => {
  const dataProvider = useDataProvider();
  const notify = useNotify();

  const [filters, setFilters] = useState({
    skillId: "",
    positionId: "",
    educationId: "",
  });
  const [results, setResults] = useState([]);
  const [skills, setSkills] = useState([]);
  const [positions, setPositions] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [loadingEducations, setLoadingEducations] = useState(true);

  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  const handleSearch = async () => {
    const { skillId, positionId, educationId } = filters;

    try {
      const data = await fetchApplicants({
        skillId: skillId,
        positionId: positionId,
        educationId: educationId,
      });

      console.log({ data });
      setResults(data.data);
    } catch (error) {
      notify(`Error: ${error.message}`, { type: "warning" });
    }
  };

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoadingSkills(true);
        const { data } = await dataProvider.getList("skills", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "description", order: "ASC" },
        });
        setSkills(data);
        setLoadingSkills(false);
      } catch (error) {
        notify(`Error fetching skills: ${error.message}`, { type: "warning" });
        setLoadingSkills(false);
      }
    };

    fetchSkills();
  }, [dataProvider, notify]);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        setLoadingPositions(true);
        const { data } = await dataProvider.getList("positions", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "name", order: "ASC" },
        });
        setPositions(data);
        setLoadingPositions(false);
      } catch (error) {
        notify(`Error fetching positions: ${error.message}`, {
          type: "warning",
        });
        setLoadingPositions(false);
      }
    };

    fetchPositions();
  }, [dataProvider, notify]);

  useEffect(() => {
    const fetchEducations = async () => {
      try {
        setLoadingEducations(true);
        const { data } = await dataProvider.getList("education", {
          pagination: { page: 1, perPage: 100 },
          sort: { field: "level", order: "ASC" },
        });
        setEducations(data);
        setLoadingEducations(false);
      } catch (error) {
        notify(`Error fetching education levels: ${error.message}`, {
          type: "warning",
        });
        setLoadingEducations(false);
      }
    };

    fetchEducations();
  }, [dataProvider, notify]);

  return (
    <Box>
      <Typography variant="h6">
        Search Applicants by Skill, Position, and Education
      </Typography>

      {loadingSkills ? (
        <CircularProgress />
      ) : (
        <Select
          value={filters.skillId}
          onChange={(e) => handleFilterChange("skillId", e.target.value)}
          displayEmpty
          fullWidth
        >
          <MenuItem value="" disabled>
            Select a Skill
          </MenuItem>
          {skills.map((skill) => (
            <MenuItem key={skill.id} value={skill.id}>
              {skill.description}
            </MenuItem>
          ))}
        </Select>
      )}

      {loadingPositions ? (
        <CircularProgress />
      ) : (
        <Select
          value={filters.positionId}
          onChange={(e) => handleFilterChange("positionId", e.target.value)}
          displayEmpty
          fullWidth
          style={{ marginTop: "20px" }}
        >
          <MenuItem value="" disabled>
            Select a Position
          </MenuItem>
          {positions.map((position) => (
            <MenuItem key={position.id} value={position.id}>
              {position.name}
            </MenuItem>
          ))}
        </Select>
      )}

      {loadingEducations ? (
        <CircularProgress />
      ) : (
        <Select
          value={filters.educationId}
          onChange={(e) => handleFilterChange("educationId", e.target.value)}
          displayEmpty
          fullWidth
          style={{ marginTop: "20px" }}
        >
          <MenuItem value="" disabled>
            Select Education Level
          </MenuItem>
          {educations.map((education) => (
            <MenuItem key={education.id} value={education.id}>
              {education.level}
            </MenuItem>
          ))}
        </Select>
      )}

      <Button
        variant="contained"
        color="primary"
        onClick={handleSearch}
        disabled={loadingSkills || loadingPositions || loadingEducations}
        style={{ marginTop: "20px" }}
      >
        Search
      </Button>

      <Box mt={2}>
        <Typography variant="h6">Results</Typography>
        {results.length > 0 ? (
          <ul>
            {results.map((applicant) => (
              <li key={applicant.id}>
                {applicant.user.firstName} {applicant.user.lastName} -{" "}
                {applicant.position.name} - Desired Salary:{" "}
                {applicant.desiredSalary} - Recommended By:{" "}
                {applicant.recommendedBy}
              </li>
            ))}
          </ul>
        ) : (
          <Typography>No results found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default FlexibleApplicantFilter;
