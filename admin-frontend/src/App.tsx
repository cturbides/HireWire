import { Admin, Resource, CustomRoutes } from "react-admin";
import { Route } from "react-router-dom";

import dataProvider from "./dataProvider";
import { authProvider } from "./authProvider";
import LoginPage from "./resources/login/LoginPage";
import CustomLayout from "./resources/menu/CustomLayout";
import { SkillCreate, SkillEdit, SkillList } from "./resources/skill";
import {
  LanguageCreate,
  LanguageEdit,
  LanguageList,
} from "./resources/language";
import {
  PositionCreate,
  PositionEdit,
  PositionList,
} from "./resources/position";
import {
  EmployeeCreate,
  EmployeeEdit,
  EmployeeList,
} from "./resources/employee";
import {
  EducationCreate,
  EducationEdit,
  EducationList,
} from "./resources/education";
import {
  ApplicantCreate,
  ApplicantEdit,
  ApplicantList,
} from "./resources/applicant";
import {
  LaboralExperienceCreate,
  LaboralExperienceEdit,
  LaboralExperienceList,
} from "./resources/laboral-experience";
import EmployeeReport from "./resources/employee-report/EmployeeReport";
import FlexibleApplicantFilter from "./resources/flexible-search/FlexibleApplicantFilter";

export const App = (props) => (
  <Admin
    layout={CustomLayout}
    dataProvider={dataProvider}
    authProvider={authProvider}
    loginPage={LoginPage}
  >
    <Resource
      {...props}
      name="skills"
      list={SkillList}
      create={SkillCreate}
      edit={SkillEdit}
    />

    <Resource
      {...props}
      name="languages"
      list={LanguageList}
      create={LanguageCreate}
      edit={LanguageEdit}
    />

    <Resource
      {...props}
      name="positions"
      list={PositionList}
      create={PositionCreate}
      edit={PositionEdit}
    />

    <Resource
      {...props}
      name="employees"
      list={EmployeeList}
      create={EmployeeCreate}
      edit={EmployeeEdit}
    />

    <Resource
      {...props}
      name="laboralExperiences"
      list={LaboralExperienceList}
      create={LaboralExperienceCreate}
      edit={LaboralExperienceEdit}
    />

    <Resource
      {...props}
      name="education"
      list={EducationList}
      create={EducationCreate}
      edit={EducationEdit}
    />

    <Resource
      {...props}
      name="applicants"
      list={ApplicantList}
      create={ApplicantCreate}
      edit={ApplicantEdit}
    />

    <CustomRoutes>
      <Route path="/employee/report" element={<EmployeeReport />} />
      <Route path="/applicants/filter" element={<FlexibleApplicantFilter />} />
    </CustomRoutes>
  </Admin>
);
