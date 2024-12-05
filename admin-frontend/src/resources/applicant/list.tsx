import React from "react";
import {
  List,
  Datagrid,
  TextField,
  NumberField,
  EditButton,
  useNotify,
  useRefresh,
  useRecordContext,
} from "react-admin";
import ToggleActivateButton from "../buttons/ToggleActivateButton";

const ConvertToEmployeeButton = (data) => {
  const notify = useNotify();
  const refresh = useRefresh();
  const record = useRecordContext();

  console.log({ record });

  const handleConvert = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("User is not authenticated");
      }

      const response = await fetch(
        `http://localhost:3000/applicants/employee`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            applicantId: record.id,
            positionId: record.position.id,
          }),
        },
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      notify("Applicant successfully converted to employee", {
        type: "success",
      });
      refresh(); // Refresh the list
    } catch (error) {
      console.error(error);
      notify(`Error: ${error.message}`, { type: "warning" });
    }
  };

  return (
    <button
      onClick={handleConvert}
      style={{
        padding: "5px 10px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Convert to Employee
    </button>
  );
};

export const ApplicantList = (props) => (
  <List {...props}>
    <Datagrid>
      <TextField source="id" label="Appl ID" />
      <TextField source="user.id" label="User ID" />
      <TextField source="user.email" label="User email" />
      <TextField source="user.documentId" label="Document ID" />
      <TextField source="position.name" label="Position name" />
      <TextField source="position.id" label="Position ID" />
      <NumberField source="desiredSalary" label="Desired Salary" />
      <TextField source="recommendedBy" label="Recommended By" />
      <EditButton />
      <ToggleActivateButton resource="applicants" />
      <ConvertToEmployeeButton />
    </Datagrid>
  </List>
);
