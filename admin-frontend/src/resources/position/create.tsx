import { Create, SimpleForm, TextInput, NumberInput, required, BooleanInput, SelectInput } from 'react-admin';
import { validateMaxSalary, validateMinSalary } from '../utils/salary.util';
import { RISK_LEVEL } from '../utils/risk-level.enum';

export const PositionCreate = () => (
    <Create>
        <SimpleForm defaultValues={{ available: true }}>
            <TextInput source="name" label="Position Name" validate={required()} />
            <NumberInput source="minSalary" label="Minimum Salary" validate={[required(), validateMinSalary]} />
            <NumberInput source="maxSalary" label="Maximum Salary" validate={[required(), validateMaxSalary]} />
            <SelectInput
                validate={required()}
                source="riskLevel"
                label="Risk Level"
                choices={RISK_LEVEL}
            />

            <BooleanInput source="available" label="Available" />
            <TextInput source="description" label="Description" validate={required()} />
        </SimpleForm>
    </Create>
);
