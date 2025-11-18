import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
// IMPORT HOOKS VÀ API
import { useState, useEffect } from 'react';
import { getAllDrivers } from '../../../service/apiService'; // Import hàm API

// BƯỚC 1: CẬP NHẬT CÁC CỘT ĐỂ KHỚP VỚI DATABASE
// Dữ liệu từ API sẽ có các trường: Id, FullName, MaBangLai, PhoneNumber
const columns = [
  { 
    field: 'Id', // Khớp chính xác với tên trường từ API
    headerName: 'ID', 
    width: 90 
  },
  { 
    field: 'FullName', // Khớp chính xác với tên trường từ API
    headerName: 'Họ và Tên', 
    width: 250 
  },
  { 
    field: 'MaBangLai', // Khớp chính xác với tên trường từ API
    headerName: 'Mã Bằng Lái', 
    width: 150 
  },
  {
    field: 'PhoneNumber', // Khớp chính xác với tên trường từ API
    headerName: 'Số Điện Thoại',
    width: 200,
  },
];


const TableDriver = () => {
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleClickOnRow = (params) =>{
    const driverID = params.row?.Id;
    if (driverID) navigate(`/drivers/update-driver/${driverID}`);
  }

  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={drivers}
        getRowId={(row) => row.Id}
        columns={columns}
        loading={loading}
        autoHeight
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick
        onRowClick={handleClickOnRow}
        sx={{
          '& .MuiDataGrid-cell:focus': { outline: 'none' }
        }}
      />
    </Paper>
  );
}

export default TableDriver;