import { Routes, Route, Navigate } from 'react-router-dom';
import { Box } from '@mui/material';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import PodDashboard from './pages/PodDashboard';
import ScalingDashboard from './pages/ScalingDashboard';
import IncidentDashboard from './pages/IncidentDashboard';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/pods" element={<PodDashboard />} />
          <Route path="/pods/:namespace/:podName" element={<PodDashboard />} />
          <Route path="/scaling" element={<ScalingDashboard />} />
          <Route path="/incidents" element={<IncidentDashboard />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Box>
  );
}
