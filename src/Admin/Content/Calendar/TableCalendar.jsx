import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllNotifications, deleteNotification } from '../../../service/apiService';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';

const columns = [
  { field: 'MaThongBao', headerName: 'Mã Thông Báo', width: 200 },
  { field: 'NoiDung', headerName: 'Nội Dung', width: 400 },
  { field: 'ThoiGian', headerName: 'Thời Gian', width: 250 },
  { field: 'LoaiThongBao', headerName: 'Loại Thông Báo', width: 200 },
];

const TableCalendar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllNotifications(search);
        const list = res?.data || res || [];
        setNotifications(list);
      } catch (err) {
        console.error('Lấy notifications lỗi', err);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search]);

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const id = confirmTarget;
    setConfirmTarget(null);
    if (!result || !id) return;
    try {
      await deleteNotification(id);
      setLoading(true);
      const res = await getAllNotifications(search);
      const list = res?.data || res || [];
      setNotifications(list);
    } catch (err) {
      console.error('Xóa thông báo thất bại', err);
      alert('Xóa thất bại');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (params) => {
    const notificationID = params.row?.MaThongBao;
    if (notificationID) navigate(`/calendars/update-calendar/${notificationID}`);
  };

  const displayed = notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="custom-table-container">
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder="Tìm kiếm thông báo..."
          value={localSearch}
          onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
          className="global-search-input"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{notifications.length} kết quả</div>
      </div>
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>Mã Thông Báo</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Thời Gian</TableCell>
              <TableCell>Loại Thông Báo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {loading ? (
              <TableRow><TableCell colSpan={5} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="table-empty">Không có dữ liệu</TableCell></TableRow>
            ) : (
              displayed.map((n) => (
                <TableRow key={n.MaThongBao} onClick={() => handleClickOnRow(n)}>
                  <TableCell>{n.MaThongBao}</TableCell>
                  <TableCell>{n.NoiDung}</TableCell>
                  <TableCell>{n.ThoiGian}</TableCell>
                  <TableCell>{n.LoaiThongBao}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(n.MaThongBao); setConfirmOpen(true); }} title="Xóa" color="error">
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
          <option value={5}>5 / trang</option>
          <option value={10}>10 / trang</option>
          <option value={20}>20 / trang</option>
          <option value={50}>50 / trang</option>
        </select>
        <PaginationControls count={notifications.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title="Xác nhận xóa" message="Bạn có chắc muốn xóa thông báo này?" onClose={handleConfirmResult} />
    </Paper>
  );
}

export default TableCalendar;