import { List, Datagrid, TextField, BooleanField, NumberField, DateField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const EmployeeList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <BooleanField source='state' />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <TextField source="department" />
            <TextField source="user.id" label="User ID" />
            <TextField source="documentId" label="Document ID" />
            <TextField source="position.name" label="Position" />
            <NumberField source="mensualSalary" label="Mensual Salary" />
            <EditButton />
            <ToggleActivateButton resource="employees" />
        </Datagrid>
    </List>
);
