import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { updateVehicle } from '../../../service/apiService';

const UpdateBusModal = ({ open, onClose, vehicle, onRefresh }) => {
  const [formData, setFormData] = useState({
    LicensePlate: '',
    Model: '',
    SpeedKmh: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (vehicle) {
      setFormData({
        LicensePlate: vehicle.LicensePlate || '',
        Model: vehicle.Model || '',
        SpeedKmh: vehicle.SpeedKmh || ''
      });
    }
  }, [vehicle, open]);

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
      await updateVehicle(vehicle.Id, formData);
      onRefresh?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật xe lỗi');
      console.error('Error updating vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Cập Nhật Xe</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: 'error.main' }}>{error}</Box>}
          <TextField
            label="Biển Số"
            name="LicensePlate"
            value={formData.LicensePlate}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Model"
            name="Model"
            value={formData.Model}
            onChange={handleChange}
            fullWidth
            disabled={loading}
          />
          <TextField
            label="Tốc Độ (km/h)"
            name="SpeedKmh"
            type="number"
            value={formData.SpeedKmh}
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

export default UpdateBusModal;