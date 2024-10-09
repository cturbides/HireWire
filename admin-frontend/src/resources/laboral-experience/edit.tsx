import { Edit, SimpleForm, TextInput, required, NumberInput, DateInput } from 'react-admin';

export const LaboralExperienceEdit = (props) => (
    <Edit {...props}>
    <SimpleForm>
        <TextInput source="company" label="Company" validate={required()} />
        <TextInput source="position" label="Position" validate={required()} />
        <NumberInput source="salary" label="Salary" validate={required()} />
        <DateInput source="startDate" label="Start Date" validate={required()} />
        <DateInput source="endDate" label="End Date" />
    </SimpleForm>
</Edit>
);
