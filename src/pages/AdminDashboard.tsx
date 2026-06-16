import { useState, useEffect, useCallback } from 'react';
import {
  Box, Typography, TextField, InputAdornment, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, IconButton, Chip, Avatar,
  TablePagination, Switch, Tooltip, Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import { Search, Refresh, Edit, Visibility } from '@mui/icons-material';
import { adminApi } from '../services/api';
import type { User } from '../types';

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialog, setEditDialog] = useState(false);
  const [editData, setEditData] = useState<Partial<User>>({});
  const [viewDialog, setViewDialog] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.listUsers(search || undefined);
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleActive = async (user: User) => {
    try {
      if (user.active) {
        await adminApi.deactivateUser(user.id);
      } else {
        await adminApi.activateUser(user.id);
      }
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle user status', err);
    }
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setEditData({ firstName: user.firstName, lastName: user.lastName, email: user.email, role: user.role });
    setEditDialog(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.updateUser(selectedUser.id, editData);
      setEditDialog(false);
      fetchUsers();
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  const handleOpenView = (user: User) => {
    setSelectedUser(user);
    setViewDialog(true);
  };

  const filteredUsers = users;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>User Management</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            size="small" placeholder="Search users..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            slotProps={{
              input: {
                startAdornment: <InputAdornment position="start"><Search fontSize="small" /></InputAdornment>,
              },
            }}
            sx={{ width: 300 }}
          />
          <Tooltip title="Refresh">
            <IconButton onClick={fetchUsers}><Refresh /></IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Paper sx={{ bgcolor: '#1e2937', borderRadius: 2, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ width: 32, height: 32, bgcolor: user.role === 'ADMIN' ? 'primary.main' : 'success.main', fontSize: 14 }}>
                        {user.firstName?.[0]}{user.lastName?.[0]}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>
                        {user.firstName} {user.lastName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Chip label={user.role} size="small"
                      color={user.role === 'ADMIN' ? 'primary' : 'default'}
                      variant="outlined" />
                  </TableCell>
                  <TableCell>
                    <Switch checked={user.active} onChange={() => handleToggleActive(user)}
                      size="small" color="success" />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Tooltip title="View"><IconButton size="small" onClick={() => handleOpenView(user)}><Visibility fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Edit"><IconButton size="small" onClick={() => handleOpenEdit(user)}><Edit fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {!loading && filteredUsers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No users found</Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div" count={filteredUsers.length} page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage} onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          sx={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
        />
      </Paper>

      <Dialog open={editDialog} onClose={() => setEditDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#1e2937' } }}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField label="First Name" value={editData.firstName || ''}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })} fullWidth />
            <TextField label="Last Name" value={editData.lastName || ''}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })} fullWidth />
            <TextField label="Email" value={editData.email || ''}
              onChange={(e) => setEditData({ ...editData, email: e.target.value })} fullWidth />
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={editData.role || 'USER'} label="Role"
                onChange={(e) => setEditData({ ...editData, role: e.target.value })}>
                <MenuItem value="ADMIN">ADMIN</MenuItem>
                <MenuItem value="USER">USER</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialog(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={viewDialog} onClose={() => setViewDialog(false)} maxWidth="sm" fullWidth
        PaperProps={{ sx: { bgcolor: '#1e2937' } }}>
        <DialogTitle>User Details</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main', fontSize: 20 }}>
                  {selectedUser.firstName?.[0]}{selectedUser.lastName?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="h6">{selectedUser.firstName} {selectedUser.lastName}</Typography>
                  <Typography variant="body2" color="text.secondary">{selectedUser.email}</Typography>
                </Box>
              </Box>
              <Typography variant="body2"><strong>Role:</strong> {selectedUser.role}</Typography>
              <Typography variant="body2"><strong>Active:</strong> {selectedUser.active ? 'Yes' : 'No'}</Typography>
              <Typography variant="body2"><strong>Created:</strong> {new Date(selectedUser.createdAt).toLocaleString()}</Typography>
              <Typography variant="body2"><strong>Updated:</strong> {new Date(selectedUser.updatedAt).toLocaleString()}</Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
