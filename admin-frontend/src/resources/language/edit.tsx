import { Edit, SimpleForm, TextInput, useRecordContext } from 'react-admin';

const LanguageTitle = () => {
    const record = useRecordContext();
    return <span>Language {record ? `"${record.description}"` : ''}</span>;
};


export const LanguageEdit = () => (
    <Edit title={<LanguageTitle />}>
        <SimpleForm>
            <TextInput source="description" label="Description" />
        </SimpleForm>
    </Edit>
);
