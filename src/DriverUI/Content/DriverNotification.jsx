import React, { useEffect, useState } from 'react';
import {
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button,
    Stack,
    CircularProgress
} from '@mui/material';
import { bindMenu } from 'material-ui-popup-state';
import { getDriverNotifications, markDriverNotificationRead, markAllDriverNotificationsRead } from '../../service/apiService';

// Yêu cầu permission cho browser notification
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

const DriverNotification = ({ popupState }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);
    
    // Lấy driverId từ localStorage
    const user = JSON.parse(localStorage.getItem('bus_user'));
    // Driver có thể lưu ở driverId hoặc profileId tùy backend trả về
    const driverId = user?.driverId || user?.profileId || null;
    console.log('🔔 DriverNotification - User:', user);
    console.log('🔔 DriverNotification - Driver ID:', driverId);
    console.log('🔔 DriverNotification - Popup is open:', popupState.isOpen);

    // Fetch ngay khi component mount (lần đầu)
    useEffect(() => {
        if (driverId) {
            console.log('🎯 Initial fetch on mount');
            fetchNotificationsQuietly();
        }
    }, []);

    // Fetch khi mở popup
    useEffect(() => {
        if (popupState.isOpen && driverId) {
            console.log('🎯 Fetch when popup opened');
            fetchNotifications();
        }
    }, [popupState.isOpen]);
    
    // Auto-refresh mỗi 30s
    useEffect(() => {
        if (!driverId) return;
        
        const interval = setInterval(() => {
            fetchNotificationsQuietly();
        }, 30000); // 30 giây
        
        return () => clearInterval(interval);
    }, [driverId, previousCount]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching notifications for driver:', driverId);
            const response = await getDriverNotifications(driverId, 1, 10);
            console.log('📦 API Response:', response);
            const notifs = response.data || [];
            console.log(`✅ Received ${notifs.length} notifications:`, notifs);
            setNotifications(notifs);
            const newUnreadCount = notifs.filter(n => !n.is_read).length;
            setUnreadCount(newUnreadCount);
            setPreviousCount(notifs.length);
        } catch (err) {
            console.error('❌ Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch im lặng cho polling (không hiển thị loading)
    const fetchNotificationsQuietly = async () => {
        try {
            const response = await getDriverNotifications(driverId, 1, 10);
            const notifs = response.data || [];
            const newUnreadCount = notifs.filter(n => !n.is_read).length;
            
            console.log(`🔄 Polling: ${notifs.length} notifications, ${newUnreadCount} unread`);
            
            // Nếu có thông báo mới hơn trước
            if (notifs.length > previousCount && notifs.length > 0) {
                console.log('🆕 New notification detected!');
                const latestNotif = notifs[0];
                showBrowserNotification(`${getNotificationIcon(latestNotif.type)} ${latestNotif.message}`);
            }
            
            setNotifications(notifs);
            setUnreadCount(newUnreadCount);
            setPreviousCount(notifs.length);
        } catch (err) {
            console.error('❌ Error fetching notifications quietly:', err);
        }
    };
    
    // Hiển thị browser notification
    const showBrowserNotification = (message) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Bus Tracking - Driver', {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
        console.log(`🔔 ${message}`);
    };

    const handleMarkRead = async (notificationId) => {
        try {
            await markDriverNotificationRead(notificationId);
            // Update local state
            setNotifications(prev => 
                prev.map(n => n.notification_id === notificationId ? { ...n, is_read: 1 } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('❌ Error marking notification read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await markAllDriverNotificationsRead(driverId);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
            setUnreadCount(0);
        } catch (err) {
            console.error('❌ Error marking all read:', err);
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
        if (typeStr.includes('thay đổi') || typeStr.includes('change')) return '🔄';
        return '📢';
    };

    const getTimeAgo = (createdAt) => {
        const now = new Date();
        const created = new Date(createdAt);
        const diffMs = now - created;
        const diffMins = Math.floor(diffMs / 60000);
        
        if (diffMins < 1) return 'Vừa xong';
        if (diffMins < 60) return `${diffMins} phút trước`;
        
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours} giờ trước`;
        
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays} ngày trước`;
    };

    return (
        <Menu
            {...bindMenu(popupState)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{
                sx: {
                    mt: 1.5,
                    width: '400px',
                    maxWidth: '95vw',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    maxHeight: '80vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 0
                }
            }}
        >
            {/* Header */}
            <Box sx={{ px: 2, py: 1.5, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    Thông báo
                </Typography>
                {unreadCount > 0 && (
                    <Button 
                        variant="text" 
                        color="primary" 
                        size="small"
                        onClick={handleMarkAllRead}
                        sx={{
                            fontSize: '0.8rem',
                            px: 1,
                            py: 0.5
                        }}
                    >
                        Đọc hết ({unreadCount})
                    </Button>
                )}
            </Box>
            <Divider />

            {/* Scrollable Content */}
            <Box sx={{ 
                flex: 1,
                overflowY: 'auto',
                maxHeight: '500px',
                px: 1,
                py: 1,
                '&::-webkit-scrollbar': {
                    width: '8px'
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555'
                }
            }}>
                {/* Loading */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
                        <CircularProgress size={30} />
                    </Box>
                )}

                {/* Notifications List */}
                {!loading && notifications.length === 0 && (
                    <Typography sx={{ px: 2, py: 3, color: 'text.secondary', textAlign: 'center' }}>
                        Không có thông báo mới
                    </Typography>
                )}

                {!loading && notifications.map((notification) => (
                <MenuItem 
                    key={notification.notification_id} 
                    onClick={() => {
                        if (!notification.is_read) {
                            handleMarkRead(notification.notification_id);
                        }
                    }}
                    sx={{
                        borderRadius: '8px',
                        mb: 1,
                        p: 1.5,
                        backgroundColor: notification.is_read ? 'background.paper' : '#E3F2FD',
                        border: notification.is_read ? '1px solid #E0E0E0' : '1px solid #2196F3',
                        '&:hover': {
                            backgroundColor: notification.is_read ? 'action.hover' : '#BBDEFB',
                            transform: 'translateX(4px)',
                            transition: 'all 0.2s'
                        },
                        whiteSpace: 'normal',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}
                >
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                        <Typography fontSize="18px">
                            {getNotificationIcon(notification.type)}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                fontWeight: 'bold', 
                                color: notification.is_read ? 'text.secondary' : 'primary.dark' 
                            }}
                        >
                            {notification.type || 'Thông báo'}
                        </Typography>
                    </Stack>
                    <Typography 
                        variant="body2" 
                        sx={{ 
                            color: notification.is_read ? 'text.secondary' : 'text.primary', 
                            lineHeight: 1.5,
                            pl: 3.5,
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        {notification.message}
                    </Typography>
                    <Typography 
                        variant="caption" 
                        color="text.disabled"
                        sx={{ mt: 1, alignSelf: 'flex-end' }}
                    >
                        {getTimeAgo(notification.created_at)}
                    </Typography>
                </MenuItem>
                ))}
            </Box>

            <Divider />
            <Box sx={{ p: 1, textAlign: 'center', flexShrink: 0 }}>
                <Button 
                    variant="text" 
                    size="small" 
                    onClick={() => {
                        popupState.close();
                    }}
                >
                    Xem tất cả
                </Button>
            </Box>
        </Menu>
    );
};

export default DriverNotification;
