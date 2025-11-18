import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { getAllVehicles } from '../../../service/apiService';
import Paper from '@mui/material/Paper';

const columns = [
  { field: 'Id', headerName: 'ID', width: 70 },
  { field: 'LicensePlate', headerName: 'Biển Số', width: 130 },
  { field: 'Model', headerName: 'Model', width: 150 },
  { field: 'SpeedKmh', headerName: 'Tốc Độ (km/h)', width: 130 },
];

const TableBus = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);

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
    const vehicleID = params.row?.Id;
    if (vehicleID) navigate(`/buses/update-bus/${vehicleID}`);
  };

  return (
    <Paper sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={vehicles}
        getRowId={(row) => row.Id}
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

export default TableBus;