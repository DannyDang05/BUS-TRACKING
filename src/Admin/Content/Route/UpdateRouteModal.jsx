import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateRoute, getRouteById } from '../../../service/apiService';

const UpdateRouteModal = ({ open, onClose, route, onRefresh } = {}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    MaTuyen: '',
    Name: '',
    DriverId: '',
    VehicleId: '',
    Status: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (route) {
      setFormData({
        MaTuyen: route.MaTuyen || '',
        Name: route.Name || '',
        DriverId: route.DriverId || '',
        VehicleId: route.VehicleId || '',
        Status: route.Status || ''
      });
    }
  }, [route, open]);

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
      await updateRoute(route.Id, formData);
      onRefresh?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật tuyến lỗi');
      console.error('Error updating route:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập Nhật Tuyến</DialogTitle>
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
        <Button onClick={onClose} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRouteModal;
