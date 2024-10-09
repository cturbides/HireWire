import { Create, SimpleForm, TextInput, required, ReferenceInput, AutocompleteInput, DateInput, NumberInput } from 'react-admin';

export const LaboralExperienceCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput label="User" source="userId" reference="users">
                <AutocompleteInput optionText={record => `${record.firstName} ${record.lastName} - ${record.email}`} validate={required()} />
            </ReferenceInput>
            <TextInput source="company" label="Company" validate={required()} />
            <TextInput source="position" label="Position" validate={required()} />
            <NumberInput source="salary" label="Salary" validate={required()} />
            <DateInput source="startDate" label="Start Date" validate={required()} />
            <DateInput source="endDate" label="End Date" />
        </SimpleForm>
    </Create>
);
