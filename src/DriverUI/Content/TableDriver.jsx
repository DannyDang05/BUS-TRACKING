import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip,
    CircularProgress,
    Box,
    Typography,
    Chip
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getDriverSchedules } from '../../service/apiService';

/**
 * TableRoute - Hiển thị lịch làm việc của tài xế theo ngày
 */
const TableRoute = () => {
    const navigate = useNavigate();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy driverId từ localStorage (sau khi login)
    const driverId = localStorage.getItem('driver_id'); // ID tài xế (TX001, TX002...)

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                setLoading(true);
                const today = new Date().toISOString().split('T')[0]; // Format: YYYY-MM-DD
                const response = await getDriverSchedules(driverId, today);
                setSchedules(response.data || []);
            } catch (err) {
                console.error('Error fetching schedules:', err);
                setError('Không thể tải lịch làm việc. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (driverId) {
            fetchSchedules();
        } else {
            setError('Không tìm thấy thông tin tài xế. Vui lòng đăng nhập lại.');
            setLoading(false);
        }
    }, [driverId]);

    const handleDetailClick = (scheduleId) => {
        navigate(`/driver/schedule/${scheduleId}`);
    };

    const getStatusChip = (statusText) => {
        const colorMap = {
            'Sắp diễn ra': 'warning',
            'Đang chạy': 'info',
            'Hoàn thành': 'success',
            'Hủy': 'error'
        };
        return <Chip label={statusText} color={colorMap[statusText] || 'default'} size="small" />;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }
    return (
        <div className="driver-table">
            <TableContainer component={Paper} className="custom-table">
                <Table aria-label="schedule table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã Tuyến</TableCell>
                            <TableCell>Tên Tuyến</TableCell>
                            <TableCell>Ngày</TableCell>
                            <TableCell>Ca</TableCell>
                            <TableCell>Thời Gian Bắt Đầu</TableCell>
                            <TableCell>Biển Số Xe</TableCell>
                            <TableCell>Số Học Sinh</TableCell>
                            <TableCell>Trạng Thái</TableCell>
                            <TableCell>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {schedules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    Không có lịch làm việc
                                </TableCell>
                            </TableRow>
                        ) : (
                            schedules.map((schedule, idx) => {
                                // Format ngày: DD/MM/YYYY
                                const formatDate = (dateStr) => {
                                    if (!dateStr) return 'N/A';
                                    const d = new Date(dateStr);
                                    const day = String(d.getDate()).padStart(2, '0');
                                    const month = String(d.getMonth() + 1).padStart(2, '0');
                                    const year = d.getFullYear();
                                    return `${day}/${month}/${year}`;
                                };

                                return (
                                    <TableRow key={schedule.scheduleId ?? idx}>
                                        <TableCell>{schedule.routeCode}</TableCell>
                                        <TableCell>{schedule.routeName}</TableCell>
                                        <TableCell>{formatDate(schedule.date)}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={schedule.shift === 'Sáng' ? '🌅 Sáng' : '🌆 Chiều'}
                                                size="small"
                                                color={schedule.shift === 'Sáng' ? 'success' : 'warning'}
                                            />
                                        </TableCell>
                                        <TableCell>{schedule.startTime}</TableCell>
                                        <TableCell>{schedule.LicensePlate || 'N/A'}</TableCell>
                                        <TableCell>
                                            {schedule.totalStudents} HS
                                            <Typography variant="caption" display="block" color="textSecondary">
                                                Đã đón: {schedule.pickedUpCount}/{schedule.totalStudents}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getStatusChip(schedule.statusText)}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xem chi tiết lịch trình">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleDetailClick(schedule.scheduleId)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableRoute;
