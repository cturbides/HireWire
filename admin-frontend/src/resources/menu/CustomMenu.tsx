import * as React from "react";
import { Menu, MenuItemLink } from "react-admin";
import PeopleIcon from "@mui/icons-material/People";
import WorkIcon from "@mui/icons-material/Work";
import LanguageIcon from "@mui/icons-material/Language";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import SchoolIcon from "@mui/icons-material/School";
import ApplicantIcon from "@mui/icons-material/PersonSearch";
import ApplicantIconFilter from "@mui/icons-material/Person2Outlined";
import EmployeeReportIcon from "@mui/icons-material/HPlusMobiledataRounded";

const CustomMenu = (props) => {
  return (
    <Menu {...props}>
      <MenuItemLink to="/skills" primaryText="Skills" leftIcon={<WorkIcon />} />
      <MenuItemLink
        to="/languages"
        primaryText="Languages"
        leftIcon={<LanguageIcon />}
      />
      <MenuItemLink
        to="/positions"
        primaryText="Positions"
        leftIcon={<BusinessCenterIcon />}
      />
      <MenuItemLink
        to="/employees"
        primaryText="Employees"
        leftIcon={<PeopleIcon />}
      />
      <MenuItemLink
        to="/laboralexperiences"
        primaryText="Laboral Experiences"
        leftIcon={<WorkIcon />}
      />
      <MenuItemLink
        to="/education"
        primaryText="Education"
        leftIcon={<SchoolIcon />}
      />
      <MenuItemLink
        to="/applicants"
        primaryText="Applicants"
        leftIcon={<ApplicantIcon />}
      />
      <MenuItemLink
        to="/applicants/filter"
        primaryText="Applicants filter"
        leftIcon={<ApplicantIconFilter />}
      />
      <MenuItemLink
        to="/employee/report"
        primaryText="Employee report"
        leftIcon={<EmployeeReportIcon />}
      />
    </Menu>
  );
};

export default CustomMenu;
