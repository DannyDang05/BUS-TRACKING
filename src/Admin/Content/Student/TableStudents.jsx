import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { getAllStudents } from '../../services/apiService'; // Import API

// BƯỚC 1: ĐỊNH NGHĨA CỘT DỰA TRÊN DỮ LIỆU HỌC SINH
//
const columns = [
  { 
    field: 'MaHocSinh', 
    headerName: 'Mã HS', 
    width: 100 
  },
  { 
    field: 'HoTen', 
    headerName: 'Họ và Tên', 
    width: 220 
  },
  { 
    field: 'Lop', 
    headerName: 'Lớp', 
    width: 80 
  },
  {
    field: 'TinhTrang',
    headerName: 'Tình Trạng',
    width: 130,
  },
  {
    field: 'MaPhuHuynh',
    headerName: 'Mã Phụ Huynh',
    width: 130,
  },
  {
    field: 'MaDiemDon',
    headerName: 'Mã Điểm Đón',
    width: 130,
  },
];


const TableStudents = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // BƯỚC 2: GỌI API LẤY DANH SÁCH HỌC SINH
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const apiResponse = await getAllStudents(); // API đã có sẵn
        if (apiResponse && apiResponse.errorCode === 0) {
          setRows(apiResponse.data);
        } else {
          console.error(apiResponse.message);
        }
      } catch (error) {
        console.error("Lỗi khi tải danh sách học sinh:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []); 

  // BƯỚC 3: HÀM CLICK ĐỂ CẬP NHẬT
  const handleClickOnRow = (params) => {
    const studentID = params.id; // .id sẽ là 'MaHocSinh' nhờ getRowId
    navigate(`/students/update-student/${studentID}`)
    console.log("Thông tin hàng:", params.row);
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={rows} 
        columns={columns}
        loading={loading} 
        // BƯỚC 4: BÁO CHO DATAGRID BIẾT KEY UNIQUE LÀ 'MaHocSinh'
        getRowId={(row) => row.MaHocSinh} 
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        disableRowSelectionOnClick={true}
        onRowClick={(e)=>handleClickOnRow(e)}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Paper>
  );
}

export default TableStudents;