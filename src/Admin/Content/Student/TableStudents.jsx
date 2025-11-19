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
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';

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
          const res = await getAllStudents(search);
          const list = res?.data || res || [];
          setStudents(list);
            } catch (err) {
                console.error('Lấy students lỗi', err);
                setStudents([]);
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

    const handleClickOnRow = (params) => {
      const studentID = params?.MaHocSinh || params;
      if (studentID) navigate(`/students/update-student/${studentID}`);
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
        setLoading(true);
        const res = await getAllStudents(search);
        const list = res?.data || res || [];
        setStudents(list);
      } catch (err) {
        console.error('Xóa học sinh thất bại', err);
        alert('Xóa thất bại');
      } finally {
        setLoading(false);
      }
    }

    const displayed = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper className="custom-table-container">
          <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              placeholder="Tìm kiếm học sinh (mã, tên, lớp)..."
              value={localSearch}
              onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
              className="global-search-input"
              style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
            />
            <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{students.length} kết quả</div>
          </div>
          <TableContainer>
            <Table className="custom-table">
              <TableHead>
                <TableRow>
                  <TableCell>Mã HS</TableCell>
                  <TableCell>Họ Tên</TableCell>
                  <TableCell>Lớp</TableCell>
                  <TableCell>Tình Trạng</TableCell>
                  <TableCell>Phụ Huynh</TableCell>
                  <TableCell>Điểm Đón</TableCell>
                  <TableCell>Hành Động</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
                    ) : displayed.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">Không có dữ liệu</TableCell></TableRow>
                    ) : (
                  displayed.map((s) => (
                    <TableRow key={s.MaHocSinh}>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaHocSinh}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.HoTen}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.Lop}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.TinhTrang}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaPhuHuynh}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaDiemDon}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(s.MaHocSinh); setConfirmOpen(true); }} title="Xóa" color="error">
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
            <PaginationControls count={students.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
          </div>
          <ConfirmDialog open={confirmOpen} title="Xác nhận xóa" message="Bạn có chắc muốn xóa học sinh này?" onClose={handleConfirmResult} />
        </Paper>
    );
}

export default TableStudent;