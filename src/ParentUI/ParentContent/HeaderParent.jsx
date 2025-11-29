import {
    FaUserCircle,
    FaInfo
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Badge } from '@mui/material';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Parent.scss'
import ParentDialogInfo from './ParentDialogInfo';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosRefresh } from "react-icons/io";
import ParentNotification from './ParentNotification';
import { getParentNotifications, getParentInfo } from '../../service/apiService';

const HeaderParent = (props) => {
    const navigate = useNavigate();
    // Chỉ giữ state cho Dialog (sử dụng truyền props)
    const [infoModal, setInfoModal] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);
    const [parentName, setParentName] = useState('');
    
    const user = JSON.parse(localStorage.getItem('bus_user'));
    const parentId = user?.profileId || null;

    const getNotificationIcon = (type) => {
        const typeStr = String(type || '').toLowerCase();
        if (typeStr.includes('gần') || typeStr.includes('approaching')) return '⚠️';
        if (typeStr.includes('đến') || typeStr.includes('arrived')) return '🎉';
        if (typeStr.includes('trễ') || typeStr.includes('delay')) return '⏰';
        if (typeStr.includes('hoàn thành') || typeStr.includes('completed')) return '✅';
        if (typeStr.includes('bắt đầu') || typeStr.includes('start')) return '🚌';
        return '📢';
    };

    const showToast = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Bus Tracking', {
                body: message,
                icon: '/favicon.ico',
            });
        }
    };

    useEffect(() => {
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }, []);

    // Lấy thông tin phụ huynh
    useEffect(() => {
        if (!parentId) return;
        
        const fetchParentInfo = async () => {
            try {
                const response = await getParentInfo(parentId);
                console.log('Parent Info Response:', response); // Debug
                if (response.errorCode === 0 && response.data) {
                    setParentName(response.data.FullName || 'Phụ huynh');
                }
            } catch (err) {
                console.error('Error fetching parent info:', err);
                setParentName('Phụ huynh');
            }
        };

        fetchParentInfo();
    }, [parentId]);

    useEffect(() => {
        if (!parentId) return;
        
        const fetchUnreadCount = async () => {
            try {
                const response = await getParentNotifications(parentId, 1, 20);
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
    }, [parentId, previousCount]);

    // Hàm refresh
    const handleRefresh = () => {
        window.location.reload();
    };

    // Hàm đăng xuất
    const handleLogout = (popupState) => {
        popupState.close();
        localStorage.removeItem('bus_token');
        localStorage.removeItem('bus_user');
        toast.success('Đăng xuất thành công!');
        navigate('/login');
    };


    return (
        <div className="parent-container">
            <div className="header-container">
                <div className="header-right">

                    {/* Refresh Button */}
                    <div 
                        className="header-action-item" 
                        role="button" 
                        title="Refresh" 
                        onClick={handleRefresh} // Gắn hàm refresh
                        style={{ cursor: 'pointer' }}
                    >
                        <IoIosRefresh className="action-icon" />
                    </div>

                    {/* KHỐI 1: POPUPSTATE CHO THÔNG BÁO */}
                    <PopupState variant="popover" popupId="notification-menu">
                        {(notificationPopupState) => (
                            <React.Fragment>
                                <div
                                    className="header-action-item"
                                    role="button"
                                    title="Thông báo"
                                    {...bindTrigger(notificationPopupState)} // Gắn trigger
                                    style={{ cursor: 'pointer' }}
                                >
                                    <Badge badgeContent={unreadCount} color="error">
                                        <IoNotificationsOutline className="action-icon" />
                                    </Badge>
                                </div>

                                {/* TRUYỀN POPUPSTATE XUỐNG ĐỂ MỞ MENU */}
                                <ParentNotification popupState={notificationPopupState} />
                            </React.Fragment>
                        )}
                    </PopupState>

                    {/* KHỐI 2: POPUPSTATE CHO PROFILE MENU */}
                    <PopupState variant="popover" popupId="user-profile-menu">
                        {(popupState) => (
                            <React.Fragment>
                                <div
                                    className="header-user-profile"
                                    {...bindTrigger(popupState)}
                                >
                                    <FaUserCircle className="user-avatar-icon" />
                                    <span className="user-name">{parentName || 'Phụ huynh'}</span>
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
            </div>
            {/* Dialog thông tin (Vẫn dùng truyền props truyền thống) */}
            <ParentDialogInfo infoModal={infoModal} setInfoModal={setInfoModal} />
        </div>
    );
};
export default HeaderParent;