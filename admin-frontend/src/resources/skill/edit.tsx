import { Edit, SimpleForm, TextInput, BooleanInput } from 'react-admin';

export const SkillEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="description" label="Description" />
            <BooleanInput source="official" label="Official" />
        </SimpleForm>
    </Edit>
);
