import { Create, SimpleForm, NumberInput, AutocompleteInput, ReferenceInput, required, TextInput, SelectArrayInput } from 'react-admin';
import { validateDocumentId } from '../utils/document-id.util';

const validateDocumentIdInput = (value) => {
    if (!validateDocumentId(value)) {
        return 'Invalid document ID';
    }

    return undefined;
};
export const ApplicantCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput label="User" source="userId" reference="users">
                <AutocompleteInput optionText={record => `${record.firstName} ${record.lastName} - ${record.email}`} />
            </ReferenceInput>

            <ReferenceInput label="Position" source="positionId" reference="positions/available">
                <AutocompleteInput optionText={record => `${record.name} - ${record.minSalary} - ${record.maxSalary}`} />
            </ReferenceInput>

            <TextInput source="documentId" label="Document ID" validate={[required(), validateDocumentIdInput]} />

            <NumberInput source="desiredSalary" label="Desired Salary" validate={required()} />
            <TextInput source="recommendedBy" label="Recommended By" validate={required()} />

            <ReferenceInput label="Skills" source="skillIds" reference="skills">
                <SelectArrayInput optionText="description" />
            </ReferenceInput>

            <ReferenceInput label="Laboral Experiences" source="laboralExperienceIds" reference="laboralExperiences">
                <SelectArrayInput optionText="position" />
            </ReferenceInput>

            <ReferenceInput label="Educations" source="educationIds" reference="education">
                <SelectArrayInput optionText="description" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);
