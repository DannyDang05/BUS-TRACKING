import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { updateVehicle, getVehicleById } from '../../../service/apiService';
import { useParams } from 'react-router-dom';

const UpdateBusModal = ({ open, onClose, vehicle, onRefresh }) => {
  const [formData, setFormData] = useState({
    LicensePlate: '',
    Model: '',
    SpeedKmh: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { id } = useParams();

  useEffect(() => {
    if (vehicle) {
      setFormData({
        LicensePlate: vehicle.LicensePlate || '',
        Model: vehicle.Model || '',
        SpeedKmh: vehicle.SpeedKmh || ''
      });
      return;
    }

    const load = async () => {
      if (id) {
        try {
          const res = await getVehicleById(id);
          const v = res?.data || res;
          setFormData({
            LicensePlate: v.LicensePlate || '',
            Model: v.Model || '',
            SpeedKmh: v.SpeedKmh || ''
          });
        } catch (err) {
          console.error('Failed to load vehicle', err);
        }
      }
    };
    load();
  }, [vehicle, open, id]);

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
    <Dialog 
      open={open} 
      onClose={onClose} 
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
      }}>❄️ Cập Nhật Xe</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: '#d32f2f' }}>{error}</Box>}
          <TextField
            label="Biển Số"
            name="LicensePlate"
            value={formData.LicensePlate}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0097a7'
                },
                '&:hover fieldset': {
                  borderColor: '#00838f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0097a7'
                }
              },
              '& .MuiInputBase-input': {
                color: '#00838f'
              }
            }}
          />
          <TextField
            label="Model"
            name="Model"
            value={formData.Model}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0097a7'
                },
                '&:hover fieldset': {
                  borderColor: '#00838f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0097a7'
                }
              },
              '& .MuiInputBase-input': {
                color: '#00838f'
              }
            }}
          />
          <TextField
            label="Tốc Độ (km/h)"
            name="SpeedKmh"
            type="number"
            value={formData.SpeedKmh}
            onChange={handleChange}
            fullWidth
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#0097a7'
                },
                '&:hover fieldset': {
                  borderColor: '#00838f'
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#0097a7'
                }
              },
              '& .MuiInputBase-input': {
                color: '#00838f'
              }
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
          onClick={onClose} 
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

export default UpdateBusModal;