// ActivateButton.js
import { Button } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useNotify, useRecordContext, useRefresh } from 'react-admin';

const ActivateButton = ({ resource, ...props }) => {
const record = useRecordContext(props);

  const notify = useNotify();
  const refresh = useRefresh();

  const activateSkill = (event) => {
    event.stopPropagation();

    fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/${resource}/activate/${record.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`
      },
    })
      .then(response => {
        if (response.ok) {
          notify(`${resource} activated successfully`, { type: 'success' });
          refresh(); 
        } else {
          notify(`Error activating ${resource}`, { type: 'warning' });
        }
      })
      .catch(() => {
        notify(`Error activating ${resource}`, { type: 'error' });
      });
  };

  return record.state === false ? (
    <Button onClick={activateSkill} variant="contained" color="primary" startIcon={<CheckIcon />}>
      Activate
    </Button>
  ) : null;
};

export default ActivateButton;
