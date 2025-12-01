import React, { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { toast } from 'react-toastify';
import { getParentSchedules, requestAbsence } from '../../service/apiService';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelIcon from '@mui/icons-material/Cancel';

const getStatusColor = (status) => {
    switch (status) {
        case 'Đã đón':
        case 'Đã trả':
            return 'success';
        case 'Chưa đón':
            return 'warning';
        case 'Vắng':
            return 'error';
        case 'Đang chạy':
            return 'info';
        case 'Hoàn thành':
            return 'success';
        default:
            return 'default';
    }
};

const getShiftLabel = (shift) => {
    return shift === 'Sáng' ? '🌅 Chiều đi' : '🌆 Chiều về';
};

const ParentSchedule = () => {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    const [reason, setReason] = useState('');

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            setLoading(true);
            const parentId = localStorage.getItem('parent_id');
            const response = await getParentSchedules(parentId);
            
            if (response.data.errorCode === 0) {
                setSchedules(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching schedules:', error);
            toast.error('Không thể tải lịch trình');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (schedule) => {
        setSelectedSchedule(schedule);
        setOpenDialog(true);
        setReason('');
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedSchedule(null);
        setReason('');
    };

    const handleSubmitAbsence = async () => {
        if (!selectedSchedule) return;

        try {
            await requestAbsence(selectedSchedule.scheduleId, {
                pickupPointId: selectedSchedule.pickupPointId,
                reason: reason || 'Phụ huynh xin nghỉ'
            });
            
            toast.success('Đã gửi đơn xin nghỉ thành công!');
            handleCloseDialog();
            fetchSchedules(); // Reload
        } catch (error) {
            console.error('Error requesting absence:', error);
            toast.error('Không thể gửi đơn xin nghỉ');
        }
    };

    // Group schedules by date
    const groupedSchedules = schedules.reduce((acc, schedule) => {
        const date = schedule.date;
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(schedule);
        return acc;
    }, {});

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: 'primary.main' }}>
                📅 Lịch Trình Đưa Đón Con
            </Typography>

            {schedules.length === 0 ? (
                <Alert severity="info">Không có lịch trình nào trong thời gian tới</Alert>
            ) : (
                Object.keys(groupedSchedules).map((date) => (
                    <Paper key={date} elevation={3} sx={{ mb: 3, p: 2 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: 'text.secondary' }}>
                            📆 {new Date(date + 'T00:00:00').toLocaleDateString('vi-VN', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                            })}
                        </Typography>
                        
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Ca</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Giờ</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Học sinh</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tuyến xe</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Điểm đón</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Tài xế</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Trạng thái</TableCell>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Hành động</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {groupedSchedules[date].map((schedule) => (
                                        <TableRow key={schedule.scheduleId} sx={{ '&:nth-of-type(odd)': { backgroundColor: 'action.hover' } }}>
                                            <TableCell>{getShiftLabel(schedule.shift)}</TableCell>
                                            <TableCell>{schedule.startTime}</TableCell>
                                            <TableCell>{schedule.studentName}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="bold">{schedule.routeName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{schedule.LicensePlate}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{schedule.pickupAddress}</TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Typography variant="body2">{schedule.driverName}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{schedule.driverPhone}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box>
                                                    <Chip 
                                                        label={schedule.status} 
                                                        color={getStatusColor(schedule.status)} 
                                                        size="small" 
                                                        sx={{ mb: 0.5 }}
                                                    />
                                                    {schedule.pickupStatus && (
                                                        <Chip 
                                                            label={schedule.pickupStatus} 
                                                            color={getStatusColor(schedule.pickupStatus)} 
                                                            size="small" 
                                                            variant="outlined"
                                                        />
                                                    )}
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                {schedule.pickupStatus === 'Vắng' ? (
                                                    <Chip 
                                                        icon={<CancelIcon />}
                                                        label="Đã xin nghỉ" 
                                                        color="error" 
                                                        size="small" 
                                                    />
                                                ) : schedule.status === 'Hoàn thành' ? (
                                                    <Chip 
                                                        icon={<CheckCircleIcon />}
                                                        label="Đã hoàn thành" 
                                                        color="success" 
                                                        size="small" 
                                                    />
                                                ) : (
                                                    <Button
                                                        variant="outlined"
                                                        color="error"
                                                        size="small"
                                                        startIcon={<EventBusyIcon />}
                                                        onClick={() => handleOpenDialog(schedule)}
                                                    >
                                                        Xin nghỉ
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                ))
            )}

            {/* Dialog xin nghỉ */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventBusyIcon color="error" />
                        <Typography variant="h6">Xin nghỉ học</Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {selectedSchedule && (
                        <Box sx={{ mb: 2 }}>
                            <Alert severity="info" sx={{ mb: 2 }}>
                                Xin nghỉ cho: <strong>{selectedSchedule.studentName}</strong><br />
                                Ngày: <strong>{new Date(selectedSchedule.date + 'T00:00:00').toLocaleDateString('vi-VN')}</strong><br />
                                Ca: <strong>{getShiftLabel(selectedSchedule.shift)}</strong>
                            </Alert>
                            <TextField
                                autoFocus
                                margin="dense"
                                label="Lý do nghỉ học (tùy chọn)"
                                type="text"
                                fullWidth
                                multiline
                                rows={3}
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                placeholder="Ví dụ: Con bị ốm, có việc gia đình..."
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={handleSubmitAbsence} variant="contained" color="error">
                        Xác nhận xin nghỉ
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ParentSchedule;
