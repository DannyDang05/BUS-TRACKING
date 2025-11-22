import React from 'react';
import {
    Menu,
    MenuItem,
    Typography,
    Box,
    Divider,
    Button,
    Stack
} from '@mui/material';
// Thêm import bindMenu
import { bindMenu } from 'material-ui-popup-state'; // <--- Cần import này

// DỮ LIỆU THÔNG BÁO TĨNH (Giữ nguyên)
const mockNotifications = [
    {
        id: 1,
        type: 'Chuyến đi',
        message: 'Tuyến "Tuyến 1 - Sáng" đã hoàn thành chuyến đi. Cảm ơn quý phụ huynh đã tin tưởng!',
        timeString: '5 phút trước', 
        isRead: false
    },
    {
        id: 2,
        type: 'Vị trí',
        message: 'Xe buýt đang ở gần điểm đón "Tòa nhà B" (cách 100m). Vui lòng chuẩn bị cho con...',
        timeString: '15 phút trước', 
        isRead: false
    },
    {
        id: 3,
        type: 'Cảnh báo',
        message: 'Xe buýt đang ở gần điểm đón "Nhà Thờ Đức Bà" (cách 45m). Vui lòng chuẩn bị cho con Nguyễn Văn Hùng!',
        timeString: '30 phút trước', 
        isRead: true 
    },
    {
        id: 4,
        type: 'Quản trị',
        message: 'Hệ thống đã được nâng cấp với nhiều tính năng mới.',
        timeString: '1 giờ trước', 
        isRead: false
    },
    {
        id: 5,
        type: 'Sự cố',
        message: 'Lịch trình có thể bị trễ 10 phút do tắc đường tại khu vực cầu Sài Gòn.',
        timeString: '2 giờ trước', 
        isRead: true
    },
];

// Giá trị tĩnh (Hardcoded) cho mục đích hiển thị giao diện
const STATIC_UNREAD_COUNT = 3;


const ParentNotification = ({ popupState }) => {
    
    // Hàm giả định cho các hành động (chỉ log ra console)
    const handleActionClick = (action) => {
        console.log(`Action clicked: ${action}`);
        // popupState.close(); // Giả lập đóng menu
    };

    return (
        <Menu
            {...bindMenu(popupState)} // ✅ SỬA: Gọi bindMenu (đã import ở đầu)
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            // Tùy chỉnh PaperProps
            PaperProps={{
                sx: {
                    mt: 1.5,
                    width: '350px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    p: 1
                }
            }}
        >
            {/* Header của Popup thông báo */}
            <Box sx={{ px: 2, py: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Thông báo
                </Typography>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    onClick={() => handleActionClick('Mark All Read')} 
                    disabled={STATIC_UNREAD_COUNT === 0} 
                    sx={{
                        borderRadius: '20px',
                        minWidth: '70px',
                        fontSize: '0.75rem',
                        px: 1.5,
                        py: 0.5
                    }}
                >
                    {STATIC_UNREAD_COUNT > 0 ? `${STATIC_UNREAD_COUNT} mới` : 'Đã đọc tất cả'}
                </Button>
            </Box>
            <Divider sx={{ mb: 1 }} />

            {/* Danh sách các thông báo */}
            {mockNotifications.length === 0 ? (
                <Typography sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                    Không có thông báo mới nào.
                </Typography>
            ) : (
                mockNotifications.map((notification) => (
                    <MenuItem 
                        key={notification.id} 
                        onClick={() => handleActionClick(`View ${notification.id}`)}
                        sx={{
                            borderRadius: '8px',
                            mb: 1,
                            p: 1.5,
                            backgroundColor: notification.isRead ? 'background.paper' : '#e0f7fa',
                            '&:hover': {
                                backgroundColor: notification.isRead ? 'action.hover' : '#00bcd4',
                                color: notification.isRead ? 'text.primary' : 'black',
                            },
                            whiteSpace: 'normal',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Typography 
                            variant="body2" 
                            sx={{ fontWeight: 'bold', color: notification.isRead ? 'text.primary' : 'primary.dark' }}
                        >
                            {notification.type}
                        </Typography>
                        <Typography 
                            variant="body2" 
                            sx={{ 
                                color: notification.isRead ? 'text.secondary' : 'text.primary', 
                                mt: 0.5, 
                                lineHeight: 1.3 
                            }}
                        >
                            {notification.message}
                        </Typography>
                        <Typography 
                            variant="caption" 
                            color={notification.isRead ? 'text.disabled' : 'text.secondary'} 
                            sx={{ mt: 1, alignSelf: 'flex-end' }}
                        >
                            {notification.timeString}
                        </Typography>
                    </MenuItem>
                ))
            )}
             <Divider sx={{ mt: 1 }} />
            <Box sx={{ p: 1, textAlign: 'center' }}>
                <Button variant="text" size="small" onClick={() => handleActionClick('View All')}>
                    Xem tất cả
                </Button>
            </Box>
        </Menu>
    );
};

export default ParentNotification;