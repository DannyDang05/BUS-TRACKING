import React, { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    Chip,
    Button,
    CircularProgress,
    Alert,
    Stack,
    Divider,
    Badge
} from '@mui/material';
import {
    DirectionsBus,
    LocationOn,
    Notifications,
    Schedule,
    CheckCircle,
    Warning,
    Person
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getChildrenRoutes } from '../../service/apiService';
import '../ParentContent/Parent.scss';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const parentId = JSON.parse(localStorage.getItem('bus_user'))?.profileId || null;

    useEffect(() => {
        fetchChildrenData();
        // Refresh mỗi 10 giây
        const interval = setInterval(fetchChildrenData, 10000);
        return () => clearInterval(interval);
    }, []);

    const fetchChildrenData = async () => {
        try {
            setLoading(true);
            const response = await getChildrenRoutes(parentId);
            setStudents(response.data || []);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching children:', err);
            setError('Không thể tải danh sách con');
        } finally {
            setLoading(false);
        }
    };

    // Lấy status badge - Sử dụng PickupStatus từ schedule_pickup_status
    const getStatusInfo = (student) => {
        const scheduleStatus = student.ScheduleStatus;
        const pickupStatus = student.PickupStatus; // Từ schedule_pickup_status
        
        // Nếu đang chạy, dựa vào pickup_status
        if (scheduleStatus === 'Đang chạy') {
            if (pickupStatus === 'Đã đón') {
                return { text: 'Đã lên xe', color: 'success', icon: <CheckCircle /> };
            }
            if (pickupStatus === 'Đã trả') {
                return { text: 'Đã về đến nhà', color: 'success', icon: <CheckCircle /> };
            }
            // Chưa đón
            return { text: 'Xe đang đến', color: 'warning', icon: <DirectionsBus /> };
        }
        
        if (scheduleStatus === 'Đã phân công' || scheduleStatus === 'Sắp diễn ra') {
            return { text: 'Chưa khởi hành', color: 'info', icon: <Schedule /> };
        }

        if (scheduleStatus === 'Hoàn thành') {
            return { text: 'Đã hoàn thành', color: 'success', icon: <CheckCircle /> };
        }

        return { text: 'Chưa có lịch', color: 'default', icon: <Schedule /> };
    };

    // Format lịch tuần
    const getWeekSchedule = (student) => {
        // TODO: API cần trả về lịch tuần, tạm thời hiển thị ca hiện tại
        if (student.Shift) {
            return `Ca ${student.Shift} - ${student.StartTime || 'N/A'}`;
        }
        return 'Chưa có lịch';
    };

    if (loading && students.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress sx={{ color: '#00bcd4' }} />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 3 }}>
                {error}
            </Alert>
        );
    }

    if (students.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8 }}>
                <Person sx={{ fontSize: 80, color: '#ccc', mb: 2 }} />
                <Typography variant="h6" color="text.secondary">
                    Chưa có thông tin học sinh
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh' }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold', mb: 1 }}>
                    👨‍👩‍👧 Theo dõi con của bạn
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                    Xem vị trí xe buýt và lịch trình trong tuần
                </Typography>
            </Box>

            {/* Student Cards */}
            <Grid container spacing={3}>
                {students.map((student) => {
                    const statusInfo = getStatusInfo(student);
                    
                    return (
                        <Grid item xs={12} md={6} lg={4} key={student.MaHocSinh}>
                            <Card 
                                sx={{ 
                                    borderRadius: '16px',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    transition: 'transform 0.3s, box-shadow 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-8px)',
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.2)'
                                    }
                                }}
                            >
                                <CardContent sx={{ p: 3 }}>
                                    {/* Header - Info học sinh */}
                                    <Stack direction="row" spacing={2} alignItems="center" mb={2}>
                                        <Avatar 
                                            sx={{ 
                                                width: 60, 
                                                height: 60, 
                                                bgcolor: '#667eea',
                                                fontSize: '1.5rem',
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {student.StudentName?.charAt(0) || 'H'}
                                        </Avatar>
                                        <Box sx={{ flex: 1 }}>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#333' }}>
                                                {student.StudentName}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Lớp {student.Class}
                                            </Typography>
                                        </Box>
                                        {statusInfo && (
                                            <Chip 
                                                icon={statusInfo.icon}
                                                label={statusInfo.text}
                                                color={statusInfo.color}
                                                size="small"
                                                sx={{ fontWeight: 'bold' }}
                                            />
                                        )}
                                    </Stack>

                                    <Divider sx={{ my: 2 }} />

                                    {/* Thông tin tuyến */}
                                    <Stack spacing={1.5} mb={2}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <DirectionsBus sx={{ color: '#667eea', fontSize: 20 }} />
                                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                                Tuyến: {student.RouteName || 'N/A'}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Schedule sx={{ color: '#00bcd4', fontSize: 20 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                {getWeekSchedule(student)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <LocationOn sx={{ color: '#f44336', fontSize: 20 }} />
                                            <Typography variant="body2" color="text.secondary" noWrap>
                                                {student.PickupAddress || 'Chưa có địa chỉ đón'}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    {/* Actions */}
                                    <Stack direction="row" spacing={1}>
                                        <Button
                                            variant="contained"
                                            startIcon={<LocationOn />}
                                            fullWidth
                                            onClick={() => navigate(`/parent/map/${student.MaHocSinh}`)}
                                            sx={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                '&:hover': {
                                                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                                                }
                                            }}
                                        >
                                            Xem Bản đồ
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            startIcon={
                                                <Badge badgeContent={student.unreadNotifications || 0} color="error">
                                                    <Notifications />
                                                </Badge>
                                            }
                                            onClick={() => navigate(`/parent/notifications`)}
                                            sx={{
                                                borderColor: '#667eea',
                                                color: '#667eea',
                                                '&:hover': {
                                                    borderColor: '#764ba2',
                                                    background: 'rgba(102, 126, 234, 0.05)'
                                                }
                                            }}
                                        >
                                            Thông báo
                                        </Button>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Box>
    );
};

export default ParentDashboard;
