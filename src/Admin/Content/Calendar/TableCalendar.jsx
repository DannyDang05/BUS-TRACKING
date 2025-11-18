import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { getAllNotifications } from '../../../service/apiService';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'MaThongBao', headerName: 'Mã Thông Báo', width: 120 },
  { field: 'NoiDung', headerName: 'Nội Dung', width: 300 },
  { field: 'ThoiGian', headerName: 'Thời Gian', width: 180 },
  { field: 'LoaiThongBao', headerName: 'Loại Thông Báo', width: 150 },
];

const TableCalendar = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

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

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={notifications}
        getRowId={(row) => row.MaThongBao}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        disableRowSelectionOnClick={true}
        onRowClick={handleClickOnRow}
        sx={{
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Paper>
  );
}

export default TableCalendar;