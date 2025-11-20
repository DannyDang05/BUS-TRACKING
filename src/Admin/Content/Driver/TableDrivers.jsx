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
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';

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
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllDrivers(search);
        // apiService interceptor returns `response.data` shape, which our backend wraps as { errorCode, message, data }
        const list = res?.data || res || [];
        setDrivers(list);
      } catch (err) {
        console.error('Lấy drivers lỗi', err);
        setDrivers([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  // debounce localSearch -> search
  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (driverID) =>{
    if (driverID) navigate(`/drivers/update-driver/${driverID}`);
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
      const res = await getAllDrivers(search);
      const list = res?.data || res || [];
      setDrivers(list);
    } catch (err) {
      console.error('Xóa tài xế thất bại', err);
      toast.error(err?.response?.data?.message || 'Xóa tài xế thất bại!');
    } finally {
      setLoading(false);
    }
  }

  const displayed = drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

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
        <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{drivers.length} {t('results')}</div>
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
                  <TableCell onClick={() => handleClickOnRow(d.Id)}>{d.Id}</TableCell>
                  <TableCell onClick={() => handleClickOnRow(d.Id)}>{d.FullName}</TableCell>
                  <TableCell onClick={() => handleClickOnRow(d.Id)}>{d.MaBangLai}</TableCell>
                  <TableCell onClick={() => handleClickOnRow(d.Id)}>{d.PhoneNumber}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); handleDelete(d.Id); }} title="Xóa" color="error">
                      <DeleteIcon fontSize="small" />
                    </IconButton>
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
        <PaginationControls count={drivers.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </Paper>
  );
}

export default TableDriver;