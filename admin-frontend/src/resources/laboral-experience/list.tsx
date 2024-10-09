import { List, Datagrid, TextField, BooleanField, DateField, NumberField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const LaboralExperienceList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="company" label="Company" />
            <TextField source="position" label="Position" />
            <NumberField source="salary" label="Salary" />
            <DateField source="startDate" label="Start Date" />
            <DateField source="endDate" label="End Date" />
            <BooleanField source="state" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton />
            <ToggleActivateButton resource="laboralExperiences" />
        </Datagrid>
    </List>
);
