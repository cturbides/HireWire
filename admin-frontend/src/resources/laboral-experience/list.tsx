import { List, Datagrid, TextField, BooleanField, DateField, NumberField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

const dateOptions = { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' };

export const LaboralExperienceList = (props) => (
    <List {...props} title={<span>Laboral Experiences</span>}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="user.id" label="User ID" />
            <TextField source="user.email" label="User Email" />
            <TextField source="company" label="Company" />
            <TextField source="position" label="Position" />
            <NumberField source="salary" label="Salary" />
            
            <DateField source="startDate" label="Start Date" options={dateOptions} />
            <DateField source="endDate" label="End Date" options={dateOptions} />
            
            <BooleanField source="state" />
            <DateField source="createdAt" options={dateOptions} />
            <DateField source="updatedAt" options={dateOptions} />
            
            <EditButton />
            <ToggleActivateButton resource="laboralExperiences" />
        </Datagrid>
    </List>
);
