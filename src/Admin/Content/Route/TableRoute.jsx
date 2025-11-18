import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { getAllRoutes } from '../../../service/apiService';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'Id', headerName: 'ID', width: 70 },
  { field: 'MaTuyen', headerName: 'Mã Tuyến', width: 130 },
  { field: 'Name', headerName: 'Tên Tuyến', width: 200 },
  { field: 'DriverId', headerName: 'Tài Xế', width: 130 },
  { field: 'VehicleId', headerName: 'Xe', width: 100 },
  { field: 'Status', headerName: 'Trạng Thái', width: 130 },
];

const TableRoute = (props) => {
  const { rowSelected, setRowSelected } = props;
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllRoutes();
        const list = res?.data || res || [];
        setRoutes(list);
      } catch (err) {
        console.error('Lấy routes lỗi', err);
        setRoutes([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleClickOnRow = (params) => {
    const routeID = params.row?.Id;
    if (routeID) navigate(`/Routes/update-route/${routeID}`);
  };

  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={routes}
        getRowId={(row) => row.Id}
        columns={columns}
        loading={loading}
        rowHeight={40}
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
          '& .MuiDataGrid-cell:focus': {
            outline: 'none',
          },
        }}
      />
    </Paper>
  );
}

export default TableRoute;