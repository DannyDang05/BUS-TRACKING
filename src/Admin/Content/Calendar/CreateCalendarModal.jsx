import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../service/apiService';

const CreateCalendarModal = ({ open, onClose, onRefresh } = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaThongBao: '',
    NoiDung: '',
    ThoiGian: '',
    LoaiThongBao: ''
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
      await createNotification(formData);
      setFormData({
        MaThongBao: '',
        NoiDung: '',
        ThoiGian: '',
        LoaiThongBao: ''
      });
      onRefresh?.();
      onClose?.();
      navigate('/calendar');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo thông báo lỗi');
      console.error('Error creating notification:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/calendar'));

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Thông Báo Mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
          <TextField
            label="Mã Thông Báo"
            name="MaThongBao"
            value={formData.MaThongBao}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Nội Dung"
            name="NoiDung"
            value={formData.NoiDung}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
            disabled={loading}
          />
          <TextField
            label="Thời Gian"
            name="ThoiGian"
            type="datetime-local"
            value={formData.ThoiGian}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
          <TextField
            label="Loại Thông Báo"
            name="LoaiThongBao"
            value={formData.LoaiThongBao}
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

export default CreateCalendarModal;