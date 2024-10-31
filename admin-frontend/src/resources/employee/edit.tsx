import { Edit, SimpleForm, NumberInput, AutocompleteInput, ReferenceInput, required, TextInput, useRecordContext } from 'react-admin';

const EmployeeTitle = () => {
    const record = useRecordContext();
    console.log({ record });
    return <span>Position {record ? `"${record.name}"` : ''}</span>;
};

export const EmployeeEdit = () => {
    return (
        <Edit title={<EmployeeTitle />}>
            <SimpleForm>
                <ReferenceInput
                    label="User"
                    source="user.id"
                    reference="users"
                    format={(v) => v?.id}  // Mostrar user.id en el input
                    parse={(v) => ({ id: v })}  // Guardar el userId de vuelta
                >
                    <AutocompleteInput
                        optionValue="id"
                        optionText={record => `${record.firstName} ${record.lastName} - ${record.email}`}
                        validate={required()}
                    />
                </ReferenceInput>

                <ReferenceInput
                    label="Position"
                    source="position.id"
                    reference="positions"
                    filter={{ available: true }}
                    format={(v) => v?.id}  // Mostrar position.id en el input
                    parse={(v) => ({ id: v })}  // Guardar el positionId de vuelta
                >
                    <AutocompleteInput
                        optionValue="id"
                        optionText={record => `${record.name} - ${record.riskLevel} - ${record.minSalary} - ${record.maxSalary}`}
                        validate={required()}
                    />
                </ReferenceInput>

                <NumberInput source="mensualSalary" label="Mensual Salary" />
                <TextInput source="department" label="Department" />
            </SimpleForm>
        </Edit>
    );
};
