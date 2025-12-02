import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Grid,
    Paper,
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Stack,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    CircularProgress,
    Alert,
    Divider
} from "@mui/material";

// Icons
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MapIcon from '@mui/icons-material/Map';
import DialogReport from './DialogReport';
import DriverMap from './DriverMap';
import { getScheduleStudents, updatePickupStatus, updateScheduleStatus, reportIssue, startTripSimulation } from '../../service/apiService';
import { toast } from 'react-toastify';

const getStatusColor = (status) => {
    switch (status) {
        case 'Đã đón':
        case 'Đã trả':
            return 'success.main';
        case 'Chưa đón':
            return 'warning.main';
        case 'Vắng mặt':
            return 'error.main';
        default:
            return 'text.primary';
    }
};

const DetailSchedule = () => {
    const { id: scheduleId } = useParams(); // Lấy scheduleId từ URL

    // STATE CHO DỮ LIỆU
    const [students, setStudents] = useState([]);
    const [routeInfo, setRouteInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showMap, setShowMap] = useState(false);
    const [forceRefresh, setForceRefresh] = useState(0);

    // STATE CHO MENU CẬP NHẬT TRẠNG THÁI
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentStudent, setCurrentStudent] = useState(null);
    const openMenu = Boolean(anchorEl);

    // STATE CHO DIALOG BÁO CÁO SỰ CỐ
    const issueTypes = [
        'Tắc đường', 'Xe hỏng', 'Trục trặc thiết bị', 'Học sinh gây rối', 'Sự cố khác'
    ];
    const [openReport, setOpenReport] = useState(false);
    const [issueType, setIssueType] = useState('');
    const [description, setDescription] = useState('');

    // ===================================
    // LOAD DỮ LIỆU TỪ API
    // ===================================
    useEffect(() => {
        const fetchScheduleDetails = async () => {
            try {
                setLoading(true);
                const response = await getScheduleStudents(scheduleId);
                const studentData = response.data || [];
                
                setStudents(studentData.map(s => ({
                    pickupPointId: s.pickupPointId,
                    StudentId: s.studentId,
                    Name: s.studentName,
                    PickupPoint: s.pickupAddress,
                    Status: s.status,
                    studentClass: s.studentClass,
                    parentName: s.parentName,
                    parentPhone: s.parentPhone
                })));

                // Get route info from first student or make additional API call
                if (studentData.length > 0) {
                    const firstStudent = studentData[0];
                    setRouteInfo({
                        routeId: firstStudent.routeId,
                        RouteCode: firstStudent.routeCode || `SCHEDULE-${scheduleId}`,
                        RouteName: firstStudent.routeName || 'Tuyến đang tải...',
                        DriverName: localStorage.getItem('driver_name') || 'Tài xế',
                        LicensePlate: firstStudent.licensePlate || 'N/A'
                    });
                } else {
                    setRouteInfo({
                        RouteCode: `SCHEDULE-${scheduleId}`,
                        RouteName: 'Tuyến đang tải...',
                        DriverName: localStorage.getItem('driver_name') || 'Tài xế',
                        LicensePlate: 'N/A'
                    });
                }
            } catch (err) {
                console.error('Error fetching schedule details:', err);
                setError('Không thể tải thông tin lịch trình. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };

        if (scheduleId) {
            fetchScheduleDetails();
        }
    }, [scheduleId]);

    // ===================================
    // HÀM XỬ LÝ SỰ CỐ
    // ===================================
    const handleReportIssue = () => {
        setOpenReport(true);
    };

    const handleCloseReport = () => {
        setOpenReport(false);
        setIssueType('');
        setDescription('');
    };

    const handleSubmitReport = async () => {
        if (!issueType || !description) {
            toast.error('Vui lòng chọn loại sự cố và mô tả chi tiết.');
            return;
        }

        try {
            const driverId = localStorage.getItem('driver_id');
            await reportIssue({
                driverId,
                routeCode: routeInfo?.RouteCode,
                issueType,
                description
            });
            toast.success('Báo cáo sự cố đã được gửi thành công!');
            handleCloseReport();
        } catch (err) {
            console.error('Error submitting report:', err);
            toast.error('Không thể gửi báo cáo. Vui lòng thử lại.');
        }
    };

    const handleStartTrip = async () => {
        try {
            // Update schedule status to "Đang chạy"
            await updateScheduleStatus(scheduleId, 'Đang chạy');
            
            // Start simulation (xe sẽ tự động di chuyển theo route)
            await startTripSimulation(scheduleId);
            
            toast.success('Đã bắt đầu hành trình! Xe đang di chuyển theo tuyến đường.');
            // Tự động hiện bản đồ để theo dõi
            setShowMap(true);
        } catch (err) {
            console.error('Error starting trip:', err);
            toast.error('Không thể bắt đầu hành trình. Vui lòng thử lại.');
        }
    };

    // ===================================
    // HÀM XỬ LÝ MENU TRẠNG THÁI
    // ===================================
    const handleOpenMenu = (event, student) => {
        setAnchorEl(event.currentTarget);
        setCurrentStudent(student);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setCurrentStudent(null);
    };

    const handleUpdateStatus = async (newStatus) => {
        if (!currentStudent) return;

        try {
            await updatePickupStatus(scheduleId, currentStudent.pickupPointId, newStatus);
            
            // Cập nhật state local
            setStudents(prevStudents =>
                prevStudents.map(student =>
                    student.pickupPointId === currentStudent.pickupPointId 
                        ? { ...student, Status: newStatus } 
                        : student
                )
            );
            
            // Trigger refresh map để cập nhật marker
            setForceRefresh(prev => prev + 1);
            
            toast.success(`Đã cập nhật trạng thái: ${newStatus}`);
            handleCloseMenu();
        } catch (err) {
            console.error('Error updating pickup status:', err);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        }
    };

    // Hàm cập nhật tất cả học sinh cùng trạng thái
    const handleMarkAllAs = async (status) => {
        try {
            const updatePromises = students.map(student => 
                updatePickupStatus(scheduleId, student.pickupPointId, status)
            );
            
            await Promise.all(updatePromises);
            
            setStudents(prevStudents =>
                prevStudents.map(student => ({ ...student, Status: status }))
            );
            
            // Trigger refresh map để cập nhật marker
            setForceRefresh(prev => prev + 1);
            
            toast.success(`Đã cập nhật tất cả học sinh: ${status}`);
        } catch (err) {
            console.error('Error updating all statuses:', err);
            toast.error('Không thể cập nhật trạng thái. Vui lòng thử lại.');
        }
    };

    const statusOptions = [
        { label: 'Chưa đón', status: 'Chưa đón', color: 'warning' },
        { label: 'Đã đón', status: 'Đã đón', color: 'success' },
        { label: 'Vắng mặt', status: 'Vắng mặt', color: 'error' },
        { label: 'Đã trả', status: 'Đã trả', color: 'primary' },
    ];

    // Hiển thị loading
    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>

            {/* CÁC NÚT HÀNH ĐỘNG CHUNG */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 3 }}>
                <Button
                    variant={showMap ? "outlined" : "contained"}
                    startIcon={<MapIcon />}
                    onClick={() => setShowMap(!showMap)}
                    sx={{
                        background: !showMap ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                        color: !showMap ? 'white' : '#667eea',
                        borderColor: '#667eea',
                        '&:hover': {
                            background: !showMap ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : 'rgba(102, 126, 234, 0.1)',
                        }
                    }}
                >
                    {showMap ? 'Ẩn Bản đồ' : 'Xem Bản đồ'}
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    startIcon={<PlayArrowIcon />}
                    onClick={handleStartTrip}
                >
                    Bắt đầu Hành trình
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<WarningIcon />}
                    onClick={handleReportIssue}
                >
                    Báo cáo Sự cố
                </Button>
            </Stack>

            {/* BẢN ĐỒ REALTIME */}
            {showMap && routeInfo && (
                <Paper 
                    elevation={3} 
                    sx={{ 
                        mb: 4, 
                        p: 2,
                        borderRadius: 3,
                        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)'
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <MapIcon sx={{ color: '#667eea' }} />
                        <Typography variant="h6" sx={{ color: '#667eea', fontWeight: 'bold' }}>
                            Bản đồ Theo dõi Hành trình
                        </Typography>
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ height: '500px', borderRadius: 2, overflow: 'hidden' }}>
                        <DriverMap 
                            scheduleId={scheduleId} 
                            routeId={routeInfo?.routeId || parseInt(scheduleId)}
                            forceRefresh={forceRefresh}
                        />
                    </Box>
                </Paper>
            )}
            

            {/* THÔNG TIN TUYẾN */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}
                >
                    <DirectionsBusIcon sx={{ mr: 1, fontSize: '2rem' }} />
                    Chi tiết lịch trình: {routeInfo?.RouteCode || 'N/A'}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" color="text.secondary">Mã Tuyến / Tên Tuyến</Typography>
                            <Typography variant="h6">{routeInfo?.RouteCode || 'N/A'} : {routeInfo?.RouteName || 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" color="text.secondary">Tài xế / Biển số xe</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6">{routeInfo?.DriverName || 'N/A'}</Typography>
                            </Box>
                            <Typography variant="h6">Biển số: {routeInfo?.LicensePlate || 'N/A'}</Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            {/* BẢNG DANH SÁCH HỌC SINH (Giữ nguyên) */}
            <Box sx={{ marginTop: "60px" }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    <Typography variant="h5" sx={{ color: 'text.primary' }}>
                        Danh sách học sinh trên tuyến
                    </Typography>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<DoneAllIcon />}
                            onClick={() => handleMarkAllAs('Đã đón')}
                            sx={{ '&:hover': { boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)', transform: 'translateY(-1px)' }, transition: 'all 0.2s', }}
                        >
                            Đã đón tất cả
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                            onClick={() => handleMarkAllAs('Đã trả')}
                            sx={{ '&:hover': { boxShadow: '0 4px 10px rgba(25, 118, 210, 0.5)', transform: 'translateY(-1px)' }, transition: 'all 0.2s', }}
                        >
                            Đã trả tất cả
                        </Button>
                    </Stack>
                </Stack>

                <TableContainer component={Paper} elevation={3}>
                    <Table aria-label="student list table">
                        <TableHead>
                            <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Mã Học sinh</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tên Học sinh</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Điểm Đón</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Hành Động</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {students.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        Không có học sinh nào trên tuyến này
                                    </TableCell>
                                </TableRow>
                            ) : (
                                students.map((student) => (
                                    <TableRow
                                        key={student.StudentId}
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{student.StudentId}</TableCell>
                                        <TableCell>{student.Name}</TableCell>
                                        <TableCell>{student.PickupPoint}</TableCell>

                                        <TableCell
                                            sx={{
                                                color: getStatusColor(student.Status),
                                                fontWeight: 'bold'
                                            }}
                                        >
                                            {student.Status}
                                        </TableCell>

                                        <TableCell>
                                            <Tooltip title="Cập nhật Trạng thái">
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    onClick={(e) => handleOpenMenu(e, student)}
                                                >
                                                    <EditCalendarIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* POPUP/MENU CẬP NHẬT TRẠNG THÁI (Giữ nguyên) */}
            {currentStudent && (
                <Menu
                    anchorEl={anchorEl}
                    open={openMenu}
                    onClose={handleCloseMenu}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <MenuItem disabled>
                        **Cập nhật Trạng thái ({currentStudent.Name})**
                    </MenuItem>
                    {statusOptions.map((option) => (
                        <MenuItem
                            key={option.status}
                            onClick={() => handleUpdateStatus(option.status)}
                            disabled={currentStudent.Status === option.status}
                            sx={{ color: getStatusColor(option.status) }}
                        >
                            {option.label}
                        </MenuItem>
                    ))}
                </Menu>
            )}
            <DialogReport
                openReport={openReport}
                setOpenReport = {setOpenReport}
                issueType= {issueType}
                setIssueType = {setIssueType}
                description = {description}
                setDescription = {setDescription}
                handleCloseReport={handleCloseReport} 
                handleSubmitReport={handleSubmitReport}
                issueTypes={issueTypes}

            />

        </Container>
    );
};

export default DetailSchedule;