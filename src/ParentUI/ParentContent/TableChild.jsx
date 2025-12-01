import React, { useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Stack,
    Typography,
    Button,
    Tooltip,
    IconButton,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { MdVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getChildrenRoutes } from '../../service/apiService';


// Hàm Helper cho màu trạng thái (Chỉ dùng để hiển thị màu tĩnh)
const getStatusColor = (status) => {
    switch (status) {
        case 'Đã lên xe':
        case 'Đã trả':
            return 'success.main';
        case 'Chưa đón':
            return 'warning.main';
        case 'Vắng':
            return 'error.main';
        default:
            return 'text.primary';
    }
};


// Component hiển thị danh sách con với dữ liệu thật từ API
const TableChild = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Giả sử parentId được lấy từ localStorage hoặc context
    const parentId = JSON.parse(localStorage.getItem('bus_user')) || null; 

    useEffect(() => {
        fetchChildrenData();
    }, []);

    const fetchChildrenData = async () => {
        try {
            setLoading(true);
            const response = await getChildrenRoutes(parentId.profileId);
            setStudents(response.data || []);
            setError(null);
        } catch (err) {
            console.error('❌ Error fetching children:', err);
            setError('Không thể tải danh sách con');
        } finally {
            setLoading(false);
        }
    };

    const handleViewMap = (studentId) => {
        navigate(`/parent/map/${studentId}`);
    };

    const getScheduleStatus = (scheduleStatus, shift) => {
        if (!scheduleStatus) return { text: 'Chưa có lịch', color: 'default' };
        
        switch (scheduleStatus) {
            case 'Đã phân công':
                return { text: `Ca ${shift || 'Sáng'}`, color: 'info' };
            case 'Đang chạy':
                return { text: 'Đang đi đón', color: 'warning' };
            case 'Hoàn thành':
                return { text: 'Đã hoàn thành', color: 'success' };
            default:
                return { text: scheduleStatus, color: 'default' };
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ m: 2 }}>
                {error}
            </Alert>
        );
    }

    return (
        <div className='parent-table'>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate('/parent/add-student')}
                >
                    + Thêm Học Sinh
                </Button>
            </Box>
            <TableContainer component={Paper} elevation={3}>
                <Table aria-label="student list table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Mã HS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tên Học sinh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Lớp</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tuyến xe</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Điểm Đón</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Thời gian</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {students.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    Không có thông tin con
                                </TableCell>
                            </TableRow>
                        ) : (
                            students.map((student) => {
                                const status = getScheduleStatus(student.ScheduleStatus, student.Shift);
                                return (
                                    <TableRow
                                        key={student.MaHocSinh}
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {student.MaHocSinh}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {student.StudentName}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{student.Class}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2" color="primary">
                                                {student.RouteName || 'Chưa có tuyến'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {student.VehicleNumber || ''}
                                            </Typography>
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '0.85rem' }}>
                                            {student.PickupAddress || student.StudentAddress || 'N/A'}
                                        </TableCell>
                                        <TableCell>
                                            {student.StartTime ? (
                                                <Typography variant="body2">
                                                    {student.StartTime}
                                                </Typography>
                                            ) : (
                                                <Typography variant="caption" color="text.disabled">
                                                    Chưa có lịch
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={status.text}
                                                color={status.color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Tooltip title="Xem vị trí xe">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={() => handleViewMap(student.MaHocSinh)}
                                                    disabled={!student.RouteId}
                                                >
                                                    <MdVisibility />
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

export default TableChild;