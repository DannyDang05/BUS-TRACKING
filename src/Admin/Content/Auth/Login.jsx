
import * as React from 'react';
import './Login.scss';
import { AppProvider, SignInPage } from '@toolpad/core';
import { useTheme } from '@mui/material/styles';
import { loginAPI } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const providers = [{ id: 'credentials', name: 'Username and password' }];

const Login = () => {
    const theme = useTheme();
    const navigate = useNavigate();

    // Đăng nhập thực tế

    const signIn = async (provider, formData) => {
        // Lấy username từ field "username" (không phải email)
        const username = formData?.get('username') || formData?.get('email');
        const password = formData?.get('password');
        if (!username || !password) {
            toast.error('Vui lòng nhập đầy đủ tài khoản và mật khẩu!');
            return { error: 'Missing credentials' };
        }
        try {
            const res = await loginAPI({ username, password });
            // res: { errorCode, message, token, user }
            if (res && res.token && res.user) {
                localStorage.setItem('bus_token', res.token);
                localStorage.setItem('bus_user', JSON.stringify(res.user));
                
                // Lưu thông tin riêng cho tài xế
                if (res.user.role === 'driver' && res.user.driverId) {
                    localStorage.setItem('driver_id', res.user.driverId);
                    localStorage.setItem('driver_name', res.user.driverName || '');
                }
                
                toast.success('Đăng nhập thành công!');
                // Điều hướng theo role
                if (res.user.role === 'admin' || res.user.Role === 'admin') {
                    setTimeout(() => navigate('/'), 800);
                } else if (res.user.role === 'driver' || res.user.Role === 'driver') {
                    setTimeout(() => navigate('/driver'), 800);
                } else {
                    setTimeout(() => navigate('/'), 800);
                }
                return { ok: true };
            } else {
                toast.error(res?.message || 'Đăng nhập thất bại!');
                return { error: res?.message || 'Login failed' };
            }
        } catch (err) {
            toast.error(err?.message || 'Đăng nhập thất bại!');
            return { error: err?.message || 'Login failed' };
        }
    };

    return (
        <div className="login-root">
            <AppProvider theme={theme}>
                <SignInPage
                    signIn={signIn}
                    providers={providers}
                    slotProps={{
                        emailField: { name: 'username', label: 'Username', placeholder: 'likijoong1', autoFocus: true, type: 'text', inputMode: 'text' },
                        form: { noValidate: true },
                        errorAlert: { style: { display: 'none' } } // Ẩn alert lỗi mặc định
                    }}
                />
            </AppProvider>
        </div>
    );
};

export default Login;
