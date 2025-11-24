import * as React from 'react';
import { useNavigate } from "react-router-dom"
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import PaginationControls from '../PaginationControls';
import { useState, useEffect } from 'react';
import { getAllStudents, deleteStudent } from '../../../service/apiService'; // Import API
import { toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import { Delete as DeleteIcon } from '@mui/icons-material';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';

// Định nghĩa cột dựa trên schema DB (hocsinh)
const columns = [
    { field: 'MaHocSinh', headerName: 'Mã HS', width: 150 },
    { field: 'HoTen', headerName: 'Họ Tên', width: 300 },
    { field: 'Lop', headerName: 'Lớp', width: 150 },
    { field: 'TinhTrang', headerName: 'Tình Trạng', width: 200 },
    { field: 'MaPhuHuynh', headerName: 'Mã Phụ Huynh', width: 200 },
    { field: 'MaDiemDon', headerName: 'Điểm Đón', width: 150 },
];

const TableStudent = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
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
                const res = await getAllStudents(search, page + 1, rowsPerPage);
                const list = res?.data || [];
                setStudents(list);
                setTotalCount(res?.meta?.totalItems || 0);
            } catch (err) {
                console.error('Lấy students lỗi', err);
                setStudents([]);
                setTotalCount(0);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, [search, page, rowsPerPage]);

    // debounce localSearch -> search
    useEffect(() => {
      const t = setTimeout(() => setSearch(localSearch), 350);
      return () => clearTimeout(t);
    }, [localSearch]);

    const handleClickOnRow = (params) => {
      const studentID = params?.MaHocSinh || params;
      if (studentID) navigate(`/students/update-student/${studentID}`);
    }

    const handleDelete = async (id) => {
        // open confirm dialog
        setConfirmTarget(id);
        setConfirmOpen(true);
    }

    const handleConfirmResult = async (result) => {
      setConfirmOpen(false);
      const id = confirmTarget;
      setConfirmTarget(null);
      if (!result || !id) return;
      try {
        await deleteStudent(id);
        toast.success('Xóa học sinh thành công!');
        setLoading(true);
        const res = await getAllStudents(search, page + 1, rowsPerPage);
        const list = res?.data || [];
        setStudents(list);
        setTotalCount(res?.meta?.totalItems || 0);
      } catch (err) {
        console.error('Xóa học sinh thất bại', err);
        toast.error(err?.response?.data?.message || 'Xóa học sinh thất bại!');
      } finally {
        setLoading(false);
      }
    }

    const displayed = students;

    return (
        <Paper className="custom-table-container">
          <div style={{ padding: '8px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                placeholder={t('searchPlaceholder') + ' (mã, tên, lớp)...'}
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
                  <TableCell>{t('MaHocSinh') || 'Mã HS'}</TableCell>
                  <TableCell>{t('HoTen') || 'Họ Tên'}</TableCell>
                  <TableCell>{t('Lop') || 'Lớp'}</TableCell>
                  <TableCell>{t('TinhTrang') || 'Tình Trạng'}</TableCell>
                  <TableCell>{t('MaPhuHuynh') || 'Phụ Huynh'}</TableCell>
                  <TableCell>{t('MaDiemDon') || 'Điểm Đón'}</TableCell>
                  <TableCell>{t('action') || 'Hành Động'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                    {loading ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">⏳ {t('loading')}</TableCell></TableRow>
                    ) : displayed.length === 0 ? (
                      <TableRow><TableCell colSpan={7} className="table-empty">{t('noData')}</TableCell></TableRow>
                    ) : (
                  displayed.map((s) => (
                    <TableRow key={s.MaHocSinh}>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaHocSinh}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.HoTen}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.Lop}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.TinhTrang}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaPhuHuynh}</TableCell>
                      <TableCell onClick={() => handleClickOnRow(s.MaHocSinh)}>{s.MaDiemDon}</TableCell>
                      <TableCell align="center">
                        <IconButton size="small" onClick={(e) => { e.stopPropagation(); setConfirmTarget(s.MaHocSinh); setConfirmOpen(true); }} title={t('delete')} color="error">
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

export default TableStudent;