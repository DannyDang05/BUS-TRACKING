import { useState, useEffect } from 'react';
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
import { getNotificationsByParent } from '../../service/apiService';
// DỮ LIỆU THÔNG BÁO TĨNH (Giữ nguyên)
// Giá trị tĩnh (Hardcoded) cho mục đích hiển thị giao diện
const STATIC_UNREAD_COUNT = 3;


const ParentNotification = ({ popupState }) => {
    const [notifiList, setNotifiList] = useState([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetchNotifications = async () => {
            setLoading(true);
            try {
                const parentId = localStorage.getItem('parent_profile');
                if (!parentId) return;
                const res = await getNotificationsByParent(parentId);
                // Backend trả về: { errorCode, message, data: [...] }
                const list = res?.data || [];
                setNotifiList(list);
            } catch (err) {
                console.error('Lấy thông báo lỗi', err);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();

    }, [popupState.isOpen]);
    // Hàm giả định cho các hành động (chỉ log ra console)
    const handleActionClick = (action) => {
        console.log(`Action clicked: ${action}`);
        // popupState.close(); // Giả lập đóng menu
    };

    return (
        <Menu
            {...bindMenu(popupState)}
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
            {notifiList.length === 0 ? (
                <Typography sx={{ px: 2, py: 1, color: 'text.secondary' }}>
                    Không có thông báo mới nào.
                </Typography>
            ) : (
                notifiList.map((notification) => (
                    <MenuItem
                        key={notification.Id}
                        onClick={() => handleActionClick(`View ${notification.Id}`)}
                        sx={{
                            borderRadius: '8px',
                            mb: 1,
                            p: 1.5,
                            backgroundColor: notification.DaDoc ? 'background.paper' : '#e0f7fa',
                            '&:hover': {
                                backgroundColor: notification.DaDoc ? 'action.hover' : '#00bcd4',
                                color: notification.DaDoc ? 'text.primary' : 'black',
                            },
                            whiteSpace: 'normal',
                            flexDirection: 'column',
                            alignItems: 'flex-start'
                        }}
                    >
                        <Typography
                            variant="body2"
                            sx={{ fontWeight: 'bold', color: notification.DaDoc ? 'text.primary' : 'primary.dark' }}
                        >
                            {notification.LoaiThongBao}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                color: notification.DaDoc ? 'text.secondary' : 'text.primary',
                                mt: 0.5,
                                lineHeight: 1.3
                            }}
                        >
                            {notification.NoiDung}
                        </Typography>
                        <Typography
                            variant="caption"
                            color={notification.DaDoc ? 'text.disabled' : 'text.secondary'}
                            sx={{ mt: 1, alignSelf: 'flex-end' }}
                        >
                            {notification.ThoiGian}
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