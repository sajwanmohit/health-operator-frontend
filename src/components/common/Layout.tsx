import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box, Drawer, AppBar, Toolbar, Typography, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Badge, Avatar, Menu, MenuItem,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DnsIcon from '@mui/icons-material/Dns';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const drawerWidth = 260;

const navItems = [
  { path: '/', label: 'Cluster Overview', icon: <DashboardIcon /> },
  { path: '/pods', label: 'Pod Dashboard', icon: <DnsIcon /> },
  { path: '/scaling', label: 'Scaling Dashboard', icon: <TrendingUpIcon /> },
  { path: '/incidents', label: 'Incidents', icon: <WarningAmberIcon /> },
  { path: '/settings', label: 'Settings', icon: <SettingsIcon /> },
];

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const incidents = useSelector((state: RootState) => state.incidents.incidents);
  const activeIncidents = incidents.filter(i => i.status === "DETECTED" || i.status === "INVESTIGATING");

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
          <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Badge badgeContent={activeIncidents.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
            {activeIncidents.slice(0, 5).map((inc) => (
              <MenuItem key={inc.id} onClick={() => { navigate("/incidents"); setAnchorEl(null); }}>
                {inc.title}
              </MenuItem>
            ))}
          </Menu>
          <Avatar sx={{ ml: 2, bgcolor: 'primary.main' }}>OP</Avatar>
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
        <List>
          {navItems.map((item) => (
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
