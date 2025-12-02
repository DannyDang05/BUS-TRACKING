import React, { useState } from 'react';
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
    Stepper,
    Step,
    StepLabel,
    Alert,
    Avatar,
    IconButton
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

const CreateUserWizard = ({ open, onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState(0);
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

    const steps = ['Thông tin tài khoản', 'Thông tin chi tiết'];

    const generateRandomId = (prefix, length = 6) => {
        const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let id = prefix;
        for (let i = 0; i < length; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };

    const handleNext = () => {
        if (activeStep === 0) {
            if (!accountData.username || !accountData.password) {
                toast.error('Vui lòng điền đầy đủ thông tin tài khoản');
                return;
            }
            
            // Auto generate ID when moving to step 2
            if (accountData.role === 'driver' && !profileData.driverId) {
                setProfileData(prev => ({ ...prev, driverId: generateRandomId('DRV', 6) }));
            } else if (accountData.role === 'parent' && !profileData.parentId) {
                setProfileData(prev => ({ ...prev, parentId: generateRandomId('PH', 6) }));
            }
        }
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleCloseDialog = () => {
        setActiveStep(0);
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
        onClose();
    };

    const validateStep2 = () => {
        if (accountData.role === 'driver') {
            if (!profileData.driverId || !profileData.fullName || !profileData.maBangLai || !profileData.phoneNumber) {
                toast.error('Vui lòng điền đầy đủ thông tin tài xế');
                return false;
            }
        } else if (accountData.role === 'parent') {
            if (!profileData.parentId || !profileData.parentName || !profileData.parentPhone) {
                toast.error('Vui lòng điền đầy đủ thông tin phụ huynh');
                return false;
            }
        }
        return true;
    };

    const handleSubmit = async () => {
        if (accountData.role === 'admin') {
            // Admin không cần profile
            await createAccount(null);
        } else {
            if (!validateStep2()) return;
            
            // Tạo profile trước (driver hoặc parent)
            let profileId = null;
            
            if (accountData.role === 'driver') {
                profileId = await createDriver();
            } else if (accountData.role === 'parent') {
                profileId = await createParent();
            }
            
            if (profileId) {
                const userId = await createAccount(profileId);
                // Nếu là parent, cập nhật UserId vào bảng phuhuynh
                if (userId && accountData.role === 'parent') {
                    await updateParentUserId(profileId, userId);
                }
            }
        }
    };

    const createDriver = async () => {
        try {
            const response = await fetch('http://localhost:6969/api/v1/drivers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    Id: profileData.driverId,
                    FullName: profileData.fullName,
                    MaBangLai: profileData.maBangLai,
                    PhoneNumber: profileData.phoneNumber,
                    IsActive: profileData.isActive
                })
            });

            const data = await response.json();
            if (data.errorCode === 0) {
                return profileData.driverId;
            } else {
                toast.error(data.message || 'Lỗi tạo tài xế');
                return null;
            }
        } catch (error) {
            console.error('Error creating driver:', error);
            toast.error('Lỗi khi tạo tài xế');
            return null;
        }
    };

    const createParent = async () => {
        try {
            const response = await fetch('http://localhost:6969/api/v1/parent/s', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    MaPhuHuynh: profileData.parentId,
                    HoTen: profileData.parentName,
                    SoDienThoai: profileData.parentPhone,
                    Nhanthongbao: 1
                })
            });

            const data = await response.json();
            if (data.errorCode === 0) {
                return profileData.parentId;
            } else {
                toast.error(data.message || 'Lỗi tạo phụ huynh');
                return null;
            }
        } catch (error) {
            console.error('Error creating parent:', error);
            toast.error('Lỗi khi tạo phụ huynh');
            return null;
        }
    };

    const updateParentUserId = async (parentId, userId) => {
        try {
            const response = await fetch(`http://localhost:6969/api/v1/parent/s/${parentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    UserId: userId
                })
            });

            const data = await response.json();
            if (data.errorCode !== 0) {
                console.error('Error updating parent UserId:', data.message);
            }
        } catch (error) {
            console.error('Error updating parent UserId:', error);
        }
    };

    const createAccount = async (profileId) => {
        try {
            const response = await fetch('http://localhost:6969/api/v1/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: accountData.username,
                    password: accountData.password,
                    role: accountData.role,
                    profileId: profileId
                })
            });

            const data = await response.json();
            if (data.errorCode === 0) {
                toast.success('Tạo tài khoản thành công!');
                handleCloseDialog();
                onSuccess && onSuccess();
                return data.userId; // Trả về userId để cập nhật vào parent
            } else {
                toast.error(data.message || 'Lỗi tạo tài khoản');
                return null;
            }
        } catch (error) {
            console.error('Error creating account:', error);
            toast.error('Lỗi khi tạo tài khoản');
            return null;
        }
    };

    const renderStep1 = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
                Bước 1: Nhập thông tin đăng nhập và chọn vai trò
            </Alert>

            <TextField
                label="Username"
                fullWidth
                value={accountData.username}
                onChange={(e) => setAccountData({ ...accountData, username: e.target.value })}
                required
                placeholder="Nhập tên đăng nhập"
            />

            <TextField
                label="Password"
                type="password"
                fullWidth
                value={accountData.password}
                onChange={(e) => setAccountData({ ...accountData, password: e.target.value })}
                required
                placeholder="Nhập mật khẩu"
            />

            <FormControl fullWidth required>
                <InputLabel>Vai trò</InputLabel>
                <Select
                    value={accountData.role}
                    label="Vai trò"
                    onChange={(e) => setAccountData({ ...accountData, role: e.target.value })}
                >
                    <MenuItem value="admin">👨‍💼 Quản trị viên</MenuItem>
                    <MenuItem value="driver">🚗 Tài xế</MenuItem>
                    <MenuItem value="parent">👨‍👩‍👧 Phụ huynh</MenuItem>
                </Select>
            </FormControl>

            <Alert severity="warning">
                {accountData.role === 'admin' && '⚠️ Admin không cần thông tin bổ sung'}
                {accountData.role === 'driver' && '➡️ Bước tiếp theo: Nhập thông tin tài xế'}
                {accountData.role === 'parent' && '➡️ Bước tiếp theo: Nhập thông tin phụ huynh'}
            </Alert>
        </Box>
    );

    const renderStep2Driver = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
                <strong>Bước 2: Thông tin tài xế</strong>
            </Alert>

            <TextField
                label="Mã tài xế"
                fullWidth
                value={profileData.driverId}
                onChange={(e) => setProfileData({ ...profileData, driverId: e.target.value })}
                required
                placeholder="VD: DRV001"
                helperText="Mã được tự động tạo, bạn có thể chỉnh sửa"
                InputProps={{
                    startAdornment: (
                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#1976d2' }}>🚗</Avatar>
                    )
                }}
            />

            <TextField
                label="Họ và tên"
                fullWidth
                value={profileData.fullName}
                onChange={(e) => setProfileData({ ...profileData, fullName: e.target.value })}
                required
                placeholder="Nhập họ tên tài xế"
            />

            <TextField
                label="Mã bằng lái"
                fullWidth
                value={profileData.maBangLai}
                onChange={(e) => setProfileData({ ...profileData, maBangLai: e.target.value })}
                required
                placeholder="VD: B2-12345678"
            />

            <TextField
                label="Số điện thoại"
                fullWidth
                value={profileData.phoneNumber}
                onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                required
                placeholder="VD: 0912345678"
            />

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
        </Box>
    );

    const renderStep2Parent = () => (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, mt: 2 }}>
            <Alert severity="info" sx={{ mb: 1 }}>
                <strong>Bước 2: Thông tin phụ huynh</strong>
            </Alert>

            <TextField
                label="Mã phụ huynh"
                fullWidth
                value={profileData.parentId}
                onChange={(e) => setProfileData({ ...profileData, parentId: e.target.value })}
                required
                placeholder="VD: PH001"
                helperText="Mã được tự động tạo, bạn có thể chỉnh sửa"
                InputProps={{
                    startAdornment: (
                        <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#4caf50' }}>👨‍👩‍👧</Avatar>
                    )
                }}
            />

            <TextField
                label="Họ và tên"
                fullWidth
                value={profileData.parentName}
                onChange={(e) => setProfileData({ ...profileData, parentName: e.target.value })}
                required
                placeholder="Nhập họ tên phụ huynh"
            />

            <TextField
                label="Số điện thoại"
                fullWidth
                value={profileData.parentPhone}
                onChange={(e) => setProfileData({ ...profileData, parentPhone: e.target.value })}
                required
                placeholder="VD: 0912345678"
            />

            <Alert severity="success" sx={{ mt: 1 }}>
                ✅ UserId sẽ được tự động liên kết sau khi tạo tài khoản
            </Alert>
        </Box>
    );

    const renderStep2 = () => {
        if (accountData.role === 'admin') {
            return (
                <Box sx={{ mt: 2 }}>
                    <Alert severity="success">
                        ✅ Tài khoản Admin không cần thông tin bổ sung. Nhấn "Tạo tài khoản" để hoàn tất.
                    </Alert>
                </Box>
            );
        } else if (accountData.role === 'driver') {
            return renderStep2Driver();
        } else if (accountData.role === 'parent') {
            return renderStep2Parent();
        }
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
                background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                        ➕
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        Tạo tài khoản mới
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

            <DialogContent sx={{ p: 3, background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(232,244,248,0.9) 100%)' }}>
                <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 2 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>

                {activeStep === 0 ? renderStep1() : renderStep2()}
            </DialogContent>

            <DialogActions sx={{ 
                p: 2.5, 
                gap: 1.5,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(232,244,248,0.9) 100%)',
                borderTop: '1px solid rgba(0,151,167,0.1)'
            }}>
                <Button 
                    onClick={handleCloseDialog}
                    variant="outlined"
                    sx={{
                        borderColor: '#0097a7',
                        color: '#0097a7',
                        '&:hover': {
                            borderColor: '#00838f',
                            background: 'rgba(0,151,167,0.05)'
                        }
                    }}
                >
                    Hủy
                </Button>
                
                {activeStep > 0 && (
                    <Button 
                        onClick={handleBack}
                        variant="outlined"
                    >
                        Quay lại
                    </Button>
                )}

                {activeStep === 0 && accountData.role !== 'admin' && (
                    <Button 
                        onClick={handleNext}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)'
                            }
                        }}
                    >
                        Tiếp theo ➡️
                    </Button>
                )}

                {(activeStep === 1 || (activeStep === 0 && accountData.role === 'admin')) && (
                    <Button 
                        onClick={activeStep === 0 && accountData.role === 'admin' ? handleSubmit : handleSubmit}
                        variant="contained"
                        sx={{
                            background: 'linear-gradient(135deg, #4caf50 0%, #388e3c 100%)',
                            '&:hover': {
                                background: 'linear-gradient(135deg, #388e3c 0%, #2e7d32 100%)'
                            }
                        }}
                    >
                        ✅ Tạo tài khoản
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default CreateUserWizard;
