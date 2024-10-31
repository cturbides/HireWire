import { Edit, SimpleForm, TextInput, required, NumberInput, DateInput, useRecordContext } from 'react-admin';

const formatDate = (date) => {
    if (!date) return '';
    const parsedDate = Date.parse(date.split('T')[0]);
    console.log({date: date.split('T')[0], parsedDate})
    return new Date(parsedDate).toISOString().split('T')[0];
};

const parseDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString() : '';
};

const LaboralExperienceTitle = () => {
    const record = useRecordContext();
    return <span>Laboral Experience {record ? `"${record.position}" - "${record.user.firstName}" - "${record.user.documentId}"` : ''}</span>;
};

export const LaboralExperienceEdit = (props) => (
    <Edit title={<LaboralExperienceTitle />} {...props}>
        <SimpleForm>
            <TextInput source="company" label="Company" validate={required()} />
            <TextInput source="position" label="Position" validate={required()} />
            <NumberInput source="salary" label="Salary" validate={required()} />
            
            {/* DateInput con format y parse para manejar la zona horaria */}
            <DateInput
                source="startDate"
                label="Start Date"
                validate={required()}
                format={formatDate}  // Formatea la fecha desde el servidor para mostrarla correctamente
                parse={parseDate}    // Convierte la fecha de vuelta al formato ISO al enviarla
            />
            <DateInput
                source="endDate"
                label="End Date"
                format={formatDate}  // Formatea la fecha desde el servidor
                parse={parseDate}    // Convierte la fecha a ISO antes de enviarla
            />
        </SimpleForm>
    </Edit>
);
