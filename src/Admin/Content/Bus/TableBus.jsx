import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllVehicles, deleteVehicle } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
 

const columns = [
  { field: 'Id', headerName: 'ID', width: 100 },
  { field: 'LicensePlate', headerName: 'Biển Số', width: 200 },
  { field: 'Model', headerName: 'Model', width: 250 },
  { field: 'SpeedKmh', headerName: 'Tốc Độ (km/h)', width: 200 },
];

const TableBus = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [localSearch, setLocalSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  const { t } = useLanguage();

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getAllVehicles(search);
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
  }, [search]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (params) => {
    const vehicleID = params?.Id || params?.row?.Id || params;
    if (vehicleID) navigate(`/buses/update-bus/${vehicleID}`);
  };

  const handleDelete = async (id) => {
    setConfirmTarget(id);
    setConfirmOpen(true);
  };

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const id = confirmTarget;
    setConfirmTarget(null);
    if (!result || !id) return;
    try {
      await deleteVehicle(id);
      toast.success('Xóa xe thành công!');
      setLoading(true);
      const res = await getAllVehicles(search);
      const list = res?.data || res || [];
      setVehicles(list);
    } catch (err) {
      console.error('Xóa xe thất bại', err);
      toast.error(err?.response?.data?.message || 'Xóa xe thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const displayed = vehicles.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <Paper className="custom-table-container">
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder={t('searchPlaceholder') + ' (biển số, model)...'}
          value={localSearch}
          onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
          className="global-search-input"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{vehicles.length} {t('results')}</div>
      </div>
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>{t('licensePlate') || 'Biển Số'}</TableCell>
              <TableCell>{t('model') || 'Model'}</TableCell>
              <TableCell>{t('speed') || 'Tốc Độ (km/h)'}</TableCell>
              <TableCell>{t('action') || 'Hành Động'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={5} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="table-empty">{t('noData')}</TableCell></TableRow>
            ) : (
              displayed.map((v) => (
                <TableRow key={v.Id} onClick={() => handleClickOnRow(v)}>
                  <TableCell>{v.Id}</TableCell>
                  <TableCell>{v.LicensePlate}</TableCell>
                  <TableCell>{v.Model}</TableCell>
                  <TableCell>{v.SpeedKmh}</TableCell>
                  <TableCell align="center">
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(v.Id); setConfirmOpen(true); }} title={t('delete')} color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="custom-table-footer">
        <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
          <option value={5}>5 {t('perPage')}</option>
          <option value={10}>10 {t('perPage')}</option>
          <option value={20}>20 {t('perPage')}</option>
          <option value={50}>50 {t('perPage')}</option>
        </select>
        <PaginationControls count={vehicles.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </Paper>
  );
}

export default TableBus;