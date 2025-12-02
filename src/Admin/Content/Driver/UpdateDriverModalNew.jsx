import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton, Grid, Typography, Divider, Paper } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateDriver, getDriverById } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { useLanguage } from '../../Shared/LanguageContext';
import CloseIcon from '@mui/icons-material/Close';
import DriveEtaIcon from '@mui/icons-material/DriveEta';
import EditIcon from '@mui/icons-material/Edit';

const UpdateDriverModalNew = ({ open = false, onClose, driver = null, onRefresh }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    FullName: '',
    PhoneNumber: '',
    MaBangLai: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Reset form khi đóng modal
    if (!open) {
      setFormData({
        FullName: '',
        PhoneNumber: '',
        MaBangLai: ''
      });
      setError('');
      return;
    }
    
    // Load dữ liệu khi modal mở
    if (driver) {
      console.log('Loading driver data:', driver);
      setFormData({
        FullName: driver.FullName || '',
        PhoneNumber: driver.PhoneNumber || '',
        MaBangLai: driver.MaBangLai || ''
      });
    } else if (id) {
      // Chỉ fetch từ API khi không có driver prop nhưng có id từ URL
      getDriverById(id).then(res => {
        const data = res?.data || res;
        setFormData({
          FullName: data.FullName || '',
          PhoneNumber: data.PhoneNumber || '',
          MaBangLai: data.MaBangLai || ''
        });
      }).catch(err => console.error('Error fetching driver:', err));
    }
  }, [open, driver, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValid = () => {
    return formData.FullName && formData.PhoneNumber && formData.MaBangLai;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const driverId = driver?.Id || id;
      await updateDriver(driverId, formData);
      if (onRefresh) {
        await onRefresh();
      }
      if (onClose) {
        onClose();
      } else {
        navigate('/drivers');
      }
      toast.success('Cập nhật tài xế thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật tài xế lỗi');
      toast.error(err.response?.data?.message || 'Cập nhật tài xế lỗi');
      console.error('Error updating driver:', err);
    } finally {
      setLoading(false);
    }
  };

  const closeHandler = () => {
    if (onClose) {
      onClose();
    } else {
      navigate('/drivers');
    }
  };

  const { t } = useLanguage();

  return (
    <Dialog 
      open={open} 
      onClose={closeHandler} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
        }
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
        color: 'white',
        fontWeight: 'bold',
        padding: '20px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backdropFilter: 'blur(10px)'
          }}>
            <EditIcon sx={{ fontSize: 28 }} />
          </Box>
          <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
            ❄️ Chỉnh Sửa Thông Tin Tài Xế
          </Typography>
        </Box>
        <IconButton
          onClick={closeHandler}
          disabled={loading}
          sx={{
            color: 'white',
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.1)'
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: '24px', background: '#f8f9fa' }}>
        {error && (
          <Box sx={{
            color: '#d32f2f',
            background: '#ffebee',
            padding: '12px 16px',
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid #ef9a9a'
          }}>
            {error}
          </Box>
        )}
        
        {/* Card 1: Thông Tin Cơ Bản */}
        <Paper elevation={2} sx={{
          padding: '20px',
          marginBottom: '16px',
          borderRadius: '12px',
          background: 'white',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{
            marginBottom: '16px',
            color: '#0097a7',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <DriveEtaIcon /> Thông Tin Cơ Bản
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Họ và Tên"
                name="FullName"
                value={formData.FullName}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#0097a7' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7', borderWidth: '2px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#0097a7' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Card 2: Thông Tin Liên Hệ */}
        <Paper elevation={2} sx={{
          padding: '20px',
          marginBottom: '16px',
          borderRadius: '12px',
          background: 'white',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{
            marginBottom: '16px',
            color: '#0097a7',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            📞 Thông Tin Liên Hệ
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Số Điện Thoại"
                name="PhoneNumber"
                value={formData.PhoneNumber}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#0097a7' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7', borderWidth: '2px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#0097a7' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Card 3: Bằng Lái */}
        <Paper elevation={2} sx={{
          padding: '20px',
          borderRadius: '12px',
          background: 'white',
          border: '1px solid #e0e0e0'
        }}>
          <Typography variant="h6" sx={{
            marginBottom: '16px',
            color: '#0097a7',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            🪪 Thông Tin Bằng Lái
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Mã Bằng Lái"
                name="MaBangLai"
                value={formData.MaBangLai}
                onChange={handleChange}
                fullWidth
                disabled={loading}
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#0097a7' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7', borderWidth: '2px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#0097a7' }
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{
        padding: '16px 24px',
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        gap: 1
      }}>
        <Button 
          onClick={closeHandler} 
          disabled={loading}
          variant="outlined"
          sx={{
            color: '#0097a7',
            borderColor: '#0097a7',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 24px',
            '&:hover': {
              borderColor: '#00838f',
              background: 'rgba(0, 151, 167, 0.05)'
            }
          }}
        >
          Hủy Bỏ
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading}
          sx={{
            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
            color: 'white',
            textTransform: 'none',
            fontWeight: 600,
            padding: '8px 32px',
            boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)',
            '&:hover': {
              background: 'linear-gradient(135deg, #00838f 0%, #006064 100%)',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(0, 151, 167, 0.4)'
            },
            '&:disabled': {
              background: '#bdbdbd',
              color: 'white'
            }
          }}
        >
          {loading ? '⏳ Đang Cập Nhật...' : '💾 Lưu Thay Đổi'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDriverModalNew;
