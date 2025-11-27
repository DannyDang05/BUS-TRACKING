import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  TextField,
  Chip
} from '@mui/material';
import { FaBus, FaUser, FaCar, FaCalendar, FaClock } from 'react-icons/fa';
import { getAllDrivers, getAllVehicles, updateRoute } from '../../../service/apiService';
import { toast } from 'react-toastify';

const AssignRouteDriverModal = ({ open, onClose, route, date, onSuccess }) => {
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedDriverId, setSelectedDriverId] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [morningStartTime, setMorningStartTime] = useState('07:00');
  const [afternoonStartTime, setAfternoonStartTime] = useState('16:00');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && route) {
      loadData();
      // Set giá trị hiện tại nếu route đã có driver/vehicle
      setSelectedDriverId(route.DriverId || '');
      setSelectedVehicleId(route.VehicleId || '');
    }
  }, [open, route]);

  const loadData = async () => {
    try {
      const [driversRes, vehiclesRes] = await Promise.all([
        getAllDrivers('', 1, 100),
        getAllVehicles('', 1, 100)
      ]);
      setDrivers(driversRes?.data || []);
      setVehicles(vehiclesRes?.data || []);
    } catch (error) {
      console.error('Lỗi load data:', error);
      toast.error('Không thể tải danh sách tài xế và xe!');
    }
  };

  const handleSubmit = async () => {
    if (!selectedDriverId || !selectedVehicleId) {
      toast.warning('Vui lòng chọn tài xế và xe!');
      return;
    }

    setLoading(true);
    try {
      // 1. Cập nhật route với driver và vehicle
      await updateRoute(route.Id, {
        MaTuyen: route.MaTuyen,
        Name: route.Name,
        DriverId: selectedDriverId,
        VehicleId: selectedVehicleId
      });

      // 2. Callback để tạo 2 schedules (sáng + chiều)
      await onSuccess(selectedDriverId, selectedVehicleId, morningStartTime, afternoonStartTime);
      
      onClose();
    } catch (error) {
      console.error('Lỗi phân công:', error);
      toast.error('Không thể phân công tài xế!');
    } finally {
      setLoading(false);
    }
  };

  if (!route || !date) return null;

  const selectedDriver = drivers.find(d => d.Id === selectedDriverId);
  const selectedVehicle = vehicles.find(v => v.Id === selectedVehicleId);

  const formatDate = (dateObj) => {
    if (!dateObj) return '';
    const d = new Date(dateObj);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)'
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
        color: '#fff',
        fontWeight: 'bold',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <FaBus size={24} />
        Phân Công Tài Xế & Tạo Lịch Trình
      </DialogTitle>

      <DialogContent sx={{ padding: '24px' }}>
        {/* Thông tin tuyến & ngày */}
        <Box sx={{
          background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '24px',
          border: '1px solid #80deea'
        }}>
          <Typography variant="h6" sx={{ color: '#00838f', fontWeight: 'bold', marginBottom: '12px' }}>
            Thông Tin Lịch Trình
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaBus color="#0097a7" />
              <Typography><strong>Mã tuyến:</strong> {route.MaTuyen}</Typography>
            </Box>
            <Typography sx={{ marginLeft: '28px', color: '#555' }}>
              {route.Name}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaCalendar color="#0097a7" />
              <Typography><strong>Ngày:</strong> {formatDate(date)}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Thời gian ca sáng */}
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <TextField
            label="⏰ Thời Gian Ca Sáng"
            type="time"
            value={morningStartTime}
            onChange={(e) => setMorningStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </FormControl>

        {/* Thời gian ca chiều */}
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <TextField
            label="⏰ Thời Gian Ca Chiều"
            type="time"
            value={afternoonStartTime}
            onChange={(e) => setAfternoonStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
          />
        </FormControl>

        {/* Chọn tài xế */}
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel>Chọn Tài Xế</InputLabel>
          <Select
            value={selectedDriverId}
            onChange={(e) => setSelectedDriverId(e.target.value)}
            label="Chọn Tài Xế"
          >
            <MenuItem value="">
              <em>-- Chọn tài xế --</em>
            </MenuItem>
            {drivers.map((driver) => (
              <MenuItem key={driver.Id} value={driver.Id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <Avatar sx={{ bgcolor: '#0097a7', width: 32, height: 32 }}>
                    <FaUser size={16} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{driver.FullName}</Typography>
                    <Typography variant="caption" sx={{ color: '#777' }}>
                      📞 {driver.PhoneNumber} | 🪪 {driver.MaBangLai}
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Chọn xe */}
        <FormControl fullWidth sx={{ marginBottom: '20px' }}>
          <InputLabel>Chọn Xe</InputLabel>
          <Select
            value={selectedVehicleId}
            onChange={(e) => setSelectedVehicleId(e.target.value)}
            label="Chọn Xe"
          >
            <MenuItem value="">
              <em>-- Chọn xe --</em>
            </MenuItem>
            {vehicles.map((vehicle) => (
              <MenuItem key={vehicle.Id} value={vehicle.Id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <Avatar sx={{ bgcolor: '#00838f', width: 32, height: 32 }}>
                    <FaCar size={16} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 'bold' }}>{vehicle.LicensePlate}</Typography>
                    <Typography variant="caption" sx={{ color: '#777' }}>
                      {vehicle.Model} | Sức chứa: {vehicle.Capacity} chỗ
                    </Typography>
                  </Box>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Preview phân công */}
        {selectedDriver && selectedVehicle && (
          <Box sx={{
            background: 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)',
            borderRadius: '12px',
            padding: '16px',
            border: '1px solid #66bb6a'
          }}>
            <Typography variant="subtitle2" sx={{ color: '#2e7d32', fontWeight: 'bold', marginBottom: '12px' }}>
              ✅ Xác Nhận Phân Công
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <Typography>
                <strong>Tài xế:</strong> {selectedDriver.FullName}
              </Typography>
              <Typography>
                <strong>Xe:</strong> {selectedVehicle.LicensePlate} ({selectedVehicle.Model})
              </Typography>
              <Typography>
                <strong>Ngày:</strong> {formatDate(date)}
              </Typography>
              <Typography>
                <strong>🌅 Ca sáng:</strong> {morningStartTime}
              </Typography>
              <Typography>
                <strong>🌆 Ca chiều:</strong> {afternoonStartTime}
              </Typography>
              <Box sx={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <Chip 
                  label="Ca Sáng" 
                  size="small"
                  sx={{ 
                    background: '#4caf50',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                />
                <Chip 
                  label="Ca Chiều" 
                  size="small"
                  sx={{ 
                    background: '#ff9800',
                    color: '#fff',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: '16px 24px' }}>
        <Button 
          onClick={onClose}
          sx={{ color: '#777' }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={loading || !selectedDriverId || !selectedVehicleId}
          sx={{
            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
            color: '#fff',
            fontWeight: 'bold',
            padding: '8px 24px',
            borderRadius: '20px',
            '&:hover': {
              background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
            },
            '&:disabled': {
              background: '#ccc'
            }
          }}
        >
          {loading ? 'Đang xử lý...' : 'Xác Nhận Phân Công'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AssignRouteDriverModal;
