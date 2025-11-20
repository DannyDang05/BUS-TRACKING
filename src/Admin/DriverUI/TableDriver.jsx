import React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";

/**
 * routes: mảng object có shape: { RouteCode, StartTime, LicensePlate }
 */
const TableRoute = ({ routes = [] }) => {
    return (
        <TableContainer component={Paper}>
            <Table aria-label="route table">
                <TableHead>
                    <TableRow>
                        <TableCell>Mã Tuyến</TableCell>
                        <TableCell>Tên Tuyến</TableCell>
                        <TableCell>Thời Gian Bắt Đầu</TableCell>
                        <TableCell>Biển Số Xe</TableCell>

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

                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TableRoute;
