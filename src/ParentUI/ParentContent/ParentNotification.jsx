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

const ParentNotification = ({ popupState }) => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    
    // Giả sử parentId từ localStorage hoặc auth context
    const parentId = 'PH001'; // Thay bằng giá trị thật

    useEffect(() => {
        if (popupState.isOpen) {
            fetchNotifications();
        }
    }, [popupState.isOpen]);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await getParentNotifications(parentId, 1, 20);
            const notifs = response.data || [];
            setNotifications(notifs);
            setUnreadCount(notifs.filter(n => !n.is_read).length);
        } catch (err) {
            console.error('❌ Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
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
                    width: '380px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    maxHeight: '500px',
                    overflowY: 'auto',
                    p: 1
                }
            }}
        >
            {/* Header */}
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Thông báo
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={handleMarkAllRead} 
                    disabled={unreadCount === 0} 
                    sx={{
                        borderRadius: '20px',
                        minWidth: '80px',
                        fontSize: '0.75rem',
                        px: 1.5,
                        py: 0.5
                    }}
                >
                    {unreadCount > 0 ? (
                        <Badge badgeContent={unreadCount} color="error" sx={{ mr: 1 }}>
                            <span style={{ fontSize: '0.75rem' }}>Đọc tất cả</span>
                        </Badge>
                    ) : 'Đã đọc hết'}
                </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />

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
                            lineHeight: 1.4,
                            pl: 3.5
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

            <Divider sx={{ mt: 1 }} />
            <Box sx={{ p: 1, textAlign: 'center' }}>
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