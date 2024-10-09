import { List, Datagrid, TextField, BooleanField, DateField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const LanguageList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="description" />
            <BooleanField source="state" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton />
            <ToggleActivateButton resource="languages" />
        </Datagrid>
    </List>
);
