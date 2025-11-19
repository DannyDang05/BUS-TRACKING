import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllVehicles } from '../../../service/apiService';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
 

const columns = [
  { field: 'Id', headerName: 'ID', width: 100 },
  { field: 'LicensePlate', headerName: 'Biển Số', width: 200 },
  { field: 'Model', headerName: 'Model', width: 250 },
  { field: 'SpeedKmh', headerName: 'Tốc Độ (km/h)', width: 200 },
];

const TableBus = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllVehicles();
        const list = res?.data || res || [];
        setVehicles(list);
      } catch (err) {
        console.error('Lấy vehicles lỗi', err);
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleClickOnRow = (params) => {
    const vehicleID = params?.Id || params?.row?.Id || params;
    if (vehicleID) navigate(`/buses/update-bus/${vehicleID}`);
  };

  const displayed = vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="custom-table-container">
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Biển Số</TableCell>
              <TableCell>Model</TableCell>
              <TableCell>Tốc Độ (km/h)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={4} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="table-empty">Không có dữ liệu</TableCell></TableRow>
            ) : (
              displayed.map((v) => (
                <TableRow key={v.Id} onClick={() => handleClickOnRow(v)}>
                  <TableCell>{v.Id}</TableCell>
                  <TableCell>{v.LicensePlate}</TableCell>
                  <TableCell>{v.Model}</TableCell>
                  <TableCell>{v.SpeedKmh}</TableCell>
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
        <PaginationControls count={vehicles.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
    </Paper>
  );
}

export default TableBus;