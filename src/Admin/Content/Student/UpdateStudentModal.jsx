import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, getStudentById } from '../../../service/apiService';

const UpdateStudentModal = ({ open, onClose, student, onRefresh } = {}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    MaHocSinh: '',
    HoTen: '',
    Lop: '',
    TinhTrang: '',
    MaPhuHuynh: '',
    MaDiemDon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        MaHocSinh: student.MaHocSinh || '',
        HoTen: student.HoTen || '',
        Lop: student.Lop || '',
        TinhTrang: student.TinhTrang || '',
        MaPhuHuynh: student.MaPhuHuynh || '',
        MaDiemDon: student.MaDiemDon || ''
      });
    } else if (id) {
      // Fetch student data from API using id from URL params
      getStudentById(id).then(res => {
        const data = res?.data || res;
        setFormData({
          MaHocSinh: data.MaHocSinh || '',
          HoTen: data.HoTen || '',
          Lop: data.Lop || '',
          TinhTrang: data.TinhTrang || '',
          MaPhuHuynh: data.MaPhuHuynh || '',
          MaDiemDon: data.MaDiemDon || ''
        });
      }).catch(err => console.error('Error fetching student:', err));
    }
  }, [student, id, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const studentId = student?.MaHocSinh || id;
      await updateStudent(studentId, formData);
      onRefresh?.();
      onClose?.();
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật học sinh lỗi');
      console.error('Error updating student:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/students'));

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth="sm" fullWidth>
      <DialogTitle>Cập Nhật Học Sinh</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
          <TextField
            label="Mã Học Sinh"
            name="MaHocSinh"
            value={formData.MaHocSinh}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Họ Tên"
            name="HoTen"
            value={formData.HoTen}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Lớp"
            name="Lop"
            value={formData.Lop}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Tình Trạng"
            name="TinhTrang"
            value={formData.TinhTrang}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Mã Phụ Huynh"
            name="MaPhuHuynh"
            value={formData.MaPhuHuynh}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Mã Điểm Đón"
            name="MaDiemDon"
            value={formData.MaDiemDon}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={closeHandler} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStudentModal;
