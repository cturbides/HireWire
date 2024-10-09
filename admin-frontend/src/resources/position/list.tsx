import { List, Datagrid, TextField, BooleanField, DateField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const PositionList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="name" />
            <TextField source="minSalary" />
            <TextField source="maxSalary" />
            <TextField source="riskLevel" />
            <BooleanField source="available" />
            <BooleanField source="state" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton />
            <ToggleActivateButton resource="positions" />
        </Datagrid>
    </List>
);
