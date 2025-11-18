import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';

const UpdateCalendarModal = ({ open, onClose, notification }) => {
  const [formData, setFormData] = useState({
    MaThongBao: '',
    NoiDung: '',
    ThoiGian: '',
    LoaiThongBao: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (notification) {
      setFormData({
        MaThongBao: notification.MaThongBao || '',
        NoiDung: notification.NoiDung || '',
        ThoiGian: notification.ThoiGian || '',
        LoaiThongBao: notification.LoaiThongBao || ''
      });
    }
  }, [notification, open]);

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
    // For now, just close the dialog
    // If you want to update, implement the updateNotification API call
    try {
      onClose();
    } catch (err) {
      setError('Cập nhật thông báo lỗi');
      console.error('Error updating notification:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập Nhật Thông Báo</DialogTitle>
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
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCalendarModal;