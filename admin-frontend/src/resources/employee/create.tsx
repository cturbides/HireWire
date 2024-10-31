import { Create, SimpleForm, NumberInput, AutocompleteInput, ReferenceInput, required, TextInput } from 'react-admin';

export const EmployeeCreate = () => {
    return (
        <Create>
            <SimpleForm>
                <ReferenceInput label="User" source="userId" reference="users/not-employees">
                    <AutocompleteInput
                        optionValue="id"
                        optionText={record => `${record.firstName} ${record.lastName} - ${record.email}`}
                        validate={required()}
                    />
                </ReferenceInput>

                <ReferenceInput label="Position" source="positionId" reference="positions/available" filter={{ available: true }}>
                    <AutocompleteInput
                        optionValue="id"
                        optionText={record => `${record.name} - ${record.riskLevel} - ${record.minSalary} - ${record.maxSalary}`}
                        validate={required()}
                    />
                </ReferenceInput>

                <NumberInput source="mensualSalary" label="Mensual Salary" validate={[required()]} />
                <TextInput source="department" label="Department" validate={required()} />
            </SimpleForm>
        </Create>
    )
}
