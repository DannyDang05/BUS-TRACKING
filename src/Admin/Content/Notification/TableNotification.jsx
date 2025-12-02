import * as React from 'react';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { getAllNotifications, deleteNotification } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import PaginationControls from '../PaginationControls';

const TableNotification = ({ onUpdate }) => {
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
      onUpdate && onUpdate(); // Refresh stats
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
    const notificationId = params.row?.MaThongBao;
    if (notificationId) navigate(`/notifications/update-notification/${notificationId}`);
  };

  const displayed = notifications;

  return (
    <>
      <div style={{ padding: '16px 24px', display: 'flex', gap: 8, alignItems: 'center', background: '#fff' }}>
        <input
          placeholder={t('searchPlaceholder') + ' (mã, nội dung, loại)...'}
          value={localSearch}
          onChange={(e) => { setLocalSearch(e.target.value); setPage(0); }}
          className="global-search-input"
          style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1px solid #ddd', fontSize: '0.95rem' }}
        />
        <div style={{ minWidth: 140, textAlign: 'right', color: '#666', fontWeight: '500' }}>{totalCount} {t('results')}</div>
      </div>
      <TableContainer sx={{ overflow: 'visible' }}>
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
              displayed.map((n, index) => (
                <TableRow 
                  key={n.MaThongBao} 
                  // onClick={() => handleClickOnRow({ row: n })}
                  sx={{
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(0, 151, 167, 0.08)',
                      transform: 'scale(1.01)',
                      boxShadow: '0 2px 8px rgba(0, 151, 167, 0.15)'
                    }
                  }}
                >
                  <TableCell sx={{ fontWeight: '500' }}>{page * rowsPerPage + index + 1}</TableCell>
                  <TableCell sx={{ fontWeight: '600', color: '#0097a7' }}>{n.MaThongBao}</TableCell>
                  <TableCell sx={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {n.NoiDung}
                  </TableCell>
                  <TableCell>{n.ThoiGian}</TableCell>
                  <TableCell>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.85rem',
                      fontWeight: '600',
                      background: n.LoaiThongBao === 'Khẩn cấp' 
                        ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)'
                        : n.LoaiThongBao === 'Thông báo'
                        ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)'
                        : 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
                      color: 'white',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                    }}>
                      {n.LoaiThongBao || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      size="small" 
                      onClick={(e) => { e.stopPropagation(); setConfirmTarget(n.MaThongBao); setConfirmOpen(true); }} 
                      title={t('delete')} 
                      color="error"
                      sx={{
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.2)',
                          backgroundColor: 'rgba(244, 67, 54, 0.1)'
                        }
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="custom-table-footer" style={{ background: '#fff', borderTop: '1px solid #e0e0e0' }}>
        <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
          <option value={5}>5 {t('perPage')}</option>
          <option value={10}>10 {t('perPage')}</option>
          <option value={20}>20 {t('perPage')}</option>
          <option value={50}>50 {t('perPage')}</option>
        </select>
        <PaginationControls count={totalCount} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
      </div>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </>
  );
}

export default TableNotification;
