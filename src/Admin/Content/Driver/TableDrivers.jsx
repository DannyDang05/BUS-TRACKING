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
// IMPORT HOOKS VÀ API
import { useState, useEffect } from 'react';
import { getAllDrivers, deleteDriver } from '../../../service/apiService'; // Import hàm API
import { toast } from 'react-toastify';
import { IconButton, Tooltip, Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid, Typography, Divider, Box } from '@mui/material';
import { Delete as DeleteIcon, Visibility as VisibilityIcon, Close as CloseIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import UpdateDriverModalNew from './UpdateDriverModalNew';

// BƯỚC 1: CẬP NHẬT CÁC CỘT ĐỂ KHỚP VỚI DATABASE
// Dữ liệu từ API sẽ có các trường: Id, FullName, MaBangLai, PhoneNumber
const columns = [
  { 
    field: 'Id', // Khớp chính xác với tên trường từ API
    headerName: 'ID', 
    width: 100 
  },
  { 
    field: 'FullName', // Khớp chính xác với tên trường từ API
    headerName: 'Họ và Tên', 
    width: 300 
  },
  { 
    field: 'MaBangLai', // Khớp chính xác với tên trường từ API
    headerName: 'Mã Bằng Lái', 
    width: 200 
  },
  {
    field: 'PhoneNumber', // Khớp chính xác với tên trường từ API
    headerName: 'Số Điện Thoại',
    width: 250,
  },
];


const TableDriver = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const { t } = useLanguage();

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await getAllDrivers(search, page + 1, rowsPerPage);
      const list = res?.data || [];
      setDrivers(list);
      setTotalCount(res?.meta?.totalItems || 0);
    } catch (err) {
      console.error('Lấy drivers lỗi', err);
      setDrivers([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, [search, page, rowsPerPage]);

  // debounce localSearch -> search
  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (driverID) =>{
    if (driverID) navigate(`/drivers/update-driver/${driverID}`);
  }

  const handleViewDetail = (driver) => {
    setSelectedDriver(driver);
    setDetailOpen(true);
  }

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedDriver(null);
  }

  const handleOpenEdit = (driver) => {
    setSelectedDriver(driver);
    setEditOpen(true);
    setDetailOpen(false);
  }

  const handleCloseEdit = () => {
    setEditOpen(false);
    setSelectedDriver(null);
  }

  const handleDelete = async (id) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  }

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const id = confirmTarget;
    setConfirmTarget(null);
    if (!result || !id) return;
    try {
      await deleteDriver(id);
      toast.success('Xóa tài xế thành công!');
      // reload
      setLoading(true);
      const res = await getAllDrivers(search, page + 1, rowsPerPage);
      const list = res?.data || [];
      setDrivers(list);
      setTotalCount(res?.meta?.totalItems || 0);
    } catch (err) {
      console.error('Xóa tài xế thất bại', err);
      toast.error(err?.response?.data?.message || 'Xóa tài xế thất bại!');
    } finally {
      setLoading(false);
    }
  }

  const displayed = drivers;

  return (
    <Paper className="custom-table-container">
      <div style={{ padding: '8px 12px', display: 'flex', gap:8, alignItems: 'center' }}>
        <input
          placeholder={t('searchPlaceholder') + ' (họ tên, phone, bằng lái)...'}
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
              <TableCell>ID</TableCell>
              <TableCell>{t('driver') === 'Driver' ? 'Full Name' : 'Họ và Tên'}</TableCell>
              <TableCell>{t('MaBangLai') || 'Mã Bằng Lái'}</TableCell>
              <TableCell>{t('PhoneNumber') || 'Số Điện Thoại'}</TableCell>
              <TableCell>{t('action') || 'Hành Động'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="table-empty">{t('noData')}</TableCell></TableRow>
            ) : (
                displayed.map((d) => (
                <TableRow key={d.Id}>
                  <TableCell>{d.Id}</TableCell>
                  <TableCell>{d.FullName}</TableCell>
                  <TableCell>{d.MaBangLai}</TableCell>
                  <TableCell>{d.PhoneNumber}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Xem chi tiết">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleViewDetail(d); }} color="primary">
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={t('delete')}>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(d.Id); }} color="error">
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
      
      {/* Modal xem chi tiết tài xế */}
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
              🚗
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              Thông Tin Tài Xế
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
          {selectedDriver && (
            <Box sx={{ mt: 1 }}>
              {/* ID và Họ Tên */}
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
                    ID TÀI XẾ
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#0097a7', fontWeight: 'bold', mt: 0.5 }}>
                    {selectedDriver.Id || 'N/A'}
                  </Typography>
                </Box>
                <Divider sx={{ my: 1.5 }} />
                <Box>
                  <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                    HỌ VÀ TÊN
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#424242', fontWeight: '600', mt: 0.5 }}>
                    {selectedDriver.FullName || 'N/A'}
                  </Typography>
                </Box>
              </Box>

              {/* Thông tin liên hệ */}
              <Box sx={{ 
                background: 'white',
                borderRadius: '12px',
                p: 2.5,
                mb: 2,
                boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                border: '1px solid rgba(0, 151, 167, 0.1)'
              }}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ 
                      background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.05) 0%, rgba(0, 131, 143, 0.02) 100%)',
                      borderRadius: '8px',
                      p: 1.5,
                      border: '1px solid rgba(0, 151, 167, 0.1)'
                    }}>
                      <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.7rem' }}>
                        📞 SỐ ĐIỆN THOẠI
                      </Typography>
                      <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5, fontSize: '1rem' }}>
                        {selectedDriver.PhoneNumber || 'N/A'}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>

              {/* Thông tin bằng lái */}
              <Box sx={{ 
                background: 'white',
                borderRadius: '12px',
                p: 2.5,
                boxShadow: '0 2px 8px rgba(0, 151, 167, 0.1)',
                border: '1px solid rgba(0, 151, 167, 0.1)'
              }}>
                <Typography variant="caption" sx={{ color: '#00838f', fontWeight: 'bold', fontSize: '0.75rem' }}>
                  🪪 MÃ BẰNG LÁI
                </Typography>
                <Typography variant="body1" sx={{ color: '#424242', fontWeight: '600', mt: 0.5 }}>
                  {selectedDriver.MaBangLai || 'Chưa có thông tin'}
                </Typography>
              </Box>
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
            onClick={() => handleOpenEdit(selectedDriver)} 
            variant="contained"
            sx={{
              background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
              color: 'white',
              borderRadius: '8px',
              padding: '10px 24px',
              textTransform: 'none',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
                transform: 'translateY(-1px)',
                boxShadow: '0 4px 12px rgba(0, 151, 167, 0.4)'
              }
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

      {/* Update Driver Modal */}
      <UpdateDriverModalNew 
        open={editOpen} 
        onClose={handleCloseEdit} 
        driver={selectedDriver} 
        onRefresh={fetchDrivers} 
      />
    </Paper>
  );
}

export default TableDriver;