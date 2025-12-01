import {
    FaRedo,
    FaUserCircle,
    FaInfo
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Badge } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Driver.scss'
import DialogInfo from './DialogInfo';
import DriverNotification from './DriverNotification';

import { IoIosRefresh } from "react-icons/io";
import { IoNotificationsOutline } from "react-icons/io5";
import { getDriverNotifications } from '../../service/apiService';

const HeaderDriver = (props) => {
    const [infoModal, setInfoModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);
    const navigate = useNavigate();
    
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('bus_user'));
    // Driver có thể lưu ở driverId hoặc profileId tùy backend trả về
    const driverId = user?.driverId || user?.profileId || null;
    console.log('🚗 HeaderDriver - User from localStorage:', user);
    console.log('🚗 HeaderDriver - Driver ID:', driverId);
    let userName = 'Jane Doe';
    try {
      if (user && user.fullName) userName = user.fullName;
      else if (user && user.username) userName = user.username;
    } catch {}

    // Request notification permission
    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Hiển thị browser notification
    const showToast = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Bus Tracking - Driver', {
                body: message,
                icon: '/favicon.ico',
            });
        }
    };

    const getNotificationIcon = (type) => {
        const typeStr = String(type || '').toLowerCase();
        if (typeStr.includes('vắng mặt') || typeStr.includes('absent')) return '👤';
        if (typeStr.includes('sự cố') || typeStr.includes('issue')) return '⚠️';
        if (typeStr.includes('khẩn cấp') || typeStr.includes('emergency')) return '🚨';
        if (typeStr.includes('nhiệm vụ') || typeStr.includes('assignment')) return '📋';
        if (typeStr.includes('hoàn thành') || typeStr.includes('completed')) return '✅';
        if (typeStr.includes('bắt đầu') || typeStr.includes('start')) return '🚌';
        return '📢';
    };

    // Fetch unread count and show toast for new notifications
    useEffect(() => {
        if (!driverId) return;
        
        const fetchUnreadCount = async () => {
            try {
                const response = await getDriverNotifications(driverId, 1, 20);
                const notifs = response.data || [];
                const count = notifs.filter(n => !n.is_read).length;
                
                if (notifs.length > previousCount && notifs.length > 0 && previousCount !== 0) {
                    const latestNotif = notifs[0];
                    showToast(`${getNotificationIcon(latestNotif.type)} ${latestNotif.message}`);
                }

                setUnreadCount(count);
                setPreviousCount(notifs.length);
            } catch (err) {
                console.error('Error fetching notifications:', err);
            }
        };

        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, [driverId, previousCount]);

    // Hàm refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    const handleLogout = (popupState) => {
        // Clear localStorage
        localStorage.removeItem('bus_user');
        localStorage.removeItem('bus_token');
        
        // Close menu
        popupState.close();
        
        // Redirect to login
        toast.success('Đăng xuất thành công!');
        navigate('/login');
    };

    return (
        <div className="header-container">
            <div className="header-right">
                {/* Refresh Button */}
                <div 
                    className="header-action-item" 
                    role="button" 
                    title="Refresh" 
                    onClick={handleRefresh}
                    style={{ cursor: 'pointer' }}
                >
                    <IoIosRefresh className="action-icon" />
                </div>

                {/* Notification Bell */}
                <PopupState variant="popover" popupId="notification-menu">
                    {(notificationPopupState) => (
                        <React.Fragment>
                            <div
                                className="header-action-item"
                                role="button"
                                title="Thông báo"
                                {...bindTrigger(notificationPopupState)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Badge badgeContent={unreadCount} color="error">
                                    <IoNotificationsOutline className="action-icon" />
                                </Badge>
                            </div>

                            {/* Notification Menu */}
                            <DriverNotification popupState={notificationPopupState} />
                        </React.Fragment>
                    )}
                </PopupState>

                {/* User Profile Menu */}
                <PopupState variant="popover" popupId="user-profile-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <div
                                className="header-user-profile"
                                {...bindTrigger(popupState)}
                            >
                                <FaUserCircle className="user-avatar-icon" />
                                <span className="user-name">{userName}</span>
                            </div>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => { setInfoModal(true); popupState.close(); }}>
                                    <FaInfo size="1.2em" className="power-off" /> Thông tin
                                </MenuItem>
                                <MenuItem onClick={() => handleLogout(popupState)}>
                                    <FaPowerOff size="1.2em" className="power-off" /> Đăng xuất
                                </MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
            <DialogInfo infoModal={infoModal} setInfoModal={setInfoModal} />
        </div>
    );
};
export default HeaderDriver;