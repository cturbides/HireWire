import { Edit, SimpleForm, TextInput, required, SelectInput, DateInput } from 'react-admin';
import { EducationLevelChoices } from '../utils/education-level.enum';

export const EducationEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="description" label="Description" validate={required()} />
            <SelectInput source="level" label="Level" choices={EducationLevelChoices} validate={required()} />
            <DateInput source="startDate" label="Start Date" validate={required()} />
            <DateInput source="endDate" label="End Date" />
            <TextInput source="institution" label="Institution" validate={required()} />
        </SimpleForm>
    </Edit>
);
