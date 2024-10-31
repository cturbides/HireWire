import { Edit, SimpleForm, TextInput, BooleanInput, useRecordContext } from 'react-admin';

const SkillTitle = () => {
    const record = useRecordContext();
    return <span>Skill {record ? `"${record.description}"` : ''}</span>;
};

export const SkillEdit = (props) => (
    <Edit title={<SkillTitle />} {...props}>
        <SimpleForm>
            <TextInput source="description" label="Description" />
            <BooleanInput source="official" label="Official" />
        </SimpleForm>
    </Edit>
);
