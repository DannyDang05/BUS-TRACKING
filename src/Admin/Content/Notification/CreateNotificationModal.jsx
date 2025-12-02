import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box,
  FormControl, InputLabel, Select, MenuItem, Checkbox, ListItemText, OutlinedInput, Chip
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createNotification } from '../../../service/apiService';
import { useLanguage } from '../../Shared/LanguageContext';

const CreateNotificationModal = ({ open, onClose, onRefresh } = {}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    MaThongBao: '',
    NoiDung: '',
    ThoiGian: '',
    LoaiThongBao: '',
    recipientType: '',
    recipients: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [parents, setParents] = useState([]);

  // Tự động tạo mã thông báo khi mở modal
  useEffect(() => {
    if (open) {
      const autoMaThongBao = `TB${Date.now()}`;
      setFormData(prev => ({
        ...prev,
        MaThongBao: autoMaThongBao
      }));
      loadRecipients();
    }
  }, [open]);

  const loadRecipients = async () => {
    try {
      const [driversRes, parentsRes] = await Promise.all([
        fetch('http://localhost:6969/api/v1/notifications/recipients/drivers', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        }),
        fetch('http://localhost:6969/api/v1/notifications/recipients/parents', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        })
      ]);

      const driversData = await driversRes.json();
      const parentsData = await parentsRes.json();

      if (driversData.errorCode === 0) setDrivers(driversData.data);
      if (parentsData.errorCode === 0) setParents(parentsData.data);
    } catch (err) {
      console.error('Error loading recipients:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset recipients khi đổi recipientType
      ...(name === 'recipientType' && { recipients: [] })
    }));
  };

  const handleRecipientsChange = (event) => {
    const { value } = event.target;
    setFormData(prev => ({
      ...prev,
      recipients: typeof value === 'string' ? value.split(',') : value
    }));
  };

  const isValid = () => {
    if (!formData.NoiDung || !formData.ThoiGian || !formData.LoaiThongBao || !formData.recipientType) {
      return false;
    }
    // Nếu không phải "all" thì phải chọn ít nhất 1 người nhận
    if (formData.recipientType !== 'all' && formData.recipients.length === 0) {
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await createNotification(formData);
      // Tạo mã mới cho lần tạo tiếp theo
      const newMaThongBao = `TB${Date.now()}`;
      setFormData({
        MaThongBao: newMaThongBao,
        NoiDung: '',
        ThoiGian: '',
        LoaiThongBao: '',
        recipientType: '',
        recipients: []
      });
      onRefresh?.();
      onClose?.();
      toast.success('Tạo thông báo thành công!');
      navigate('/notifications');
    } catch (err) {
      setError(err.response?.data?.message || 'Tạo thông báo lỗi');
      toast.error(err.response?.data?.message || 'Tạo thông báo lỗi');
      console.error('Error creating notification:', err);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useLanguage();
  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/notifications'));

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
      }}>❄️ {t('create')} {t('notification')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: '#d32f2f' }}>{error}</Box>}
          <TextField
            label="Mã Thông Báo (Tự động)"
            name="MaThongBao"
            value={formData.MaThongBao}
            onChange={handleChange}
            fullWidth
            disabled={true}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#0097a7' },
                '&:hover fieldset': { borderColor: '#00838f' },
                '&.Mui-focused fieldset': { borderColor: '#0097a7' },
                backgroundColor: 'rgba(0, 151, 167, 0.05)'
              },
              '& .MuiInputBase-input': { color: '#00838f', fontWeight: '600' }
            }}
          />
          <TextField
            label="Nội Dung"
            name="NoiDung"
            value={formData.NoiDung}
            onChange={handleChange}
            fullWidth
            multiline
            rows={3}
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
            label="Thời Gian"
            name="ThoiGian"
            type="datetime-local"
            value={formData.ThoiGian}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
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
            label="Loại Thông Báo"
            name="LoaiThongBao"
            value={formData.LoaiThongBao}
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

          <FormControl fullWidth disabled={loading}>
            <InputLabel>Gửi đến *</InputLabel>
            <Select
              name="recipientType"
              value={formData.recipientType}
              onChange={handleChange}
              label="Gửi đến *"
              sx={{
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00838f' },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' }
              }}
            >
              <MenuItem value="driver">Tài xế</MenuItem>
              <MenuItem value="parent">Phụ huynh</MenuItem>
              <MenuItem value="all">Tất cả</MenuItem>
            </Select>
          </FormControl>

          {formData.recipientType && formData.recipientType !== 'all' && (
            <FormControl fullWidth disabled={loading}>
              <InputLabel>
                {formData.recipientType === 'driver' ? 'Chọn Tài xế *' : 'Chọn Phụ huynh *'}
              </InputLabel>
              <Select
                multiple
                value={formData.recipients}
                onChange={handleRecipientsChange}
                input={<OutlinedInput label={formData.recipientType === 'driver' ? 'Chọn Tài xế *' : 'Chọn Phụ huynh *'} />}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const item = formData.recipientType === 'driver' 
                        ? drivers.find(d => d.Id === value)
                        : parents.find(p => p.MaPhuHuynh === value);
                      return (
                        <Chip 
                          key={value} 
                          label={item ? (formData.recipientType === 'driver' ? item.FullName : item.HoTen) : value}
                          size="small"
                          sx={{ 
                            background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                            color: 'white'
                          }}
                        />
                      );
                    })}
                  </Box>
                )}
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00838f' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' }
                }}
              >
                {formData.recipientType === 'driver' ? (
                  drivers.map((driver) => (
                    <MenuItem key={driver.Id} value={driver.Id}>
                      <Checkbox checked={formData.recipients.indexOf(driver.Id) > -1} />
                      <ListItemText primary={`${driver.FullName} (${driver.Id})`} />
                    </MenuItem>
                  ))
                ) : (
                  parents.map((parent) => (
                    <MenuItem key={parent.MaPhuHuynh} value={parent.MaPhuHuynh}>
                      <Checkbox checked={formData.recipients.indexOf(parent.MaPhuHuynh) > -1} />
                      <ListItemText primary={`${parent.HoTen} (${parent.MaPhuHuynh})`} />
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          )}

          {formData.recipientType === 'all' && (
            <Box sx={{ 
              padding: 2, 
              background: 'rgba(0, 151, 167, 0.1)', 
              borderRadius: 1,
              border: '1px solid rgba(0, 151, 167, 0.3)'
            }}>
              ℹ️ Thông báo sẽ được gửi đến <strong>tất cả tài xế ({drivers.length}) và phụ huynh ({parents.length})</strong>
            </Box>
          )}
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
          {t('cancel')}
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
          {loading ? t('creating') : t('create')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNotificationModal;
