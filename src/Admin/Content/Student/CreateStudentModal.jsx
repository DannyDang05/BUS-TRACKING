import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createStudent } from '../../../service/apiService';

const CreateStudentModal = ({ open, onClose, onRefresh } = {}) => {
  const navigate = useNavigate();
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
      await createStudent(formData);
      setFormData({
        MaHocSinh: '',
        HoTen: '',
        Lop: '',
        TinhTrang: '',
        MaPhuHuynh: '',
        MaDiemDon: ''
      });
      onRefresh?.();
      onClose?.();
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo học sinh lỗi');
      console.error('Error creating student:', err);
    } finally {
      setLoading(false);
    }
  };

  // Nếu dùng như route element, luôn open
  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/students'));

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Học Sinh Mới</DialogTitle>
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
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateStudentModal;
