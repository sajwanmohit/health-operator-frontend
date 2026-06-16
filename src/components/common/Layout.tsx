import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Badge, Avatar, Menu, MenuItem,
  Divider, Chip,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { logoutUser } from '../../store/slices/authSlice';

const drawerWidth = 260;

const navItems = [
  { path: '/', label: 'Cluster Overview', icon: <DashboardIcon />, roles: ['ADMIN', 'USER', 'PLATFORM_ENGINEER', 'DEVELOPER', 'READ_ONLY'] },
  { path: '/pods', label: 'Pod Dashboard', icon: <DnsIcon />, roles: ['ADMIN', 'USER', 'PLATFORM_ENGINEER', 'DEVELOPER', 'READ_ONLY'] },
  { path: '/scaling', label: 'Scaling Dashboard', icon: <TrendingUpIcon />, roles: ['ADMIN', 'PLATFORM_ENGINEER'] },
  { path: '/incidents', label: 'Incidents', icon: <WarningAmberIcon />, roles: ['ADMIN', 'PLATFORM_ENGINEER'] },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon />, roles: ['ADMIN'] },
  { path: '/admin', label: 'Admin Panel', icon: <AdminPanelSettingsIcon />, roles: ['ADMIN'] },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifAnchor, setNotifAnchor] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const incidents = useSelector((state: RootState) => state.incidents.incidents);
  const user = useSelector((state: RootState) => state.auth.user);
  const activeIncidents = incidents.filter(i => i.status === "DETECTED" || i.status === "INVESTIGATING");

  const handleLogout = async () => {
    setAnchorEl(null);
    await dispatch(logoutUser());
    navigate('/login', { replace: true });
  };

  const filteredNavItems = navItems.filter(item =>
    !item.roles || !user || item.roles.includes(user.role)
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, bgcolor: '#1e2937' }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            K8s Health Operator
          </Typography>
          <IconButton color="inherit" onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={activeIncidents.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu anchorEl={notifAnchor} open={Boolean(notifAnchor)} onClose={() => setNotifAnchor(null)}>
            {activeIncidents.length === 0 ? (
              <MenuItem disabled>No notifications</MenuItem>
            ) : (
              activeIncidents.slice(0, 5).map((inc) => (
                <MenuItem key={inc.id} onClick={() => { navigate("/incidents"); setNotifAnchor(null); }}>
                  {inc.title}
                </MenuItem>
              ))
            )}
          </Menu>
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: user?.role === 'ADMIN' ? 'primary.main' : 'success.main', fontSize: 14 }}>
              {user ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}` : 'OP'}
            </Avatar>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}
            PaperProps={{ sx: { minWidth: 200, bgcolor: '#1e2937' } }}>
            <Box sx={{ px: 2, py: 1 }}>
              <Typography variant="body2" fontWeight={600}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
              {user && <Chip label={user.role} size="small" variant="outlined"
                color={user.role === 'ADMIN' ? 'primary' : 'default'} sx={{ mt: 0.5 }} />}
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate('/settings'); }}>
              <ListItemIcon><PersonIcon fontSize="small" /></ListItemIcon>
              Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon><LogoutIcon fontSize="small" /></ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" sx={{
        width: drawerWidth, flexShrink: 0,
        '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box', bgcolor: '#0a1929' },
        display: { xs: 'none', sm: 'block' },
      }}>
        <Toolbar>
          <Typography variant="h6" color="primary" fontWeight={700}>
            K8s Operator
          </Typography>
        </Toolbar>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />
        <List>
          {filteredNavItems.map((item) => (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1, borderRadius: 2, mb: 0.5,
                  '&.Mui-selected': { bgcolor: 'rgba(0, 188, 212, 0.15)' },
                }}
              >
                <ListItemIcon sx={{ color: location.pathname === item.path ? 'primary.main' : 'text.secondary' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, bgcolor: '#0a1929', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
