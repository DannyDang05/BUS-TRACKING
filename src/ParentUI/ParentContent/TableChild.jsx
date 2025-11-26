import { React, useEffect, useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Stack,
    Typography,
    Button,
    Tooltip,
    IconButton
} from '@mui/material';


import { MdVisibility } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { getStudentByParent } from '../../service/apiService';
// DỮ LIỆU MOCK MỚI
const mockStudents = [
    {
        StudentId: 'HS001',
        Name: 'Trần Thị Mai',
        Class: '12A1',
        Status: 'Đã lên xe',
        PickupPoint: 'Cổng KTX A',
        Address: '123 Đường Nguyễn Văn Linh'
    },
    {
        StudentId: 'HS002',
        Name: 'Nguyễn Văn Hùng',
        Class: '10B2',
        Status: 'Chưa đón',
        PickupPoint: 'Tòa nhà B',
        Address: '456 Phố Điện Biên Phủ'
    },
    {
        StudentId: 'HS003',
        Name: 'Phạm Thanh Thảo',
        Class: '11C3',
        Status: 'Vắng mặt',
        PickupPoint: 'Nhà sách X',
        Address: '789 Đại lộ Thống Nhất'
    },
    {
        StudentId: 'HS004',
        Name: 'Lê Văn Khỏe',
        Class: '9D4',
        Status: 'Đã trả',
        PickupPoint: 'Trường A',
        Address: '101 Đường Trần Hưng Đạo'
    },
]

// Hàm Helper cho màu trạng thái (Chỉ dùng để hiển thị màu tĩnh)
const getStatusColor = (status) => {
    switch (status) {
        case 'Đã lên xe':
        case 'Đã trả':
            return 'success.main';
        case 'Chưa đón':
            return 'warning.main';
        case 'Vắng mặt':
            return 'error.main';
        default:
            return 'text.primary';
    }
};


// Component Giao Diện Tĩnh (Không có props logic)
const TableChild = () => {
    const [loading, setLoading] = useState(false);
    const [list, setList] = useState([]);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const parentId = localStorage.getItem('parent_profile');
                const res = await getStudentByParent(parentId);
                // apiService interceptor returns `response.data` shape, which our backend wraps as { errorCode, message, data }
                const list = res?.data || [];
                setList(list);
            } catch (err) {
                console.error('Lấy danh sách lỗi', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);
    const navigate = useNavigate()
    const handleClick = (studentCode) => {
        navigate(`/parent/map/${studentCode}`)
    }
    // Hàm giả (dummy handlers) cho giao diện tĩnh
    const handleActionClick = () => {
        console.log('Action button clicked (Static UI)');
    };
    return (
        <div className='parent-table'>
            <TableContainer component={Paper} elevation={3}>
                <Table aria-label="student list table">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: 'grey.100' }}>
                            <TableCell sx={{ fontWeight: 'bold' }}>Mã HS</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Tên Học sinh</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Lớp</TableCell> {/* CỘT MỚI */}
                            <TableCell sx={{ fontWeight: 'bold' }}>Điểm Đón</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Địa chỉ Đón</TableCell> {/* CỘT MỚI */}
                            <TableCell sx={{ fontWeight: 'bold' }}>Trạng Thái</TableCell>
                            <TableCell sx={{ fontWeight: 'bold' }}>Hành Động</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center"> {/* COLSPAN ĐÃ TĂNG LÊN 7 */}
                                    Không có học sinh nào trên tuyến này
                                </TableCell>
                            </TableRow>
                        ) : (
                            list.map((student) => (
                                <TableRow
                                    key={student.MaHocSinh}
                                    sx={{
                                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                    }}
                                >
                                    <TableCell component="th" scope="row">{student.MaHocSinh}</TableCell>
                                    <TableCell>{student.HoTen}</TableCell>
                                    <TableCell>{student.Lop}</TableCell>
                                    <TableCell>{student.PointName}</TableCell>
                                    <TableCell sx={{ fontSize: '0.85rem' }}>{student.DiaChi}</TableCell> {/* DỮ LIỆU ĐỊA CHỈ */}
                                    <TableCell
                                        sx={{
                                            color: getStatusColor(student.TinhTrangDon),
                                            fontWeight: 'bold'
                                        }}
                                    >
                                        {student.TinhTrangDon}
                                    </TableCell>
                                    <TableCell>
                                        <Tooltip title="Xem chi tiết">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleClick(student.StudentId)}
                                            >
                                                <MdVisibility />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
};

export default TableChild;