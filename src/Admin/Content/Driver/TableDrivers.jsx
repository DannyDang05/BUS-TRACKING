import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
// IMPORT HOOKS VÀ API
import { useState, useEffect } from 'react';
import { getAllDrivers } from '../../services/apiService'; // Import hàm API

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

  // BƯỚC 2: STATE ĐỂ LƯU DATA TỪ API
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // BƯỚC 3: GỌI API KHI COMPONENT MỞ RA
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true);
        const apiResponse = await getAllDrivers(); // apiResponse = { errorCode, message, data }
        if (apiResponse && apiResponse.errorCode === 0) {
          setRows(apiResponse.data); // Gán dữ liệu tài xế vào state
        } else {
          console.error(apiResponse.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách tài xế:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrivers();
  }, []); // [] đảm bảo useEffect chỉ chạy 1 lần

  const handleClickOnRow = (params) => {
    // BƯỚC 4: Sửa lại key ID (từ `params.id` thành `params.row.Id` hoặc `params.id` nếu getRowId dùng 'Id')
    const driverID = params.id; 
    navigate(`/drivers/update-driver/${driverID}`);
    console.log("Thông tin hàng:", params.row);
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={rows} // Dùng state 'rows'
        columns={columns}
        loading={loading} // Thêm trạng thái loading
        // BƯỚC 4: BÁO CHO DATAGRID BIẾT TRƯỜNG 'Id' (viết hoa) LÀ KEY UNIQUE
        getRowId={(row) => row.Id} 
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick={true}
        onRowClick={(e) => handleClickOnRow(e)}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Paper>
  );
}

export default TableDriver;