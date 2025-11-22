import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Tooltip
} from "@mui/material";
import {  useNavigate } from "react-router-dom";
import VisibilityIcon from '@mui/icons-material/Visibility';

/**
 * routes: mảng object có shape: { RouteCode, StartTime, LicensePlate }
 */
const TableRoute = () => {
    const navigate = useNavigate()
    const handleDetailClick = (routeCode) =>{
        navigate(`/driver/schedule/${routeCode}`)

    }
    const routes = [
        {
            RouteCode: "T01",
            RouteName: "Bến Thành - Suối Tiên",
            StartTime: "05:00 AM",
            LicensePlate: "51B-123.45",
        },
        {
            RouteCode: "T02",
            RouteName: "Chợ Lớn - Khu Công Nghệ Cao",
            StartTime: "06:15 AM",
            LicensePlate: "50F-987.65",
        },
        {
            RouteCode: "T03",
            RouteName: "KDC Nam - Sân Bay",
            StartTime: "04:30 AM",
            LicensePlate: "29A-456.78",
        },
    ];
    return (
        <div className="driver-table">
        <TableContainer component={Paper} className="custom-table">
            <Table aria-label="route table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã Tuyến</TableCell>
                        <TableCell>Tên Tuyến</TableCell>
                        <TableCell>Thời Gian Bắt Đầu</TableCell>
                        <TableCell>Biển Số Xe</TableCell>
                        <TableCell>Hành Động</TableCell>
                    </TableRow>
                </TableHead>

                <TableBody>
                    {routes.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                Không có dữ liệu
                            </TableCell>
                        </TableRow>
                    ) : (
                        routes.map((r, idx) => (
                            <TableRow key={r.RouteCode ?? idx}>
                                <TableCell>{r.RouteCode}</TableCell>
                                <TableCell>{r.RouteName}</TableCell>
                                <TableCell>{r.StartTime}</TableCell>
                                <TableCell>{r.LicensePlate}</TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Xem chi tiết tuyến">
                                        <IconButton
                                            size="small"
                                            color="primary"
                                            onClick={()=>handleDetailClick(r.RouteCode)}
                                        >
                                            <VisibilityIcon />
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

export default TableRoute;
