import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { getScheduleById, updateSchedule, getAllRoutes } from '../../../service/apiService';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, MenuItem } from '@mui/material';
import { useLanguage } from '../../Shared/LanguageContext';

const UpdateCalendarModal = ({ open, onClose, schedule }) => {
  const [formData, setFormData] = useState({
    route_id: '',
    date: '',
    start_time: '',
    end_time: '',
    status: 'Sắp diễn ra'
  });
  const [routes, setRoutes] = useState([]);
  const [scheduleId, setScheduleId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const res = await getAllRoutes('', 1, 1000);
        setRoutes(res?.data || []);
      } catch (err) {
        console.error('Failed to load routes', err);
      }
    };
    if (open) fetchRoutes();
  }, [open]);

  useEffect(() => {
    const { id } = useParams();
    if (schedule) {
      setScheduleId(schedule.id);
      setFormData({
        route_id: schedule.route_id || '',
        date: schedule.date || '',
        start_time: schedule.start_time || '',
        end_time: schedule.end_time || '',
        status: schedule.status || 'Sắp diễn ra'
      });
      return;
    }

    if (id && open) {
      setScheduleId(id);
      getScheduleById(id).then(res => {
        const s = res?.data || res;
        setFormData({
          route_id: s.route_id || '',
          date: s.date || '',
          start_time: s.start_time || '',
          end_time: s.end_time || '',
          status: s.status || 'Sắp diễn ra'
        });
      }).catch(err => console.error('Failed to load schedule', err));
    }
  }, [schedule, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValid = () => {
    return formData.route_id && formData.date && formData.start_time;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    if (!scheduleId) {
      toast.error('Không tìm thấy ID lịch trình!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await updateSchedule(scheduleId, formData);
      onClose();
      toast.success('Cập nhật lịch trình thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật lịch trình lỗi');
      toast.error(err.response?.data?.message || 'Cập nhật lịch trình lỗi');
      console.error('Error updating schedule:', err);
    } finally {
      setLoading(false);
    }
  };

  const { t } = useLanguage();

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
      }}>❄️ {t('update')} Lịch Trình</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: '#d32f2f' }}>{error}</Box>}
          <TextField
            select
            label="Tuyến"
            name="route_id"
            value={formData.route_id}
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
          >
            {routes.map((route) => (
              <MenuItem key={route.Id} value={route.Id}>
                {route.MaTuyen} - {route.Name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Ngày"
            name="date"
            type="date"
            value={formData.date}
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
            label="Giờ Bắt Đầu"
            name="start_time"
            type="time"
            value={formData.start_time}
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
            label="Giờ Kết Thúc"
            name="end_time"
            type="time"
            value={formData.end_time}
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
            select
            label="Trạng Thái"
            name="status"
            value={formData.status}
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
          >
            <MenuItem value="Sắp diễn ra">Sắp diễn ra</MenuItem>
            <MenuItem value="Đang chạy">Đang chạy</MenuItem>
            <MenuItem value="Hoàn thành">Hoàn thành</MenuItem>
            <MenuItem value="Hủy">Hủy</MenuItem>
          </TextField>
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
          {loading ? t('updating') : t('update')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateCalendarModal;