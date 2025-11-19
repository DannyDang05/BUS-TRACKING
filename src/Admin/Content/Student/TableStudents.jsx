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
import { getAllStudents } from '../../../service/apiService'; // Import API

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
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const res = await getAllStudents();
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
    }, []);

    const handleClickOnRow = (params) => {
      const studentID = params?.MaHocSinh || params;
      if (studentID) navigate(`/students/update-student/${studentID}`);
    }

    const displayed = students.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Paper className="custom-table-container">
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
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={6} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
                ) : displayed.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="table-empty">Không có dữ liệu</TableCell></TableRow>
                ) : (
                  displayed.map((s) => (
                    <TableRow key={s.MaHocSinh} onClick={() => handleClickOnRow(s.MaHocSinh)}>
                      <TableCell>{s.MaHocSinh}</TableCell>
                      <TableCell>{s.HoTen}</TableCell>
                      <TableCell>{s.Lop}</TableCell>
                      <TableCell>{s.TinhTrang}</TableCell>
                      <TableCell>{s.MaPhuHuynh}</TableCell>
                      <TableCell>{s.MaDiemDon}</TableCell>
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
        </Paper>
    );
}

export default TableStudent;