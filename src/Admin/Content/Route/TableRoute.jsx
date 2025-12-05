import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllRoutes, deleteRoute } from '../../../service/apiService';
import { toast } from 'react-toastify';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
import { IconButton, Tooltip, Chip, Box } from '@mui/material';
import { MapTwoTone as MapIcon, LocationOn as LocationIcon, Delete as DeleteIcon } from '@mui/icons-material';
import RouteMapViewer from './RouteMapViewer';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';

const TableRoute = (props) => {
  const { rowSelected, setRowSelected, refreshTrigger } = props;
  const navigate = useNavigate();
  const [routes, setRoutes] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [mapDialogOpen, setMapDialogOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const { t } = useLanguage();

  const handleViewMap = (routeId) => {
    setSelectedRouteId(routeId);
    setMapDialogOpen(true);
  };

  const handleManagePickupPoints = (routeId) => {
    navigate(`/routes/${routeId}/points`);
  };

  const columns = [
    { field: 'Id', headerName: 'ID', width: 80 },
    { field: 'MaTuyen', headerName: 'Mã Tuyến', width: 180 },
    { field: 'VehicleId', headerName: 'ID Xe', width: 150 },
    { field: 'TotalDistance', headerName: 'Tổng Quãng Đường', width: 200 },
    { field: 'EstimatedTime', headerName: 'Thời Gian Ước Tính', width: 200 },
    {
      field: 'actions',
      headerName: 'Hành Động',
      width: 200,
      sortable: false,
      filterable: false
    }
  ];

  // Fetch tất cả routes
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllRoutes(search, page + 1, rowsPerPage);
        const list = res?.data || [];
        setRoutes(list);
        setTotalCount(res?.meta?.totalItems || 0);
      } catch (err) {
        console.error('Lấy routes lỗi', err);
        setRoutes([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, refreshTrigger, page, rowsPerPage]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const displayed = routes;

  return (
    <>
      <Paper className="custom-table-container">
        <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            placeholder={t('searchPlaceholder') + ' (mã, tên, trạng thái)...'}
            value={localSearch}
            onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
            className="global-search-input"
            style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
          />
          <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>
            {totalCount} {t('results')}
          </div>
        </div>
        <TableContainer sx={{ overflow: 'visible' }}>
          <Table className="custom-table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Tên Tuyến</TableCell>
                {/* <TableCell>ID Xe</TableCell> */}
                <TableCell>Tổng Quãng Đường</TableCell>
                <TableCell>Thời Gian Ước Tính</TableCell>
                <TableCell>Hành Động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
              ) : displayed.length === 0 ? (
                <TableRow><TableCell colSpan={6} className="table-empty">{t('noData')}</TableCell></TableRow>
              ) : (
                displayed.map((r) => (
                  <TableRow 
                    key={r.Id}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'rgba(0, 151, 167, 0.08)'
                      }
                    }}
                  >
                    <TableCell>{r.Id}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {r.MaTuyen}
                        {r.MaTuyen?.startsWith('AUTO') && (
                          <Chip 
                            label="AUTO" 
                            size="small" 
                            color="error" 
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        )}
                      </Box>
                    </TableCell>
                    {/* <TableCell>
                      {r.VehicleId || 'Chưa có'}
                    </TableCell> */}
                    <TableCell>
                      {r.TotalDistance ? `${parseFloat(r.TotalDistance).toFixed(2)} km` : 'N/A'}
                    </TableCell>
                    <TableCell>
                      {r.EstimatedTime ? `${Math.round(r.EstimatedTime)} phút` : 'N/A'}
                    </TableCell>
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

        <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={async (result) => {
          setConfirmOpen(false);
          const id = confirmTarget;
          setConfirmTarget(null);
          if (!result || !id) return;
          try {
            await deleteRoute(id);
            toast.success('Xóa tuyến thành công!');
            setLoading(true);
            const res = await getAllRoutes(search, page + 1, rowsPerPage);
            const list = res?.data || [];
            setRoutes(list);
            setTotalCount(res?.meta?.totalItems || 0);
          } catch (err) {
            console.error('Xóa tuyến thất bại', err);
            toast.error(err?.response?.data?.message || 'Xóa tuyến thất bại!');
          } finally {
            setLoading(false);
          }
        }} />

        <div className="custom-table-footer">
          <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
            <option value={5}>5 {t('perPage')}</option>
            <option value={10}>10 {t('perPage')}</option>
            <option value={20}>20 {t('perPage')}</option>
            <option value={50}>50 {t('perPage')}</option>
          </select>
          <PaginationControls count={totalCount} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
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
