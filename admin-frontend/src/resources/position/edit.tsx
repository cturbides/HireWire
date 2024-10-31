import { RISK_LEVEL } from '../utils/risk-level.enum';
import { validateMaxSalary, validateMinSalary } from '../utils/salary.util';
import { Edit, SimpleForm, TextInput, NumberInput, BooleanInput, SelectInput, useRecordContext } from 'react-admin';

const PositionTitle = () => {
    const record = useRecordContext();
    return <span>Position {record ? `"${record.name}"` : ''}</span>;
};


export const PositionEdit = () => (
    <Edit title={<PositionTitle />}>
        <SimpleForm>
            <TextInput source="name" label="Position Name" />
            <NumberInput source="minSalary" label="Minimum Salary" validate={validateMinSalary} />
            <NumberInput source="maxSalary" label="Maximum Salary" validate={validateMaxSalary} />
            <SelectInput 
                source="riskLevel" 
                label="Risk Level"
                emptyValue={false}
                emptyText={null}
                defaultValue={RISK_LEVEL[0].id}
                choices={RISK_LEVEL}
            />

            <BooleanInput source="available" label="Available" />
            <TextInput source="description" label="Position Description" />
        </SimpleForm>
    </Edit>
);
