import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { DataGrid , GridToolbarContainer} from '@mui/x-data-grid';
import { Button } from '@mui/material';


import Paper from '@mui/material/Paper';
import { useState, useEffect } from 'react';
import { getAllStudents } from '../../../service/apiService'; // Import API

// Định nghĩa cột dựa trên schema DB (hocsinh)
const columns = [
    { field: 'MaHocSinh', headerName: 'Mã HS', width: 120 },
    { field: 'HoTen', headerName: 'Họ Tên', width: 250 },
    { field: 'Lop', headerName: 'Lớp', width: 120 },
    { field: 'TinhTrang', headerName: 'Tình Trạng', width: 150 },
    { field: 'MaPhuHuynh', headerName: 'Mã Phụ Huynh', width: 150 },
    { field: 'MaDiemDon', headerName: 'Điểm Đón', width: 120 },
];

const TableStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(false);

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
        const studentID = params.row?.MaHocSinh;
        if (studentID) navigate(`/students/update-student/${studentID}`);
    }

    return (
        <Paper sx={{ height: "100%", width: '100%' }}>
            <DataGrid
                rows={students}
                getRowId={(row) => row.MaHocSinh}
                columns={columns}
                loading={loading}
                initialState={{
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 }
                    }
                }}
                pageSizeOptions={[5, 10]}
                disableRowSelectionOnClick
                onRowClick={handleClickOnRow}
                sx={{ '& .MuiDataGrid-cell:focus': { outline: 'none' } }}

            />
        </Paper>
    );
}

export default TableStudent;