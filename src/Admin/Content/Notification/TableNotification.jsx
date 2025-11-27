import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllNotifications, deleteNotification } from '../../../service/apiService';
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

const TableNotification = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
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
        const res = await getAllNotifications(search, page + 1, rowsPerPage);
        const list = res?.data || [];
        setNotifications(list);
        setTotalCount(res?.meta?.totalItems || 0);
      } catch (err) {
        console.error('Lấy notifications lỗi', err);
        setNotifications([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, page, rowsPerPage]);

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const id = confirmTarget;
    setConfirmTarget(null);
    if (!result || !id) return;
    try {
      await deleteNotification(id);
      toast.success('Xóa thông báo thành công!');
      setLoading(true);
      const res = await getAllNotifications(search, page + 1, rowsPerPage);
      const list = res?.data || [];
      setNotifications(list);
      setTotalCount(res?.meta?.totalItems || 0);
    } catch (err) {
      console.error('Xóa thông báo thất bại', err);
      toast.error(err?.response?.data?.message || 'Xóa thông báo thất bại!');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => setSearch(localSearch), 350);
    return () => clearTimeout(t);
  }, [localSearch]);

  const handleClickOnRow = (params) => {
    const notificationId = params.row?.id;
    if (notificationId) navigate(`/notifications/update-notification/${notificationId}`);
  };

  const displayed = notifications;

  return (
    <Paper className="custom-table-container">
      <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <input
          placeholder={t('searchPlaceholder')}
          value={localSearch}
          onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
          className="global-search-input"
          style={{ flex: 1, padding: '8px 10px', borderRadius: 6, border: '1px solid #ddd' }}
        />
        <div style={{ minWidth: 140, textAlign: 'right', color: '#666' }}>{totalCount} {t('results')}</div>
      </div>
      <TableContainer>
        <Table className="custom-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Mã Thông Báo</TableCell>
              <TableCell>Nội Dung</TableCell>
              <TableCell>Thời Gian</TableCell>
              <TableCell>Loại Thông Báo</TableCell>
              <TableCell>Hành Động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
              {loading ? (
              <TableRow><TableCell colSpan={6} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
            ) : displayed.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="table-empty">{t('noData')}</TableCell></TableRow>
            ) : (
              displayed.map((n) => (
                <TableRow key={n.id} onClick={() => handleClickOnRow({ row: n })}>
                  <TableCell>{n.id}</TableCell>
                  <TableCell>{n.MaThongBao}</TableCell>
                  <TableCell>{n.NoiDung}</TableCell>
                  <TableCell>{n.ThoiGian}</TableCell>
                  <TableCell>{n.LoaiThongBao}</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(n.id); setConfirmOpen(true); }} title={t('delete')} color="error">
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
        <PaginationControls count={totalCount} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </Paper>
  );
}

export default TableNotification;
