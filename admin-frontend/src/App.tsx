import {
  Admin,
  Resource,
} from "react-admin";

import dataProvider from "./dataProvider";
import { authProvider } from "./authProvider";
import LoginPage from './resources/login/LoginPage';
import { SkillCreate, SkillEdit, SkillList } from './resources/skill';
import { LanguageCreate, LanguageEdit, LanguageList } from './resources/language';
import { PositionCreate, PositionEdit, PositionList } from './resources/position';
import { EmployeeCreate, EmployeeEdit, EmployeeList } from './resources/employee';
import { EducationCreate, EducationEdit, EducationList } from './resources/education';
import { LaboralExperienceCreate, LaboralExperienceEdit, LaboralExperienceList } from './resources/laboral-experience';

export const App = (props) => (
  <Admin
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

  </Admin>
);
