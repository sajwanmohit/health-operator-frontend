import { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Typography, Button, Link, IconButton,
  InputAdornment, Alert, CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined, PersonOutline } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { signupUser, clearError } from '../store/slices/authSlice';

export default function SignupPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (isAuthenticated) {
    navigate('/', { replace: true });
    return null;
  }

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!])/.test(password))
      newErrors.password = 'Must contain uppercase, lowercase, number & special character';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(clearError());
    if (!validate()) return;
    const result = await dispatch(signupUser({ firstName, lastName, email, password, confirmPassword }));
    if (signupUser.fulfilled.match(result)) {
      navigate('/', { replace: true });
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1929 0%, #1a2027 50%, #0d2137 100%)',
      p: 2,
    }}>
      <Card sx={{ maxWidth: 480, width: '100%', bgcolor: '#1e2937', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Register for a new account
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField fullWidth label="First Name" value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                error={!!errors.firstName} helperText={errors.firstName}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonOutline fontSize="small" /></InputAdornment> } }} />
              <TextField fullWidth label="Last Name" value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                error={!!errors.lastName} helperText={errors.lastName}
                slotProps={{ input: { startAdornment: <InputAdornment position="start"><PersonOutline fontSize="small" /></InputAdornment> } }} />
            </Box>
            <TextField fullWidth label="Email" type="email" value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!errors.email} helperText={errors.email}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><EmailOutlined fontSize="small" /></InputAdornment> } }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'}
              value={password} onChange={(e) => setPassword(e.target.value)}
              error={!!errors.password} helperText={errors.password}
              slotProps={{
                input: {
                  startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment>,
                  endAdornment: <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                    </IconButton>
                  </InputAdornment>,
                },
              }}
              sx={{ mb: 2 }} />
            <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              error={!!errors.confirmPassword} helperText={errors.confirmPassword}
              slotProps={{ input: { startAdornment: <InputAdornment position="start"><LockOutlined fontSize="small" /></InputAdornment> } }}
              sx={{ mb: 3 }} />
            <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
              sx={{ py: 1.5, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
              {loading ? <CircularProgress size={24} /> : 'Create Account'}
            </Button>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
            Already have an account?{' '}
            <Link component={RouterLink} to="/login" underline="hover" fontWeight={600}>
              Sign in
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
