import React, { useEffect, useState } from 'react';
import {
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button,
    Stack,
    Badge,
    CircularProgress
} from '@mui/material';
import { bindMenu } from 'material-ui-popup-state';
import { getParentNotifications, markNotificationRead, markAllNotificationsRead } from '../../service/apiService';

// Yêu cầu permission cho browser notification
if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
}

const ParentNotification = ({ popupState }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [previousCount, setPreviousCount] = useState(0);
    
    // Lấy parentId từ localStorage
    const user = JSON.parse(localStorage.getItem('bus_user'));
    const parentId = user?.profileId || null;

    // Fetch khi mở popup
    useEffect(() => {
        if (popupState.isOpen) {
            fetchNotifications();
        }
    }, [popupState.isOpen]);
    
    // Auto-refresh mỗi 30s và hiển thị toast khi có thông báo mới
    useEffect(() => {
        if (!parentId) return;
        
        const interval = setInterval(() => {
            fetchNotificationsQuietly();
        }, 30000); // 30 giây
        
        return () => clearInterval(interval);
    }, [parentId, previousCount]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            console.log('🔍 Fetching notifications for parent:', parentId);
            const response = await getParentNotifications(parentId, 1, 10);
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
            const response = await getParentNotifications(parentId, 1, 10);
            const notifs = response.data || [];
            const newUnreadCount = notifs.filter(n => !n.is_read).length;
            
            console.log(`🔄 Polling: ${notifs.length} notifications, ${newUnreadCount} unread`);
            
            // Nếu có thông báo mới hơn trước
            if (notifs.length > previousCount && notifs.length > 0) {
                console.log('🆕 New notification detected!');
                // Toast handled by HeaderParent
            }
            
            setNotifications(notifs);
            setUnreadCount(newUnreadCount);
            setPreviousCount(notifs.length);
        } catch (err) {
            console.error('❌ Error fetching notifications quietly:', err);
        }
    };
    
    // Hiển thị toast notification
    const showToast = (message, type = 'info') => {
        // Sử dụng browser notification API
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Bus Tracking', {
                body: message,
                icon: '/favicon.ico',
                badge: '/favicon.ico'
            });
        }
        // TODO: Nếu có toast library (react-toastify), sử dụng ở đây
        console.log(`🔔 ${message}`);
    };

    const handleMarkRead = async (notificationId) => {
        try {
            await markNotificationRead(notificationId);
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
            await markAllNotificationsRead(parentId);
            setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
            setUnreadCount(0);
        } catch (err) {
            console.error('❌ Error marking all read:', err);
        }
    };

    const getNotificationIcon = (type) => {
        const typeStr = String(type || '').toLowerCase();
        if (typeStr.includes('gần') || typeStr.includes('approaching')) return '⚠️';
        if (typeStr.includes('đến') || typeStr.includes('arrived')) return '🎉';
        if (typeStr.includes('trễ') || typeStr.includes('delay')) return '⏰';
        if (typeStr.includes('hoàn thành') || typeStr.includes('completed')) return '✅';
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
                px: 1,
                py: 1,
                '&::-webkit-scrollbar': {
                    width: '6px'
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#BDBDBD',
                    borderRadius: '10px'
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#9E9E9E'
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
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical'
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
                        // Navigate to full notifications page if exists
                    }}
                >
                    Xem tất cả
                </Button>
            </Box>
        </Menu>
    );
};

export default ParentNotification;