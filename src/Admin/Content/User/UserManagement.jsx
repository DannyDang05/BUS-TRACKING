import React, { useState, useEffect } from 'react';
import '../../Admin.scss';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    IconButton,
    Chip,
    Box,
    Typography,
    TextField,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import PaginationControls from '../PaginationControls';
import ConfirmDialog from '../../Shared/ConfirmDialog';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [confirmDialog, setConfirmDialog] = useState({ open: false, user: null });
    
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        role: 'parent',
        profileId: ''
    });

    const pageSize = 10;

    useEffect(() => {
        fetchUsers();
    }, [currentPage, searchTerm]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:6969/api/v1/users?page=${currentPage}&limit=${pageSize}&q=${searchTerm}`);
            const data = await response.json();
            
            if (data.errorCode === 0) {
                setUsers(data.data);
                setTotalPages(data.meta.totalPages);
                setTotalItems(data.meta.totalItems);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Lỗi khi tải danh sách tài khoản');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (user = null) => {
        if (user) {
            setEditMode(true);
            setSelectedUser(user);
            setFormData({
                username: user.Username,
                password: '', // Không hiển thị password cũ
                role: user.Role,
                profileId: user.ProfileId || ''
            });
        } else {
            setEditMode(false);
            setSelectedUser(null);
            setFormData({
                username: '',
                password: '',
                role: 'parent',
                profileId: ''
            });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditMode(false);
        setSelectedUser(null);
        setFormData({
            username: '',
            password: '',
            role: 'parent',
            profileId: ''
        });
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.username || (!editMode && !formData.password)) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        try {
            const url = editMode 
                ? `http://localhost:6969/api/v1/users/${selectedUser.Id}`
                : 'http://localhost:6969/api/v1/users';
            
            const method = editMode ? 'PUT' : 'POST';
            
            const payload = {
                username: formData.username,
                role: formData.role,
                profileId: formData.profileId || null
            };

            // Chỉ gửi password nếu có giá trị (tạo mới hoặc đổi password)
            if (formData.password) {
                payload.password = formData.password;
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.errorCode === 0) {
                toast.success(editMode ? 'Cập nhật tài khoản thành công!' : 'Tạo tài khoản thành công!');
                handleCloseDialog();
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Lỗi khi lưu tài khoản');
        }
    };

    const handleDeleteConfirm = async (confirmed) => {
        if (!confirmed) {
            setConfirmDialog({ open: false, user: null });
            return;
        }

        try {
            const response = await fetch(`http://localhost:6969/api/v1/users/${confirmDialog.user.Id}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.errorCode === 0) {
                toast.success('Xóa tài khoản thành công!');
                setConfirmDialog({ open: false, user: null });
                fetchUsers();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Lỗi khi xóa tài khoản');
        }
    };

    const getRoleColor = (role) => {
        switch (role) {
            case 'admin':
                return 'error';
            case 'driver':
                return 'primary';
            case 'parent':
                return 'success';
            default:
                return 'default';
        }
    };

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin':
                return 'Quản trị viên';
            case 'driver':
                return 'Tài xế';
            case 'parent':
                return 'Phụ huynh';
            default:
                return role;
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Quản lý Tài khoản
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        onClick={fetchUsers}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        Tạo tài khoản
                    </Button>
                </Box>
            </Box>

            {/* Search */}
            <Box sx={{ mb: 3 }}>
                <TextField
                    fullWidth
                    placeholder="Tìm kiếm theo username, role..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(1);
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Username</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Role</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Profile ID</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }} align="center">Thao tác</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Đang tải...
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Không có dữ liệu
                                </TableCell>
                            </TableRow>
                        ) : (
                            users.map((user) => (
                                <TableRow key={user.Id} hover>
                                    <TableCell>{user.Id}</TableCell>
                                    <TableCell>{user.Username}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={getRoleLabel(user.Role)} 
                                            color={getRoleColor(user.Role)} 
                                            size="small" 
                                        />
                                    </TableCell>
                                    <TableCell>{user.ProfileId || '-'}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            color="primary"
                                            size="small"
                                            onClick={() => handleOpenDialog(user)}
                                            title="Sửa"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            color="error"
                                            size="small"
                                            onClick={() => setConfirmDialog({ open: true, user })}
                                            title="Xóa"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Tổng: {totalItems} tài khoản
                    </Typography>
                    <PaginationControls
                        count={totalItems}
                        page={currentPage - 1}
                        rowsPerPage={pageSize}
                        onPageChange={(newPage) => setCurrentPage(newPage + 1)}
                    />
                </Box>
            )}

            {/* Create/Edit Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editMode ? 'Sửa tài khoản' : 'Tạo tài khoản mới'}
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            label="Username"
                            fullWidth
                            value={formData.username}
                            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                            required
                        />
                        
                        <TextField
                            label={editMode ? 'Password (để trống nếu không đổi)' : 'Password'}
                            type="password"
                            fullWidth
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required={!editMode}
                        />

                        <FormControl fullWidth>
                            <InputLabel>Role</InputLabel>
                            <Select
                                value={formData.role}
                                label="Role"
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            >
                                <MenuItem value="admin">Quản trị viên</MenuItem>
                                <MenuItem value="driver">Tài xế</MenuItem>
                                <MenuItem value="parent">Phụ huynh</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            label="Profile ID (tùy chọn)"
                            fullWidth
                            value={formData.profileId}
                            onChange={(e) => setFormData({ ...formData, profileId: e.target.value })}
                            helperText="ID liên kết với driver/parent (nếu có)"
                        />

                        {formData.role !== 'admin' && (
                            <Alert severity="info">
                                {formData.role === 'driver' && 'Profile ID là ID của tài xế trong bảng drivers'}
                                {formData.role === 'parent' && 'Profile ID là mã phụ huynh trong bảng phuhuynh'}
                            </Alert>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Hủy</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editMode ? 'Cập nhật' : 'Tạo'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Confirm Delete Dialog */}
            <ConfirmDialog
                open={confirmDialog.open}
                title="Xác nhận xóa"
                message={`Bạn có chắc chắn muốn xóa tài khoản "${confirmDialog.user?.Username}"?`}
                onClose={handleDeleteConfirm}
            />
        </Box>
    );
};

export default UserManagement;
