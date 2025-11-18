import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createRoute } from '../../../service/apiService';

const CreateRouteModal = ({ open, onClose, onRefresh } = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaTuyen: '',
    Name: '',
    DriverId: '',
    VehicleId: '',
    Status: ''
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
      await createRoute(formData);
      setFormData({
        MaTuyen: '',
        Name: '',
        DriverId: '',
        VehicleId: '',
        Status: ''
      });
      onRefresh?.();
      onClose?.();
      navigate('/routes');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo tuyến lỗi');
      console.error('Error creating route:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/routes'));

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Tuyến Mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
          <TextField
            label="Mã Tuyến"
            name="MaTuyen"
            value={formData.MaTuyen}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Tên Tuyến"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Tài Xế ID"
            name="DriverId"
            value={formData.DriverId}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Xe ID"
            name="VehicleId"
            value={formData.VehicleId}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Trạng Thái"
            name="Status"
            value={formData.Status}
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

export default CreateRouteModal;
