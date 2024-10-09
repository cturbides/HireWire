import { Create, SimpleForm, TextInput, required, ReferenceInput, AutocompleteInput, DateInput, SelectInput } from 'react-admin';
import { EducationLevelChoices } from '../utils/education-level.enum';

export const EducationCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <ReferenceInput label="User" source="userId" reference="users">
                <AutocompleteInput optionText={record => `${record.firstName} ${record.lastName}`} />
            </ReferenceInput>
            <TextInput source="description" label="Description" validate={required()} />
            <SelectInput source="level" label="Level" choices={EducationLevelChoices} validate={required()} />
            <DateInput source="startDate" label="Start Date" validate={required()} />
            <DateInput source="endDate" label="End Date" />
            <TextInput source="institution" label="Institution" validate={required()} />
        </SimpleForm>
    </Create>
);
