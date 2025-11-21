import React from 'react';
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
} from "@mui/material";
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import WarningIcon from '@mui/icons-material/Warning';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const mockRoute = {
    RouteCode: "T01",
    RouteName: "Bến Thành - Suối Tiên",
    DriverName: "Lê Văn Tám",
    LicensePlate: "51B-123.45",
};

const mockStudents = [
    { StudentId: 'HS001', Name: 'Trần Thị Mai', PickupPoint: 'Cổng KTX A', Status: 'Đã lên xe' },
    { StudentId: 'HS002', Name: 'Nguyễn Văn Hùng', PickupPoint: 'Tòa nhà B', Status: 'Đang chờ' },
    { StudentId: 'HS003', Name: 'Phạm Thanh Thảo', PickupPoint: 'Nhà sách X', Status: 'Vắng mặt' },
];
// ------------------------------------


const DetailSchedule = () => {

    const handleReportIssue = () => {
        alert('Đã nhấn Báo cáo Sự cố! Cần mở Dialog nhập thông tin...');
    };

    const handleStartTrip = () => {
        alert(`Bắt đầu Hành trình Tuyến ${mockRoute.RouteCode}!`);

    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>


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

            {/* thong tin tuyen */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', mb: 3 }}>
                    <DirectionsBusIcon sx={{ mr: 1, fontSize: '2rem' }} />
                    Chi tiết lịch trình tuyến: {mockRoute.RouteCode}
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




            {/* {bảng danh sach hoc sinh} */}
            <Box sx={{ marginTop: "60px" }}>
                <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{ mb: 2 }}
                >
                    {/* Tiêu đề Bảng */}
                    <Typography variant="h5" sx={{ color: 'text.primary' }}>
                        Danh sách học sinh trên tuyến
                    </Typography>

                    {/* CÁC NÚT HÀNH ĐỘNG MỚI */}
                    <Stack direction="row" spacing={1}>
                        <Button
                          
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<DoneAllIcon />}
                          
                            sx={{
                                '&:hover': {
                                    boxShadow: '0 4px 10px rgba(76, 175, 80, 0.5)', // Đổ bóng màu xanh lá
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s',
                            }}
                        >
                            Đã đón tất cả
                        </Button>
                        <Button
                          
                            variant="contained"
                            color="primary" 
                            size="small"
                            startIcon={<CheckCircleOutlineIcon />}
                         
                            sx={{
                                '&:hover': {
                                    boxShadow: '0 4px 10px rgba(25, 118, 210, 0.5)', // Đổ bóng màu primary
                                    transform: 'translateY(-1px)',
                                },
                                transition: 'all 0.2s', 
                            }}
                        >
                            Đã trả tất cả
                        </Button>
                    </Stack>
                </Stack>

                <TableContainer component={Paper} elevation={3}>
                
                    <Table aria-label="student list table">
                        <TableHead>
                            {/* ... */}
                            <TableRow sx={{ backgroundColor: 'grey.100' }}>
                                <TableCell sx={{ fontWeight: 'bold' }}>Mã Học sinh</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Tên Học sinh</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Điểm Đón</TableCell>
                                <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {mockStudents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Không có học sinh nào trên tuyến này
                                    </TableCell>
                                </TableRow>
                            ) : (
                                mockStudents.map((student, index) => (
                                    <TableRow
                                        key={student.StudentId}
                                        sx={{
                                            '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                            '& .status-cell': {
                                                color: student.Status === 'Đã lên xe' ? 'success.main' :
                                                    student.Status === 'Đang chờ' ? 'warning.main' :
                                                        'error.main',
                                                fontWeight: 'bold'
                                            }
                                        }}
                                    >
                                        <TableCell component="th" scope="row">{student.StudentId}</TableCell>
                                        <TableCell>{student.Name}</TableCell>
                                        <TableCell>{student.PickupPoint}</TableCell>
                                        <TableCell className="status-cell">{student.Status}</TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Container>
    );
};

export default DetailSchedule;