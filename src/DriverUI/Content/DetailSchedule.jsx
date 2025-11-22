import React, { useState } from 'react';

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
    

} from "@mui/material";

// Icons
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import DialogReport from './DialogReport';
// Dữ liệu mock
const mockRoute = {
    RouteCode: "T01",
    RouteName: "Bến Thành - Suối Tiên",
    DriverName: "Lê Văn Tám",
    LicensePlate: "51B-123.45",
};

const initialStudents = [
    { StudentId: 'HS001', Name: 'Trần Thị Mai', PickupPoint: 'Cổng KTX A', Status: 'Đã đón' },
    { StudentId: 'HS002', Name: 'Nguyễn Văn Hùng', PickupPoint: 'Tòa nhà B', Status: 'Chưa đón' },
    { StudentId: 'HS003', Name: 'Phạm Thanh Thảo', PickupPoint: 'Nhà sách X', Status: 'Vắng mặt' },
    { StudentId: 'HS004', Name: 'Lê Văn Khỏe', PickupPoint: 'Trường A', Status: 'Đã trả' },
];

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




const DetailSchedule = (props) => {


    const [students, setStudents] = useState(initialStudents);

    // STATE CHO MENU CẬP NHẬT TRẠNG THÁI
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentStudent, setCurrentStudent] = useState(null);
    const openMenu = Boolean(anchorEl);

    // STATE CHO DIALOG BÁO CÁO SỰ CỐ
    const issueTypes = [
        'Tắc đường', 'Xe hỏng', 'Trục trặc thiết bị', 'Học sinh gây rối', 'Sự cố khác'
    ];
    const [openReport, setOpenReport] = useState(false); // Mới
    const [issueType, setIssueType] = useState(''); // Mới
    const [description, setDescription] = useState(''); // Mới

    // ===================================
    // HÀM XỬ LÝ SỰ CỐ
    // ===================================

    const handleReportIssue = () => {
        setOpenReport(true); // Mở Dialog Báo cáo
    };

    const handleCloseReport = () => {
        setOpenReport(false);
        setIssueType('');
        setDescription(''); // Reset form
    };

    const handleSubmitReport = () => {
        if (!issueType || !description) {
            alert('Vui lòng chọn loại sự cố và mô tả chi tiết.');
            return;
        }
        // Logic gửi báo cáo thực tế
        console.log({ issueType, description });
        alert(`Báo cáo đã được gửi:\nLoại: ${issueType}\nChi tiết: ${description}`);
        handleCloseReport();
    };

    const handleStartTrip = () => {
        alert(`Bắt đầu Hành trình Tuyến ${mockRoute.RouteCode}!`);
    };

    // ===================================
    // HÀM XỬ LÝ MENU TRẠNG THÁI (Giữ nguyên)
    // ===================================
    const handleOpenMenu = (event, student) => {
        setAnchorEl(event.currentTarget);
        setCurrentStudent(student);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
        setCurrentStudent(null);
    };

    const handleUpdateStatus = (newStatus) => {
        if (!currentStudent) return;

        setStudents(prevStudents =>
            prevStudents.map(student =>
                student.StudentId === currentStudent.StudentId ? { ...student, Status: newStatus } : student
            )
        );
        handleCloseMenu();
    };

    const statusOptions = [
        { label: 'Chưa đón', status: 'Chưa đón', color: 'warning' },
        { label: 'Đã đón', status: 'Đã đón', color: 'success' },
        { label: 'Vắng mặt', status: 'Vắng mặt', color: 'error' },
        { label: 'Đã trả', status: 'Đã trả', color: 'primary' },
    ];


    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>

            {/* CÁC NÚT HÀNH ĐỘNG CHUNG */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mb: 3 }}>
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

            {/* THÔNG TIN TUYẾN (Giữ nguyên) */}
            <Box sx={{ mb: 4 }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}
                >
                    <DirectionsBusIcon sx={{ mr: 1, fontSize: '2rem' }} />

                    {/* KẾT HỢP CHUỖI VÀ BIỂU THỨC JSX ĐÚNG CÁCH */}
                    Chi tiết lịch trình tuyến: {mockRoute.RouteCode}

                    {/* Loại bỏ các ký tự không cần thiết như /// */}
                </Typography>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" color="text.secondary">Mã Tuyến / Tên Tuyến</Typography>
                            <Typography variant="h6">{mockRoute.RouteCode} : {mockRoute.RouteName}</Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                            <Typography variant="subtitle2" color="text.secondary">Tài xế / Biển số xe</Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="h6">{mockRoute.DriverName}</Typography>
                            </Box>
                            <Typography variant="h6">Biển số: {mockRoute.LicensePlate}</Typography>
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
                            sx={{ '&:hover': { boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)', transform: 'translateY(-1px)' }, transition: 'all 0.2s', }}
                        >
                            Đã đón tất cả
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
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