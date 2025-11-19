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
    // if parent passed route prop, use it
    if (route) {
      setFormData({
        MaTuyen: route.MaTuyen || '',
        Name: route.Name || '',
        DriverId: route.DriverId || '',
        VehicleId: route.VehicleId || '',
        Status: route.Status || ''
      });
      return;
    }

    // if mounted as route element with :id, fetch by id
    const load = async () => {
      if (id) {
        try {
          const res = await getRouteById(id);
          const rt = res?.data || res; // apiService returns response.data by default
          setFormData({
            MaTuyen: rt.MaTuyen || '',
            Name: rt.Name || '',
            DriverId: rt.DriverId || '',
            VehicleId: rt.VehicleId || '',
            Status: rt.Status || ''
          });
        } catch (err) {
          console.error('Failed to load route:', err);
        }
      }
    };
    load();
  }, [route, open, id]);

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
      const routeId = route?.Id || id;
      await updateRoute(routeId, formData);
      onRefresh?.();
      onClose?.();
      if (!onClose) navigate('/routes');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật tuyến lỗi');
      console.error('Error updating route:', err);
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
      }}>❄️ Cập Nhật Tuyến</DialogTitle>
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
          {loading ? 'Đang cập nhật...' : 'Cập Nhật'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateRouteModal;
