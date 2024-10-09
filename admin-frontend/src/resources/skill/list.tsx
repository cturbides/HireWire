import { List, Datagrid, TextField, BooleanField, DateField, EditButton } from 'react-admin';
import ToggleActivateButton from '../buttons/ToggleActivateButton';

export const SkillList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="id" />
            <TextField source="description" />
            <BooleanField source="official" />
            <BooleanField source="state" />
            <DateField source="createdAt" />
            <DateField source="updatedAt" />
            <EditButton />
            <ToggleActivateButton resource="skills" />
        </Datagrid>
    </List>
);
