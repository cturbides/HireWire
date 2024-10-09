// SoftDeleteButton.js
import { Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNotify, useRecordContext, useRefresh } from 'react-admin';

const SoftDeleteButton = ({ resource, ...props }) => {
  const record = useRecordContext(props);
  const notify = useNotify();
  const refresh = useRefresh();

  const softDeleteSkill = (event) => {
    event.stopPropagation();

    fetch(`${import.meta.env.VITE_SIMPLE_REST_URL}/${resource}/${record.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
      },
    })
      .then(response => {
        if (response.ok) {
          notify(`${resource} deactivated successfully`, { type: 'success' });
          refresh();
        } else {
          notify(`Error deactivating ${resource}`, { type: 'warning' });
        }
      })
      .catch(() => {
        notify(`Error deactivating ${resource}`, { type: 'error' });
      });
  };

  return record.state === true ? (
    <Button onClick={softDeleteSkill} variant="contained" color="secondary" startIcon={<DeleteIcon />}>
      Deactivate
    </Button>
  ) : null;
};

export default SoftDeleteButton;
