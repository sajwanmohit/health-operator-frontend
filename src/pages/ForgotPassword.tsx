import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Typography, Button, Link, Alert, CircularProgress,
} from '@mui/material';
import { EmailOutlined, ArrowBack } from '@mui/icons-material';
import api from '../services/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0a1929 0%, #1a2027 50%, #0d2137 100%)',
      p: 2,
    }}>
      <Card sx={{ maxWidth: 440, width: '100%', bgcolor: '#1e2937', borderRadius: 3, boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h4" fontWeight={700} color="primary">
              Reset Password
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              {sent ? 'Check your email for reset instructions' : 'Enter your email to receive reset instructions'}
            </Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {sent && <Alert severity="success" sx={{ mb: 2 }}>Reset link sent! (Demo: backend placeholder)</Alert>}

          {!sent && (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={email}
                onChange={(e) => setEmail(e.target.value)}
                slotProps={{ input: { startAdornment: <EmailOutlined fontSize="small" sx={{ mr: 1 }} /> } }}
                sx={{ mb: 3 }} />
              <Button type="submit" fullWidth variant="contained" size="large" disabled={loading}
                sx={{ py: 1.5, textTransform: 'none', fontWeight: 600, borderRadius: 2 }}>
                {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
              </Button>
            </Box>
          )}

          <Button component={RouterLink} to="/login" startIcon={<ArrowBack />} fullWidth
            sx={{ mt: 2, textTransform: 'none', color: 'text.secondary' }}>
            Back to Sign In
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
