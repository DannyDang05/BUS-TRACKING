import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    Grid,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import {
    AutoAwesome,
    DirectionsBus,
    School,
    Person,
    LocationOn,
    ExpandMore,
    Save,
    Refresh
} from '@mui/icons-material';
import { autoOptimizeRoutes, getStudentsByRoute } from '../../../service/apiService';
import { toast } from 'react-toastify';

const RouteOptimization = () => {
    const [loading, setLoading] = useState(false);
    const [optimizedRoutes, setOptimizedRoutes] = useState([]);
    const [currentRoutes, setCurrentRoutes] = useState([]);
    const [showPreview, setShowPreview] = useState(false);
    const [statistics, setStatistics] = useState(null);

    useEffect(() => {
        loadCurrentRoutes();
    }, []);

    const loadCurrentRoutes = async () => {
        try {
            // GỌI API MỚI: lấy RIÊNG routes tự động
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:6969/api/v1/routes/auto-routes', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const res = await response.json();
            if (res && res.errorCode === 0) {
                console.log('✅ Loaded auto routes:', res.data);
                setCurrentRoutes(res.data || []);
            }
        } catch (error) {
            console.error('Error loading current routes:', error);
        }
    };

    const handleOptimize = async () => {
        setLoading(true);
        try {
            // School location (can be configured)
            const schoolLocation = { lat: 10.7769, lon: 106.7009 };
            
            const res = await autoOptimizeRoutes(schoolLocation, false); // false = don't save yet
            
            if (res && res.errorCode === 0) {
                setOptimizedRoutes(res.data.routes);
                setStatistics({
                    totalStudents: res.data.totalStudents,
                    totalRoutes: res.data.totalRoutes
                });
                setShowPreview(true);
                toast.success(res.message);
            } else {
                toast.error(res?.message || 'Lỗi khi tối ưu tuyến');
            }
        } catch (error) {
            console.error('Error optimizing routes:', error);
            toast.error('Lỗi khi tối ưu tuyến: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveRoutes = async () => {
        setLoading(true);
        try {
            const schoolLocation = { lat: 10.7769, lon: 106.7009 };
            const res = await autoOptimizeRoutes(schoolLocation, true); // true = save to DB
            
            if (res && res.errorCode === 0) {
                toast.success('Đã lưu phân tuyến thành công!');
                setShowPreview(false);
                await loadCurrentRoutes();
            } else {
                toast.error(res?.message || 'Lỗi khi lưu phân tuyến');
            }
        } catch (error) {
            console.error('Error saving routes:', error);
            toast.error('Lỗi khi lưu phân tuyến: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ fontWeight: 600, color: '#1976d2' }}>
                    <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Phân Tuyến Tự Động
                </Typography>
                <Box>
                    <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadCurrentRoutes}
                        sx={{ mr: 2 }}
                    >
                        Làm mới
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AutoAwesome />}
                        onClick={handleOptimize}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Tối Ưu Tuyến'}
                    </Button>
                </Box>
            </Box>

            {/* Info Card */}
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Hệ thống phân tuyến thông minh:</strong> Tự động nhóm học sinh theo vị trí địa lý,
                    tối ưu đường đi và phân bổ xe dựa trên sức chứa. Xe 16 chỗ sẽ được xếp tối đa 16 học sinh.
                </Typography>
            </Alert>

            {/* Current Routes */}
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, color: '#1976d2' }}>
                        <DirectionsBus sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Tuyến Hiện Tại
                    </Typography>
                    {currentRoutes.length === 0 ? (
                        <Alert severity="warning">Chưa có tuyến tự động nào. Nhấn "Tối Ưu Tuyến" để tạo!</Alert>
                    ) : (
                        <Grid container spacing={2}>
                            {currentRoutes.map((route) => (
                                <Grid item xs={12} md={6} lg={4} key={route.RouteId}>
                                    <Card variant="outlined" sx={{ 
                                        borderLeft: route.Status === 'Đang chạy' ? '4px solid #4caf50' : '4px solid #2196f3' 
                                    }}>
                                        <CardContent>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                <Typography variant="h6" color="primary">
                                                    {route.RouteName}
                                                </Typography>
                                                <Chip 
                                                    label={route.Status} 
                                                    size="small" 
                                                    color={route.Status === 'Đang chạy' ? 'success' : 'default'}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary">
                                                Mã: {route.MaTuyen}
                                            </Typography>
                                            <Box sx={{ mt: 1 }}>
                                                <Chip
                                                    icon={<DirectionsBus />}
                                                    label={route.LicensePlate || 'Chưa có xe'}
                                                    size="small"
                                                    sx={{ mr: 1, mb: 1 }}
                                                />
                                                <Chip
                                                    icon={<Person />}
                                                    label={`${route.StudentCount}/${route.Capacity || 0} HS`}
                                                    size="small"
                                                    color={route.StudentCount > route.Capacity ? 'error' : 'success'}
                                                    sx={{ mb: 1 }}
                                                />
                                            </Box>
                                            {route.DriverName && (
                                                <Typography variant="body2" sx={{ mt: 1 }}>
                                                    <strong>Tài xế:</strong> {route.DriverName}
                                                    {route.DriverPhone && ` (${route.DriverPhone})`}
                                                </Typography>
                                            )}
                                            {route.TotalDistance && (
                                                <Typography variant="body2" color="success.main" sx={{ mt: 0.5 }}>
                                                    <strong>📍 Quãng đường thực tế:</strong> {route.TotalDistance} km
                                                </Typography>
                                            )}
                                            {route.EstimatedTime && (
                                                <Typography variant="body2" color="info.main" sx={{ mt: 0.5 }}>
                                                    <strong>⏱️ Thời gian:</strong> {Math.round(route.EstimatedTime)} phút
                                                </Typography>
                                            )}
                                            {/* Hiển thị danh sách học sinh */}
                                            {route.Students && route.Students.length > 0 && (
                                                <Box sx={{ mt: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                                    <Typography variant="caption" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                                                        Học sinh trên tuyến:
                                                    </Typography>
                                                    <Box sx={{ maxHeight: 100, overflowY: 'auto' }}>
                                                        {route.Students.map((student, idx) => (
                                                            <Typography key={idx} variant="caption" sx={{ display: 'block', fontSize: '0.7rem' }}>
                                                                {idx + 1}. {student.HoTen} ({student.Lop})
                                                            </Typography>
                                                        ))}
                                                    </Box>
                                                </Box>
                                            )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Preview Dialog */}
            <Dialog
                open={showPreview}
                onClose={() => setShowPreview(false)}
                maxWidth="lg"
                fullWidth
            >
                <DialogTitle>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6">
                            <AutoAwesome sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Xem Trước Phân Tuyến Tối Ưu
                        </Typography>
                        {statistics && (
                            <Box>
                                <Chip
                                    icon={<School />}
                                    label={`${statistics.totalStudents} học sinh`}
                                    color="primary"
                                    sx={{ mr: 1 }}
                                />
                                <Chip
                                    icon={<DirectionsBus />}
                                    label={`${statistics.totalRoutes} tuyến`}
                                    color="secondary"
                                />
                            </Box>
                        )}
                    </Box>
                </DialogTitle>
                <DialogContent dividers>
                    {optimizedRoutes.map((route, idx) => (
                        <Accordion key={idx} defaultExpanded={idx === 0}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                                        Tuyến {idx + 1}
                                    </Typography>
                                    <Chip
                                        icon={<DirectionsBus />}
                                        label={`${route.vehicle.LicensePlate} (${route.vehicle.Capacity} chỗ)`}
                                        size="small"
                                        color="primary"
                                        sx={{ mr: 2 }}
                                    />
                                    <Chip
                                        icon={<Person />}
                                        label={`${route.studentCount} học sinh`}
                                        size="small"
                                        color="success"
                                    />
                                </Box>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TableContainer component={Paper} variant="outlined">
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow>
                                                <TableCell><strong>STT</strong></TableCell>
                                                <TableCell><strong>Mã HS</strong></TableCell>
                                                <TableCell><strong>Họ Tên</strong></TableCell>
                                                <TableCell><strong>Lớp</strong></TableCell>
                                                <TableCell><strong>Địa chỉ</strong></TableCell>
                                                <TableCell><strong>Vị trí</strong></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {route.students.map((student, sIdx) => (
                                                <TableRow key={student.MaHocSinh}>
                                                    <TableCell>{sIdx + 1}</TableCell>
                                                    <TableCell>{student.MaHocSinh}</TableCell>
                                                    <TableCell>{student.HoTen}</TableCell>
                                                    <TableCell>{student.Lop}</TableCell>
                                                    <TableCell>{student.DiaChi || student.Address}</TableCell>
                                                    <TableCell>
                                                        <LocationOn fontSize="small" color="action" />
                                                        {parseFloat(student.Latitude)?.toFixed(6)}, {parseFloat(student.Longitude)?.toFixed(6)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowPreview(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Save />}
                        onClick={handleSaveRoutes}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Lưu Phân Tuyến'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RouteOptimization;
