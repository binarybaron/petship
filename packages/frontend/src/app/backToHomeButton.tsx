import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function BackToHomeButton() {
  const navigate = useNavigate();
  return (
    <Button
      variant="contained"
      color="primary"
      size="small"
      onClick={() => navigate('/home')}
      sx={{ mt: 2 }}
    >
      Back to home
    </Button>
  );
}
