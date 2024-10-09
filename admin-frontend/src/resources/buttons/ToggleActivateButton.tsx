import React from 'react';
import ActivateButton from './ActivateButton';
import SoftDeleteButton from './SoftDeleteButton';
import { useRecordContext } from 'react-admin';

const ToggleActivateButton = ({ resource, ...props }) => {
    const record = useRecordContext(props);

    if (record.state === true) {
        return <SoftDeleteButton resource={resource} record={record} />;
    }

    return <ActivateButton resource={resource} record={record} />;
};

export default ToggleActivateButton;
