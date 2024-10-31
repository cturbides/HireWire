import { List, Datagrid, TextField, NumberField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

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
        </Datagrid>
    </List>
);
