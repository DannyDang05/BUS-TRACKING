import React, { useState } from 'react';
import { toast } from 'react-toastify';
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

  const isValid = () => {
    return formData.MaTuyen && formData.Name && formData.DriverId && formData.VehicleId;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
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
      toast.success('Tạo tuyến thành công!');
      navigate('/routes');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo tuyến lỗi');
      toast.error(err.response?.data?.message || 'Tạo tuyến lỗi');
      console.error('Error creating route:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/routes'));

  return (
    <Dialog 
      open={isOpen} 
      onClose={closeHandler} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 151, 167, 0.2)'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
      }}>❄️ Tạo Tuyến Mới</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: '#d32f2f' }}>{error}</Box>}
          <TextField
            label="Mã Tuyến"
            name="MaTuyen"
            value={formData.MaTuyen}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' }
              },
              '& .MuiInputBase-input': { color: '#00838f' }
            }}
          />
          <TextField
            label="Tên Tuyến"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' }
              },
              '& .MuiInputBase-input': { color: '#00838f' }
            }}
          />
          <TextField
            label="Tài Xế ID"
            name="DriverId"
            value={formData.DriverId}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' }
              },
              '& .MuiInputBase-input': { color: '#00838f' }
            }}
          />
          <TextField
            label="Xe ID"
            name="VehicleId"
            value={formData.VehicleId}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' }
              },
              '& .MuiInputBase-input': { color: '#00838f' }
            }}
          />
          <TextField
            label="Trạng Thái"
            name="Status"
            value={formData.Status}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' }
              },
              '& .MuiInputBase-input': { color: '#00838f' }
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{
        background: 'rgba(0, 151, 167, 0.05)',
        borderTop: '1px solid rgba(0, 151, 167, 0.2)',
        padding: 2
      }}>
        <Button 
          onClick={closeHandler} 
          disabled={loading}
          sx={{
            color: '#00838f',
            '&:hover': {
              background: 'rgba(0, 151, 167, 0.1)'
            }
          }}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)'
            }
          }}
        >
          {loading ? 'Đang tạo...' : 'Tạo'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateRouteModal;
