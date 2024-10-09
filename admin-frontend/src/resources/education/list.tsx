import { List, Datagrid, TextField, BooleanField, DateField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const EducationList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="user.id" label="User ID" />
            <TextField source="user.email" label="User Email" />
            <TextField source="institution" label="Institution" />
            <TextField source="description" label="Description" />
            <TextField source="level" label="Level" />
            <DateField source="startDate" label="Start Date" />
            <DateField source="endDate" label="End Date" />
            <BooleanField source="state" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton />
            <ToggleActivateButton resource="education" />
        </Datagrid>
    </List>
);
