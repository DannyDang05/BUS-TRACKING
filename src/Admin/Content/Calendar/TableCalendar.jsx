import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllNotifications } from '../../../service/apiService';
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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllNotifications();
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
  }, []);

  const handleClickOnRow = (params) => {
    const notificationID = params.row?.MaThongBao;
    if (notificationID) navigate(`/calendars/update-calendar/${notificationID}`);
  };

  const displayed = notifications.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="custom-table-container">
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>Mã Thông Báo</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Thời Gian</TableCell>
              <TableCell>Loại Thông Báo</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="table-empty">Không có dữ liệu</TableCell></TableRow>
            ) : (
              displayed.map((n) => (
                <TableRow key={n.MaThongBao} onClick={() => handleClickOnRow(n)}>
                  <TableCell>{n.MaThongBao}</TableCell>
                  <TableCell>{n.NoiDung}</TableCell>
                  <TableCell>{n.ThoiGian}</TableCell>
                  <TableCell>{n.LoaiThongBao}</TableCell>
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
    </Paper>
  );
}

export default TableCalendar;