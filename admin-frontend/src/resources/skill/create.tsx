import { Create, SimpleForm, TextInput, required } from 'react-admin';

export const SkillCreate = () => (
    <Create>
        <SimpleForm defaultValues={{ state: true }}>
            <TextInput source="description" label="Description" validate={required()} />
        </SimpleForm>
    </Create>
);
