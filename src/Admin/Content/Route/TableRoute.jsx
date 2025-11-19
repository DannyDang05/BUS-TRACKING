import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllRoutes, deleteRoute } from '../../../service/apiService';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
import { IconButton, Tooltip } from '@mui/material';
import { MapTwoTone as MapIcon, LocationOn as LocationIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RouteMapViewer from './RouteMapViewer';
import ConfirmDialog from '../../Shared/ConfirmDialog';

const TableRoute = (props) => {
  const { rowSelected, setRowSelected } = props;
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const handleViewMap = (routeId) => {
    setSelectedRouteId(routeId);
    setMapDialogOpen(true);
  };

  const handleManagePickupPoints = (routeId) => {
    navigate(`/routes/${routeId}/points`);
  };

  const columns = [
    { field: 'Id', headerName: 'ID', width: 100 },
    { field: 'MaTuyen', headerName: 'Mã Tuyến', width: 200 },
    { field: 'Name', headerName: 'Tên Tuyến', width: 300 },
    { field: 'DriverId', headerName: 'Tài Xế', width: 200 },
    { field: 'VehicleId', headerName: 'Xe', width: 150 },
    { field: 'Status', headerName: 'Trạng Thái', width: 200 },
    {
      field: 'actions',
      headerName: 'Hành Động',
      width: 250,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div className="action-flex">
          <Tooltip title="Quản lý điểm đón">
            <IconButton
              size="small"
              onClick={() => handleManagePickupPoints(params.row.Id)}
              sx={{ color: '#FF5733', '&:hover': { bgcolor: '#fff3f0' } }}
            >
              <LocationIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Xem trên bản đồ">
            <IconButton
              size="small"
              onClick={() => handleViewMap(params.row.Id)}
              sx={{ color: 'primary.main' }}
            >
              <MapIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </div>
      )
    }
  ];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllRoutes(search);
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
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const displayed = routes.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <>
      <Paper className="custom-table-container">
        <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder="Tìm kiếm tuyến (mã, tên, trạng thái)..."
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
            className="global-search-input"
            style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{routes.length} kết quả</div>
        </div>
        <TableContainer>
          <Table className="custom-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Mã Tuyến</TableCell>
                <TableCell>Tên Tuyến</TableCell>
                <TableCell>Tài Xế</TableCell>
                <TableCell>Xe</TableCell>
                <TableCell>Trạng Thái</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} className="table-empty">⏳ Đang tải...</TableCell></TableRow>
              ) : displayed.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="table-empty">Không có dữ liệu</TableCell></TableRow>
              ) : (
                displayed.map((r) => (
                  <TableRow key={r.Id}>
                    <TableCell>{r.Id}</TableCell>
                    <TableCell>{r.MaTuyen}</TableCell>
                    <TableCell>{r.Name}</TableCell>
                    <TableCell>{r.DriverId}</TableCell>
                    <TableCell>{r.VehicleId}</TableCell>
                    <TableCell>{r.Status}</TableCell>
                    <TableCell>
                      <div className="table-actions">
                        <Tooltip title="Quản lý điểm đón">
                          <IconButton size="small" onClick={() => handleManagePickupPoints(r.Id)} sx={{ color: '#FF5733' }}>
                            <LocationIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xem trên bản đồ">
                          <IconButton size="small" onClick={() => handleViewMap(r.Id)} sx={{ color: 'primary.main' }}>
                            <MapIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa tuyến">
                          <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(r.Id); setConfirmOpen(true); }} sx={{ color: 'error.main' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <ConfirmDialog open={confirmOpen} title="Xác nhận xóa" message="Bạn có chắc muốn xóa tuyến này?" onClose={async (result) => {
          setConfirmOpen(false);
          const id = confirmTarget;
          setConfirmTarget(null);
          if (!result || !id) return;
          try {
            await deleteRoute(id);
            setLoading(true);
            const res = await getAllRoutes(search);
            const list = res?.data || res || [];
            setRoutes(list);
          } catch (err) {
            console.error('Xóa tuyến thất bại', err);
            alert('Xóa thất bại');
          } finally {
            setLoading(false);
          }
        }} />

        <div className="custom-table-footer">
          <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
            <option value={5}>5 / trang</option>
            <option value={10}>10 / trang</option>
            <option value={20}>20 / trang</option>
            <option value={50}>50 / trang</option>
          </select>
          <PaginationControls count={routes.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
        </div>
      </Paper>

      <RouteMapViewer 
        open={mapDialogOpen} 
        onClose={() => setMapDialogOpen(false)} 
        routeId={selectedRouteId}
      />
    </>
  );
}

export default TableRoute;
