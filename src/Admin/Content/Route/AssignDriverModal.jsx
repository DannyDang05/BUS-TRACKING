import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Avatar,
  Chip,
  CircularProgress
} from '@mui/material';
import { DirectionsCar, Person, Phone } from '@mui/icons-material';
import { getAllDrivers, getAllVehicles, updateRoute } from '../../../service/apiService';

const AssignDriverModal = ({ open, onClose, route, onRefresh }) => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (open && route) {
      loadData();
      setSelectedDriverId(route.DriverId || '');
      setSelectedVehicleId(route.VehicleId || '');
    }
  }, [open, route]);

  const loadData = async () => {
    setFetching(true);
    try {
      // Fetch all drivers and vehicles (no pagination for dropdown)
      const [driversRes, vehiclesRes] = await Promise.all([
        getAllDrivers('', 1, 100),
        getAllVehicles('', 1, 100)
      ]);
      
      setDrivers(driversRes?.data || []);
      setVehicles(vehiclesRes?.data || []);
    } catch (err) {
      console.error('Error loading data:', err);
      toast.error('Lỗi khi tải dữ liệu!');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDriverId || !selectedVehicleId) {
      toast.error('Vui lòng chọn tài xế và xe!');
      return;
    }

    setLoading(true);
    try {
      await updateRoute(route.Id, {
        MaTuyen: route.MaTuyen,
        Name: route.Name,
        DriverId: selectedDriverId,
        VehicleId: selectedVehicleId,
        Status: route.Status || 'Chưa chạy'
      });
      
      toast.success('Phân công tài xế thành công!');
      onRefresh?.();
      onClose?.();
    } catch (err) {
      console.error('Error assigning driver:', err);
      toast.error(err.response?.data?.message || 'Phân công thất bại!');
    } finally {
      setLoading(false);
    }
  };

  const selectedDriver = drivers.find(d => d.Id === selectedDriverId);
  const selectedVehicle = vehicles.find(v => v.Id === selectedVehicleId);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0, 151, 167, 0.2)',
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
        color: 'white',
        fontWeight: 'bold',
        textShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        borderRadius: '16px 16px 0 0',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        <Person /> Phân Công Tài Xế & Xe
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {fetching ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Route Info */}
            <Box sx={{
              mb: 3,
              p: 2,
              background: 'rgba(0, 151, 167, 0.1)',
              borderRadius: '12px',
              border: '1px solid rgba(0, 151, 167, 0.2)'
            }}>
              <Typography variant="h6" sx={{ color: '#00838f', mb: 1, fontWeight: 'bold' }}>
                📍 {route?.Name}
              </Typography>
              <Chip 
                label={route?.MaTuyen} 
                size="small" 
                sx={{ 
                  background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                  color: 'white',
                  fontWeight: 'bold'
                }} 
              />
            </Box>

            {/* Driver Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="driver-select-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person fontSize="small" /> Chọn Tài Xế
                </Box>
              </InputLabel>
              <Select
                labelId="driver-select-label"
                value={selectedDriverId}
                onChange={(e) => setSelectedDriverId(e.target.value)}
                label="Chọn Tài Xế"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0097a7'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00838f'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0097a7'
                  }
                }}
              >
                <MenuItem value="">
                  <em>-- Chọn tài xế --</em>
                </MenuItem>
                {drivers.map((driver) => (
                  <MenuItem key={driver.Id} value={driver.Id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <Avatar sx={{ 
                        bgcolor: '#0097a7', 
                        width: 32, 
                        height: 32,
                        fontSize: '0.9rem'
                      }}>
                        {driver.FullName?.charAt(0)}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography sx={{ fontWeight: 'bold', color: '#00838f' }}>
                          {driver.FullName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          <Phone fontSize="inherit" /> {driver.PhoneNumber} | Bằng lái: {driver.MaBangLai}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Vehicle Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="vehicle-select-label">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <DirectionsCar fontSize="small" /> Chọn Xe
                </Box>
              </InputLabel>
              <Select
                labelId="vehicle-select-label"
                value={selectedVehicleId}
                onChange={(e) => setSelectedVehicleId(e.target.value)}
                label="Chọn Xe"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0097a7'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#00838f'
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#0097a7'
                  }
                }}
              >
                <MenuItem value="">
                  <em>-- Chọn xe --</em>
                </MenuItem>
                {vehicles.map((vehicle) => (
                  <MenuItem key={vehicle.Id} value={vehicle.Id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <DirectionsCar sx={{ color: '#0097a7' }} />
                      <Box>
                        <Typography sx={{ fontWeight: 'bold', color: '#00838f' }}>
                          {vehicle.LicensePlate}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>
                          {vehicle.Model}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Preview Selected */}
            {(selectedDriver || selectedVehicle) && (
              <Box sx={{
                mt: 3,
                p: 2,
                background: 'rgba(76, 175, 80, 0.1)',
                borderRadius: '12px',
                border: '1px solid rgba(76, 175, 80, 0.3)'
              }}>
                <Typography variant="subtitle2" sx={{ color: '#2e7d32', mb: 1, fontWeight: 'bold' }}>
                  ✅ Phân công:
                </Typography>
                {selectedDriver && (
                  <Typography variant="body2" sx={{ color: '#00838f' }}>
                    👨‍✈️ Tài xế: <strong>{selectedDriver.FullName}</strong> - {selectedDriver.PhoneNumber}
                  </Typography>
                )}
                {selectedVehicle && (
                  <Typography variant="body2" sx={{ color: '#00838f' }}>
                    🚌 Xe: <strong>{selectedVehicle.LicensePlate}</strong> - {selectedVehicle.Model}
                  </Typography>
                )}
              </Box>
            )}
          </>
        )}
      </DialogContent>

      <DialogActions sx={{
        background: 'rgba(0, 151, 167, 0.05)',
        borderTop: '1px solid rgba(0, 151, 167, 0.2)',
        padding: 2,
        borderRadius: '0 0 16px 16px'
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
          disabled={loading || !selectedDriverId || !selectedVehicleId}
          sx={{
            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
            color: 'white',
            px: 3,
            '&:hover': {
              background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)'
            },
            '&:disabled': {
              background: '#ccc',
              color: '#999'
            }
          }}
        >
          {loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : 'Xác Nhận'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignDriverModal;
