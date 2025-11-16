import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import { Button } from '@mui/material';


import Paper from '@mui/material/Paper';


// 2. Đã xóa ": GridColDef[]" khỏi đây
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  },
];

const rows = [
  { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
  { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
  { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
  { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
  { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: 15 },
  { id: 6, lastName: 'Melisandre', firstName: "Dumb", age: 150 },
  { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
  { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
  { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
];

const DeleteButton = () => {
  return (

    <GridToolbarContainer sx={{ justifyContent: 'flex-end', }}>
      <Button
        variant="contained"
        color="error"
        size="small"
      >
        Delete
      </Button>
    </GridToolbarContainer>
  );
}
const TableRoute = (props) => {
  const { rowSelected, setRowSelected } = props;
  const navigate = useNavigate()
  const handleClickOnRow = (object) => {
    const routeID = object.id
    navigate(`/Routes/update-route/${routeID}`)
    console.log("thongtin", object)
  }
  return (
    <Paper sx={{ width: '100%' }}>
      <DataGrid
        rows={rows}
        rowHeight={40}
        columns={columns}
        autoHeight={true}
        slots={rowSelected ? { toolbar: DeleteButton } : {}}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 }
          }
        }}
        pageSizeOptions={[5, 10]}
        checkboxSelection
        onRowSelectionModelChange={(selection) => setRowSelected(selection.length > 0)}
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

export default TableRoute;