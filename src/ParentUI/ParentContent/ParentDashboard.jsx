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
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import {
    DirectionsBus,
    LocationOn,
    EventBusy,
    CheckCircle,
    Warning,
    Person,
    CancelPresentation,
    Schedule
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getChildrenRoutes, requestAbsence } from '../../service/apiService';
import { toast } from 'react-toastify';
import '../ParentContent/Parent.scss';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [absenceReason, setAbsenceReason] = useState('');

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

    // Xử lý báo vắng
    const handleOpenAbsenceDialog = (student) => {
        setSelectedStudent(student);
        setOpenAbsenceDialog(true);
        setAbsenceReason('');
    };

    const handleCloseAbsenceDialog = () => {
        setOpenAbsenceDialog(false);
        setSelectedStudent(null);
        setAbsenceReason('');
    };

    const handleSubmitAbsence = async () => {
        if (!selectedStudent || !selectedStudent.schedule_id || !selectedStudent.pickup_point_id) {
            toast.error('Không đủ thông tin để báo vắng');
            return;
        }

        try {
            await requestAbsence(selectedStudent.schedule_id, {
                pickupPointId: selectedStudent.pickup_point_id,
                reason: absenceReason || 'Phụ huynh xin nghỉ'
            });
            
            toast.success(`Đã báo vắng cho ${selectedStudent.StudentName} thành công!`);
            handleCloseAbsenceDialog();
            fetchChildrenData(); // Reload data
        } catch (error) {
            console.error('Error requesting absence:', error);
            toast.error('Không thể gửi đơn xin nghỉ');
        }
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
                                        {student.PickupStatus === 'Vắng mặt' ? (
                                            <Button
                                                variant="outlined"
                                                startIcon={<CancelPresentation />}
                                                disabled
                                                fullWidth
                                                sx={{
                                                    borderColor: '#f44336',
                                                    color: '#f44336'
                                                }}
                                            >
                                                Đã báo vắng
                                            </Button>
                                        ) : (
                                            <Button
                                                variant="outlined"
                                                startIcon={<EventBusy />}
                                                fullWidth
                                                onClick={() => handleOpenAbsenceDialog(student)}
                                                sx={{
                                                    borderColor: '#ff9800',
                                                    color: '#ff9800',
                                                    '&:hover': {
                                                        borderColor: '#f57c00',
                                                        background: 'rgba(255, 152, 0, 0.05)'
                                                    }
                                                }}
                                            >
                                                Báo vắng
                                            </Button>
                                        )}
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>

            {/* Dialog Báo Vắng */}
            <Dialog 
                open={openAbsenceDialog} 
                onClose={handleCloseAbsenceDialog} 
                maxWidth="sm" 
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventBusy color="error" />
                        <Typography variant="h6">Báo Vắng Học</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedStudent && (
                        <Box sx={{ mb: 2 }}>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Học sinh:</strong> {selectedStudent.StudentName}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Lớp:</strong> {selectedStudent.Class}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Ca:</strong> {getWeekSchedule(selectedStudent)}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Điểm đón:</strong> {selectedStudent.PickupAddress}
                                </Typography>
                            </Alert>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Lý do nghỉ học (tùy chọn)"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                value={absenceReason}
                                onChange={(e) => setAbsenceReason(e.target.value)}
                                placeholder="Ví dụ: Con bị ốm, có việc gia đình..."
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAbsenceDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmitAbsence} 
                        variant="contained" 
                        color="error"
                        startIcon={<EventBusy />}
                    >
                        Xác nhận báo vắng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default ParentDashboard;
