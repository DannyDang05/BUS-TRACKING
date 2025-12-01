import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Chip,
    Button,
    CircularProgress,
    Alert,
    IconButton,
    Tooltip,
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
    Schedule,
    Visibility
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { getParentSchedules, requestAbsence } from '../../service/apiService';
import { toast } from 'react-toastify';
import '../ParentContent/Parent.scss';

const ParentDashboard = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [openAbsenceDialog, setOpenAbsenceDialog] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [absenceReason, setAbsenceReason] = useState('');

    const parentId = JSON.parse(localStorage.getItem('bus_user'))?.profileId || null;

    useEffect(() => {
        fetchSchedules();
        // Refresh mỗi 30 giây
        const interval = setInterval(fetchSchedules, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const response = await getParentSchedules(parentId);
            setSchedules(response.data || []);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching schedules:', err);
            setError('Không thể tải lịch trình');
        } finally {
            setLoading(false);
        }
    };

    // Format ngày: DD/MM/YYYY
    const formatDate = (dateStr) => {
        if (!dateStr) return 'N/A';
        const d = new Date(dateStr);
        const day = String(d.getDate()).padStart(2, '0');
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
    };

    // Lấy status chip dựa trên trạng thái lịch
    const getStatusChip = (statusText) => {
        const colorMap = {
            'Sắp diễn ra': 'warning',
            'Đang chạy': 'info',
            'Hoàn thành': 'success',
            'Hủy': 'error',
            'Đã phân công': 'default'
        };
        return <Chip label={statusText} color={colorMap[statusText] || 'default'} size="small" />;
    };

    // Lấy status badge cho pickup
    const getPickupStatusChip = (pickupStatus) => {
        const statusMap = {
            'Chưa đón': { label: 'Chưa đón', color: 'default' },
            'Đã đón': { label: 'Đã lên xe', color: 'success' },
            'Đã trả': { label: 'Đã về nhà', color: 'success' },
            'Vắng': { label: 'Vắng', color: 'error' }
        };
        const status = statusMap[pickupStatus] || statusMap['Chưa đón'];
        return <Chip label={status.label} color={status.color} size="small" />;
    };

    // Xử lý báo vắng
    const handleOpenAbsenceDialog = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenAbsenceDialog(true);
        setAbsenceReason('');
    };

    const handleCloseAbsenceDialog = () => {
        setOpenAbsenceDialog(false);
        setSelectedSchedule(null);
        setAbsenceReason('');
    };

    const handleSubmitAbsence = async () => {
        if (!selectedSchedule || !selectedSchedule.scheduleId || !selectedSchedule.pickupPointId) {
            toast.error('Không đủ thông tin để báo vắng');
            return;
        }

        try {
            await requestAbsence(selectedSchedule.scheduleId, {
                pickupPointId: selectedSchedule.pickupPointId,
                reason: absenceReason || 'Phụ huynh xin nghỉ'
            });
            
            toast.success(`Đã báo vắng cho ${selectedSchedule.studentName} thành công!`);
            handleCloseAbsenceDialog();
            fetchSchedules(); // Reload data
        } catch (error) {
            console.error('Error requesting absence:', error);
            toast.error('Không thể gửi đơn xin nghỉ');
        }
    };

    const handleViewDetail = (studentId) => {
        navigate(`/parent/map/${studentId}`);
    };

    if (loading) {
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

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1, color: '#333' }}>
                        📅 Lịch Trình Đưa Đón Của Con
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Xem tất cả lịch trình đưa đón từ ngày hiện tại
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/parent/add-student')}
                    sx={{ 
                        height: 'fit-content',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        boxShadow: 3
                    }}
                >
                    + Thêm Học Sinh
                </Button>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ boxShadow: 3, borderRadius: 2 }}>
                <Table>
                    <TableHead sx={{ bgcolor: '#667eea' }}>
                        <TableRow>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Học sinh</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lớp</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tuyến đường</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ngày</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ca</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Giờ bắt đầu</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Biển số xe</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Điểm đón</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái lịch</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Trạng thái đón</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }} align="center">Hành động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {schedules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                                    <Person sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
                                    <Typography variant="h6" color="text.secondary">
                                        Không có lịch trình nào
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            schedules.map((schedule, idx) => (
                                <TableRow 
                                    key={schedule.scheduleId ?? idx}
                                    sx={{ 
                                        '&:hover': { bgcolor: 'rgba(102, 126, 234, 0.05)' },
                                        '&:nth-of-type(odd)': { bgcolor: 'rgba(0, 0, 0, 0.02)' }
                                    }}
                                >
                                    <TableCell sx={{ fontWeight: 500 }}>{schedule.studentName}</TableCell>
                                    <TableCell>{schedule.className}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <DirectionsBus sx={{ fontSize: 18, color: '#667eea' }} />
                                            {schedule.routeName}
                                        </Box>
                                    </TableCell>
                                    <TableCell>{formatDate(schedule.date)}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={schedule.shift === 'Sáng' ? '🌅 Sáng' : '🌆 Chiều'}
                                            size="small"
                                            color={schedule.shift === 'Sáng' ? 'success' : 'warning'}
                                        />
                                    </TableCell>
                                    <TableCell>{schedule.startTime}</TableCell>
                                    <TableCell>{schedule.licensePlate || 'N/A'}</TableCell>
                                    <TableCell>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                            <LocationOn sx={{ fontSize: 16, color: '#f44336' }} />
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 150 }}>
                                                {schedule.pickupAddress || 'N/A'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell>{getStatusChip(schedule.statusText)}</TableCell>
                                    <TableCell>{getPickupStatusChip(schedule.pickupStatus)}</TableCell>
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                            <Tooltip title="Xem bản đồ">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleViewDetail(schedule.studentId)}
                                                >
                                                    <Visibility />
                                                </IconButton>
                                            </Tooltip>
                                            {schedule.pickupStatus !== 'Vắng' && (
                                                <Tooltip title="Báo vắng">
                                                    <IconButton
                                                        size="small"
                                                        color="error"
                                                        onClick={() => handleOpenAbsenceDialog(schedule)}
                                                    >
                                                        <EventBusy />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

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
                    {selectedSchedule && (
                        <Box sx={{ mt: 2 }}>
                            <Alert severity="warning" sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Học sinh:</strong> {selectedSchedule.studentName}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Lớp:</strong> {selectedSchedule.className}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Ngày:</strong> {formatDate(selectedSchedule.date)}
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 1 }}>
                                    <strong>Ca:</strong> {selectedSchedule.shift} - {selectedSchedule.startTime}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Điểm đón:</strong> {selectedSchedule.pickupAddress}
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
