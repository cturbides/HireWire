import { Edit, SimpleForm, NumberInput, AutocompleteInput, ReferenceInput, required, TextInput } from 'react-admin';

export const ApplicantEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput label="Position" source="positionId" reference="positions/available">
                <AutocompleteInput optionText={record => `${record.name} - ${record.minSalary} - ${record.maxSalary}`} />
            </ReferenceInput>

            <NumberInput source="desiredSalary" label="Desired Salary" validate={required()} />
            <TextInput source="recommendedBy" label="Recommended By" validate={required()} />
        </SimpleForm>
    </Edit>
);
