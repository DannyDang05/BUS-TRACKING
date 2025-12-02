import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllSchedules, deleteSchedule } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';

const columns = [
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'routeCode', headerName: 'Mã Tuyến', width: 150 },
  { field: 'routeName', headerName: 'Tên Tuyến', width: 200 },
  { field: 'date', headerName: 'Ngày', width: 150 },
  { field: 'shift', headerName: 'Ca', width: 100 },
  { field: 'start_time', headerName: 'Giờ Bắt Đầu', width: 150 },
  { field: 'status', headerName: 'Trạng Thái', width: 150 },
  { field: 'driverName', headerName: 'Tài Xế', width: 180 },
  { field: 'licensePlate', headerName: 'Biển Số Xe', width: 150 },
];

const TableCalendar = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
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
        const res = await getAllSchedules(search, page + 1, rowsPerPage);
        const list = res?.data || [];
        setSchedules(list);
        setTotalCount(res?.meta?.totalItems || 0);
      } catch (err) {
        console.error('Lấy schedules lỗi', err);
        setSchedules([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, page, rowsPerPage]);

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const id = confirmTarget;
    setConfirmTarget(null);
    if (!result || !id) return;
    try {
      await deleteSchedule(id);
      toast.success('Xóa lịch trình thành công!');
      setLoading(true);
      const res = await getAllSchedules(search, page + 1, rowsPerPage);
      const list = res?.data || [];
      setSchedules(list);
      setTotalCount(res?.meta?.totalItems || 0);
    } catch (err) {
      console.error('Xóa lịch trình thất bại', err);
      toast.error(err?.response?.data?.message || 'Xóa lịch trình thất bại!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (params) => {
    const scheduleId = params.row?.id;
    if (scheduleId) navigate(`/calendars/update-calendar/${scheduleId}`);
  };

  const displayed = schedules;

  return (
    <Paper className="custom-table-container">
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder={t('searchPlaceholder')}
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
              <TableCell>Mã Tuyến</TableCell>
              <TableCell>Tên Tuyến</TableCell>
              <TableCell>Ngày</TableCell>
              <TableCell>Ca</TableCell>
              <TableCell>Giờ Bắt Đầu</TableCell>
              <TableCell>Trạng Thái</TableCell>
              <TableCell>Tài Xế</TableCell>
              <TableCell>Biển Số Xe</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {loading ? (
              <TableRow><TableCell colSpan={10} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={10} className="table-empty">{t('noData')}</TableCell></TableRow>
            ) : (
              displayed.map((s) => (
                <TableRow key={s.id} onClick={() => handleClickOnRow({ row: s })}>
                  <TableCell>{s.id}</TableCell>
                  <TableCell>{s.routeCode}</TableCell>
                  <TableCell>{s.routeName}</TableCell>
                  <TableCell>{s.date}</TableCell>
                  <TableCell>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: 'bold',
                      background: s.shift === 'Sáng' ? 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)' : 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
                      color: 'white',
                      display: 'inline-block'
                    }}>
                      {s.shift === 'Sáng' ? '☀️ Sáng' : '🌙 Chiều'}
                    </span>
                  </TableCell>
                  <TableCell>{s.start_time}</TableCell>
                  <TableCell>{s.status}</TableCell>
                  <TableCell>{s.driverName || 'N/A'}</TableCell>
                  <TableCell>{s.licensePlate || 'N/A'}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(s.id); setConfirmOpen(true); }} title={t('delete')} color="error">
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
        <PaginationControls count={totalCount} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </Paper>
  );
}

export default TableCalendar;