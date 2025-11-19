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
import { getAllDrivers } from '../../../service/apiService'; // Import hàm API

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllDrivers();
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
  }, []);

  const handleClickOnRow = (driverID) =>{
    if (driverID) navigate(`/drivers/update-driver/${driverID}`);
  }

  const displayed = drivers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="custom-table-container">
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ và Tên</TableCell>
              <TableCell>Mã Bằng Lái</TableCell>
              <TableCell>Số Điện Thoại</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="table-empty">⏳ Đang tải dữ liệu...</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="table-empty">Không có dữ liệu</TableCell></TableRow>
            ) : (
              displayed.map((d) => (
                <TableRow key={d.Id} onClick={() => handleClickOnRow(d.Id)}>
                  <TableCell>{d.Id}</TableCell>
                  <TableCell>{d.FullName}</TableCell>
                  <TableCell>{d.MaBangLai}</TableCell>
                  <TableCell>{d.PhoneNumber}</TableCell>
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
        <PaginationControls count={drivers.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
    </Paper>
  );
}

export default TableDriver;