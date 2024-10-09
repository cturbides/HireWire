import { Edit, SimpleForm, TextInput } from 'react-admin';

export const LanguageEdit = () => (
    <Edit>
        <SimpleForm>
            <TextInput source="description" label="Description" />
        </SimpleForm>
    </Edit>
);
