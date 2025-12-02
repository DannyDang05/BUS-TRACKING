import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Box,
    Typography,
    Alert,
    Avatar,
    IconButton,
    CircularProgress,
    Divider,
    Grid
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const EditUserModal = ({ open, onClose, user, onSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [accountData, setAccountData] = useState({
        username: '',
        password: '',
        role: 'parent'
    });

    const [profileData, setProfileData] = useState({
        // For driver
        driverId: '',
        fullName: '',
        maBangLai: '',
        phoneNumber: '',
        isActive: 1,
        // For parent
        parentId: '',
        parentName: '',
        parentPhone: ''
    });

    const [profileLoaded, setProfileLoaded] = useState(false);

    useEffect(() => {
        if (open && user) {
            setAccountData({
                username: user.Username,
                password: '',
                role: user.Role
            });

            // Load profile data based on role
            if (user.ProfileId) {
                loadProfileData(user.Role, user.ProfileId);
            } else {
                setProfileLoaded(true);
            }
        }
    }, [open, user]);

    const loadProfileData = async (role, profileId) => {
        setLoading(true);
        try {
            if (role === 'driver') {
                const response = await fetch(`http://localhost:6969/api/v1/drivers/${profileId}`);
                const data = await response.json();
                if (data.errorCode === 0) {
                    setProfileData({
                        ...profileData,
                        driverId: data.data.Id,
                        fullName: data.data.FullName,
                        maBangLai: data.data.MaBangLai,
                        phoneNumber: data.data.PhoneNumber,
                        isActive: data.data.IsActive
                    });
                }
            } else if (role === 'parent') {
                const response = await fetch(`http://localhost:6969/api/v1/parent/info/${profileId}`);
                const data = await response.json();
                if (data.errorCode === 0) {
                    setProfileData({
                        ...profileData,
                        parentId: data.data.MaPhuHuynh,
                        parentName: data.data.HoTen,
                        parentPhone: data.data.SoDienThoai
                    });
                }
            }
            setProfileLoaded(true);
        } catch (error) {
            console.error('Error loading profile:', error);
            toast.error('Lỗi khi tải thông tin profile');
            setProfileLoaded(true);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseDialog = () => {
        setAccountData({ username: '', password: '', role: 'parent' });
        setProfileData({
            driverId: '',
            fullName: '',
            maBangLai: '',
            phoneNumber: '',
            isActive: 1,
            parentId: '',
            parentName: '',
            parentPhone: ''
        });
        setProfileLoaded(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!accountData.username) {
            toast.error('Vui lòng điền username');
            return;
        }

        setLoading(true);
        try {
            // Update user account
            const userPayload = {
                username: accountData.username,
                role: accountData.role
            };

            if (accountData.password) {
                userPayload.password = accountData.password;
            }

            const userResponse = await fetch(`http://localhost:6969/api/v1/users/${user.Id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userPayload)
            });

            const userData = await userResponse.json();
            if (userData.errorCode !== 0) {
                toast.error(userData.message || 'Lỗi cập nhật tài khoản');
                setLoading(false);
                return;
            }

            // Update profile if exists
            if (user.ProfileId) {
                if (accountData.role === 'driver') {
                    await updateDriver();
                } else if (accountData.role === 'parent') {
                    await updateParent();
                }
            }

            toast.success('Cập nhật tài khoản thành công!');
            handleCloseDialog();
            onSuccess && onSuccess();
        } catch (error) {
            console.error('Error updating user:', error);
            toast.error('Lỗi khi cập nhật tài khoản');
        } finally {
            setLoading(false);
        }
    };

    const updateDriver = async () => {
        try {
            const response = await fetch(`http://localhost:6969/api/v1/drivers/${profileData.driverId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    FullName: profileData.fullName,
                    MaBangLai: profileData.maBangLai,
                    PhoneNumber: profileData.phoneNumber,
                    IsActive: profileData.isActive
                })
            });

            const data = await response.json();
            if (data.errorCode !== 0) {
                toast.error(data.message || 'Lỗi cập nhật tài xế');
            }
        } catch (error) {
            console.error('Error updating driver:', error);
        }
    };

    const updateParent = async () => {
        try {
            const response = await fetch(`http://localhost:6969/api/v1/parent/s/${profileData.parentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    HoTen: profileData.parentName,
                    SoDienThoai: profileData.parentPhone
                })
            });

            const data = await response.json();
            if (data.errorCode !== 0) {
                toast.error(data.message || 'Lỗi cập nhật phụ huynh');
            }
        } catch (error) {
            console.error('Error updating parent:', error);
        }
    };

    const renderProfileFields = () => {
        if (!user?.ProfileId) {
            return (
                <Alert severity="info" sx={{ mt: 2 }}>
                    Tài khoản {accountData.role === 'admin' ? 'Admin' : 'này'} không có thông tin profile liên kết
                </Alert>
            );
        }

        if (loading || !profileLoaded) {
            return (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                    <CircularProgress />
                </Box>
            );
        }

        if (accountData.role === 'driver') {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1976d2', mb: 2 }}>
                        🚗 Thông tin tài xế
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Mã tài xế"
                                fullWidth
                                value={profileData.driverId}
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: '#1976d2', fontSize: '0.875rem' }}>
                                            🚗
                                        </Avatar>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Họ và tên"
                                fullWidth
                                value={profileData.fullName}
                                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Mã bằng lái"
                                fullWidth
                                value={profileData.maBangLai}
                                onChange={(e) => setProfileData({ ...profileData, maBangLai: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                value={profileData.phoneNumber}
                                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Trạng thái</InputLabel>
                                <Select
                                    value={profileData.isActive}
                                    label="Trạng thái"
                                    onChange={(e) => setProfileData({ ...profileData, isActive: e.target.value })}
                                >
                                    <MenuItem value={1}>✅ Hoạt động</MenuItem>
                                    <MenuItem value={0}>❌ Không hoạt động</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            );
        } else if (accountData.role === 'parent') {
            return (
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#4caf50', mb: 2 }}>
                        👨‍👩‍👧 Thông tin phụ huynh
                    </Typography>
                    
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Mã phụ huynh"
                                fullWidth
                                value={profileData.parentId}
                                disabled
                                InputProps={{
                                    startAdornment: (
                                        <Avatar sx={{ width: 28, height: 28, mr: 1, bgcolor: '#4caf50', fontSize: '0.875rem' }}>
                                            👨‍👩‍👧
                                        </Avatar>
                                    )
                                }}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Họ và tên"
                                fullWidth
                                value={profileData.parentName}
                                onChange={(e) => setProfileData({ ...profileData, parentName: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                label="Số điện thoại"
                                fullWidth
                                value={profileData.parentPhone}
                                onChange={(e) => setProfileData({ ...profileData, parentPhone: e.target.value })}
                                required
                            />
                        </Grid>
                    </Grid>
                </Box>
            );
        }

        return null;
    };

    return (
        <Dialog 
            open={open} 
            onClose={handleCloseDialog} 
            maxWidth="md" 
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: '16px',
                    boxShadow: '0 8px 32px rgba(0, 151, 167, 0.3)'
                }
            }}
        >
            <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                        ✏️
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Chỉnh sửa tài khoản
                    </Typography>
                </Box>
                <IconButton 
                    size="small" 
                    onClick={handleCloseDialog}
                    sx={{ 
                        color: 'white',
                        '&:hover': { background: 'rgba(255,255,255,0.2)' }
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,232,0.9) 100%)' }}>
                <Box sx={{ mt: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#ff9800', mb: 2 }}>
                        🔐 Thông tin đăng nhập
                    </Typography>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Username"
                                fullWidth
                                value={accountData.username}
                                onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                                required
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Password mới (để trống nếu không đổi)"
                                type="password"
                                fullWidth
                                value={accountData.password}
                                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                                placeholder="Nhập password mới"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth disabled>
                                <InputLabel>Vai trò</InputLabel>
                                <Select
                                    value={accountData.role}
                                    label="Vai trò"
                                >
                                    <MenuItem value="admin">👨‍💼 Quản trị viên</MenuItem>
                                    <MenuItem value="driver">🚗 Tài xế</MenuItem>
                                    <MenuItem value="parent">👨‍👩‍👧 Phụ huynh</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    {renderProfileFields()}
                </Box>
            </DialogContent>

            <DialogActions sx={{ 
                p: 2.5, 
                gap: 1.5,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,248,232,0.9) 100%)',
                borderTop: '1px solid rgba(255,152,0,0.1)'
            }}>
                <Button 
                    onClick={handleCloseDialog}
                    variant="outlined"
                    disabled={loading}
                    sx={{
                        borderColor: '#ff9800',
                        color: '#ff9800',
                        '&:hover': {
                            borderColor: '#f57c00',
                            background: 'rgba(255,152,0,0.05)'
                        }
                    }}
                >
                    Hủy
                </Button>

                <Button 
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{
                        background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                        '&:hover': {
                            background: 'linear-gradient(135deg, #f57c00 0%, #e65100 100%)'
                        }
                    }}
                >
                    {loading ? <CircularProgress size={24} color="inherit" /> : '💾 Cập nhật'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUserModal;
