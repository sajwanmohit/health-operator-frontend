import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <Box sx={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', gap: 2,
    }}>
      <LockOutlinedIcon sx={{ fontSize: 80, color: 'error.main' }} />
      <Typography variant="h4" fontWeight={700}>Access Denied</Typography>
      <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 400, textAlign: 'center' }}>
        You do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Button variant="outlined" onClick={() => navigate(-1)}>Go Back</Button>
        <Button variant="contained" onClick={() => navigate('/')}>Go to Dashboard</Button>
      </Box>
    </Box>
  );
}
