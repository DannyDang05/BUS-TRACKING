import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createVehicle } from '../../../service/apiService';

const CreateBusModal = ({ open, onClose, onRefresh } = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LicensePlate: '',
    Model: '',
    SpeedKmh: ''
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
      await createVehicle(formData);
      setFormData({
        LicensePlate: '',
        Model: '',
        SpeedKmh: ''
      });
      onRefresh?.();
      onClose?.();
      navigate('/buses');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo xe lỗi');
      console.error('Error creating vehicle:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/buses'));

  return (
    <Dialog open={isOpen} onClose={closeHandler} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo Xe Mới</DialogTitle>
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
        <Button onClick={closeHandler} disabled={loading}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={loading}>
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateBusModal;