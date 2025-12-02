import * as React from 'react';
import { useNavigate } from "react-router-dom"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
import { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent } from '../../../service/apiService'; // Import API
import { toast } from 'react-toastify';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Divider, Box } from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import UpdateStudentModal from './UpdateStudentModal';

// Định nghĩa cột dựa trên schema DB (hocsinh)
const columns = [
    { field: 'MaHocSinh', headerName: 'Mã HS', width: 150 },
    { field: 'HoTen', headerName: 'Họ Tên', width: 300 },
    { field: 'Lop', headerName: 'Lớp', width: 150 },
    { field: 'TinhTrang', headerName: 'Tình Trạng', width: 200 },
    { field: 'MaPhuHuynh', headerName: 'Mã Phụ Huynh', width: 200 },
    { field: 'MaDiemDon', headerName: 'Điểm Đón', width: 150 },
];

const TableStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [localSearch, setLocalSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmTarget, setConfirmTarget] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const { t } = useLanguage();

    const fetchStudents = async () => {
        setLoading(true);
        try {
            const res = await getAllStudents(search, page + 1, rowsPerPage);
            const list = res?.data || [];
            setStudents(list);
            setTotalCount(res?.meta?.totalItems || 0);
        } catch (err) {
            console.error('Lấy students lỗi', err);
            setStudents([]);
            setTotalCount(0);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [search, page, rowsPerPage]);

    // debounce localSearch -> search
    useEffect(() => {
      const t = setTimeout(() => setSearch(localSearch), 350);
      return () => clearTimeout(t);
    }, [localSearch]);

    const handleClickOnRow = (params) => {
      const studentID = params?.MaHocSinh || params;
      if (studentID) navigate(`/students/update-student/${studentID}`);
    }

    const handleViewDetail = (student) => {
      setSelectedStudent(student);
      setDetailOpen(true);
    }

    const handleCloseDetail = () => {
      setDetailOpen(false);
      setSelectedStudent(null);
    }

    const handleOpenEdit = (student) => {
      setSelectedStudent(student);
      setEditOpen(true);
      setDetailOpen(false);
    }

    const handleCloseEdit = () => {
      setEditOpen(false);
      setSelectedStudent(null);
    }

    const handleDelete = async (id) => {
        // open confirm dialog
        setConfirmTarget(id);
        setConfirmOpen(true);
    }

    const handleConfirmResult = async (result) => {
      setConfirmOpen(false);
      const id = confirmTarget;
      setConfirmTarget(null);
      if (!result || !id) return;
      try {
        await deleteStudent(id);
        toast.success('Xóa học sinh thành công!');
        setLoading(true);
        const res = await getAllStudents(search, page + 1, rowsPerPage);
        const list = res?.data || [];
        setStudents(list);
        setTotalCount(res?.meta?.totalItems || 0);
      } catch (err) {
        console.error('Xóa học sinh thất bại', err);
        toast.error(err?.response?.data?.message || 'Xóa học sinh thất bại!');
      } finally {
        setLoading(false);
      }
    }

    const displayed = students;

    return (
        <Paper className="custom-table-container">
          <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                placeholder={t('searchPlaceholder') + ' (mã, tên, lớp)...'}
                value={localSearch}
                onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
                className="global-search-input"
                style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
              />
              <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{totalCount} {t('results')}</div>
          </div>
          <TableContainer>
            <Table className="custom-table">
              <TableHead>
                <TableRow>
                  <TableCell>{t('MaHocSinh') || 'Mã HS'}</TableCell>
                  <TableCell>{t('HoTen') || 'Họ Tên'}</TableCell>
                  <TableCell>{t('Lop') || 'Lớp'}</TableCell>
                  <TableCell>{t('TinhTrang') || 'Tình Trạng'}</TableCell>
                  <TableCell>{t('MaPhuHuynh') || 'Phụ Huynh'}</TableCell>
                  <TableCell>{t('MaDiemDon') || 'Điểm Đón'}</TableCell>
                  <TableCell>{t('action') || 'Hành Động'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
                    ) : displayed.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">{t('noData')}</TableCell></TableRow>
                    ) : (
                  displayed.map((s) => (
                    <TableRow key={s.MaHocSinh}>
                      <TableCell>{s.MaHocSinh}</TableCell>
                      <TableCell>{s.HoTen}</TableCell>
                      <TableCell>{s.Lop}</TableCell>
                      <TableCell>{s.TrangThaiHocTap || s.TinhTrang || 'N/A'}</TableCell>
                      <TableCell>{s.MaPhuHuynh}</TableCell>
                      <TableCell>{s.DiaChi || s.MaDiemDon || 'N/A'}</TableCell>
                      <TableCell align="center">
                        <Tooltip title="Xem chi tiết">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewDetail(s); }} color="primary">
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('delete')}>
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(s.MaHocSinh); setConfirmOpen(true); }} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <div className="custom-table-footer">
            <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
                <option value={5}>5 {t('perPage')}</option>
                <option value={10}>10 {t('perPage')}</option>
                <option value={20}>20 {t('perPage')}</option>
                <option value={50}>50 {t('perPage')}</option>
            </select>
            <PaginationControls count={totalCount} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
          </div>
            <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
            
            {/* Modal xem chi tiết học sinh */}
            <Dialog 
              open={detailOpen} 
              onClose={handleCloseDetail} 
              maxWidth="sm" 
              fullWidth
              PaperProps={{
                sx: {
                  borderRadius: '16px',
                  boxShadow: '0 8px 32px rgba(0, 151, 167, 0.3)'
                }
              }}
            >
              <DialogTitle sx={{ 
                background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                color: 'white',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '20px 24px',
                borderRadius: '16px 16px 0 0'
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '50%',
                    width: 40,
                    height: 40,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px'
                  }}>
                    🎓
                  </Box>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Thông Tin Học Sinh
                  </Typography>
                </Box>
                <IconButton 
                  size="small" 
                  onClick={handleCloseDetail} 
                  sx={{ 
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)'
                    }
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
              <DialogContent sx={{ p: 3, background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)' }}>
                {selectedStudent && (
                  <Box sx={{ mt: 1 }}>
                    {/* Mã và Tên */}
                    <Box sx={{ 
                      background: 'white',
                      borderRadius: '12px',
                      p: 2.5,
                      mb: 2,
                      boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                      border: '1px solid rgba(0, 151, 167, 0.1)'
                    }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          MÃ HỌC SINH
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#0097a7', fontWeight: 'bold', mt: 0.5 }}>
                          {selectedStudent.MaHocSinh || 'N/A'}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          HỌ VÀ TÊN
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#424242', fontWeight: '600', mt: 0.5 }}>
                          {selectedStudent.HoTen || 'N/A'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Thông tin học tập */}
                    <Box sx={{ 
                      background: 'white',
                      borderRadius: '12px',
                      p: 2.5,
                      mb: 2,
                      boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                      border: '1px solid rgba(0, 151, 167, 0.1)'
                    }}>
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.05) 0%, rgba(0, 131, 143, 0.02) 100%)',
                            borderRadius: '8px',
                            p: 1.5,
                            border: '1px solid rgba(0, 151, 167, 0.1)'
                          }}>
                            <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.7rem' }}>
                              LỚP
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5, fontSize: '1rem' }}>
                              {selectedStudent.Lop || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                        <Grid item xs={6}>
                          <Box sx={{ 
                            background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.05) 0%, rgba(0, 131, 143, 0.02) 100%)',
                            borderRadius: '8px',
                            p: 1.5,
                            border: '1px solid rgba(0, 151, 167, 0.1)'
                          }}>
                            <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.7rem' }}>
                              TÌNH TRẠNG
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5, fontSize: '1rem' }}>
                              {selectedStudent.TrangThaiHocTap || selectedStudent.TinhTrang || 'N/A'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                    </Box>

                    {/* Thông tin phụ huynh và điểm đón */}
                    <Box sx={{ 
                      background: 'white',
                      borderRadius: '12px',
                      p: 2.5,
                      mb: 2,
                      boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                      border: '1px solid rgba(0, 151, 167, 0.1)'
                    }}>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          👨‍👩‍👧 MÃ PHỤ HUYNH
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5 }}>
                          {selectedStudent.MaPhuHuynh || 'N/A'}
                        </Typography>
                      </Box>
                      <Divider sx={{ my: 1.5 }} />
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          📍 ĐIỂM ĐÓN
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5 }}>
                          {selectedStudent.DiaChi || selectedStudent.MaDiemDon || 'Chưa có thông tin'}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Địa chỉ */}
                    {selectedStudent.DiaChi && (
                      <Box sx={{ 
                        background: 'white',
                        borderRadius: '12px',
                        p: 2.5,
                        boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                        border: '1px solid rgba(0, 151, 167, 0.1)'
                      }}>
                        <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                          🏠 ĐỊA CHỈ
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#424242', mt: 0.5, lineHeight: 1.6 }}>
                          {selectedStudent.DiaChi}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </DialogContent>
              <DialogActions sx={{ 
                p: 2.5, 
                gap: 1.5,
                background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)',
                borderTop: '1px solid rgba(0, 151, 167, 0.1)'
              }}>
                <Button 
                  onClick={() => handleOpenEdit(selectedStudent)}
                  variant="contained"
                  sx={{
                    background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 16px rgba(0, 151, 167, 0.4)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  ✏️ Chỉnh Sửa
                </Button>
                <Button 
                  onClick={handleCloseDetail} 
                  variant="outlined" 
                  sx={{
                    borderColor: '#0097a7',
                    color: '#0097a7',
                    borderRadius: '8px',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#00838f',
                      background: 'rgba(0, 151, 167, 0.05)'
                    }
                  }}
                >
                  Đóng
                </Button>
              </DialogActions>
            </Dialog>

            {/* Modal Chỉnh Sửa */}
            <UpdateStudentModal
              open={editOpen}
              onClose={handleCloseEdit}
              student={selectedStudent}
              onRefresh={fetchStudents}
            />
        </Paper>
    );
}

export default TableStudent;