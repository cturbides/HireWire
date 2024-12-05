import React, { useState } from "react";
import { Box, Typography, Button, CircularProgress } from "@mui/material";
import { useNotify } from "react-admin";
import { jsPDF } from "jspdf";

const EmployeeReport = () => {
  const notify = useNotify();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken"); // Replace with your token key
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `http://localhost:3000/employees/available`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.data); // Assuming the API returns an array of employees
      notify("Successfully fetched employees", { type: "success" });
    } catch (error) {
      console.error("Error fetching employees:", error);
      notify(`Error: ${error.message}`, { type: "warning" });
    } finally {
      setLoading(false);
    }
  };

  const generatePDF = () => {
    if (results.length === 0) {
      notify("No data available to generate the PDF", { type: "warning" });
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Employee Report", 20, 20);

    let yPosition = 30;

    results.forEach((employee, index) => {
      const employeeData = `${index + 1}. ${employee.user.firstName} ${
        employee.user.lastName
      } - Position: ${employee.position.name} - Salary: ${
        employee.mensualSalary
      } - Department: ${employee.department}`;
      doc.setFontSize(12);
      doc.text(employeeData, 20, yPosition);

      yPosition += 10;

      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
      }
    });

    doc.save("employee-report.pdf");
    notify("PDF generated successfully", { type: "success" });
  };

  return (
    <Box>
      <Typography variant="h4">Employee Report</Typography>

      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: "20px", marginRight: "10px" }}
        onClick={handleSearch}
        disabled={loading}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Search"}
      </Button>

      <Button
        variant="contained"
        color="secondary"
        style={{ marginTop: "20px" }}
        onClick={generatePDF}
        disabled={results.length === 0}
      >
        Generate PDF
      </Button>

      <Box mt={2}>
        <Typography variant="h6">Results</Typography>
        {results.length > 0 ? (
          <ul>
            {results.map((employee) => (
              <li key={employee.id}>
                {employee.user.firstName} {employee.user.lastName} -{" "}
                {employee.position.name} - Monthly Salary:{" "}
                {employee.mensualSalary} - Department: {employee.department}
              </li>
            ))}
          </ul>
        ) : (
          !loading && <Typography>No results found</Typography>
        )}
      </Box>
    </Box>
  );
};

export default EmployeeReport;
