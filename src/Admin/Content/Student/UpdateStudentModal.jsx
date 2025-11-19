import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, getStudentById } from '../../../service/apiService';

const UpdateStudentModal = ({ open, onClose, student, onRefresh } = {}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    MaHocSinh: '',
    HoTen: '',
    Lop: '',
    TinhTrang: '',
    MaPhuHuynh: '',
    MaDiemDon: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (student) {
      setFormData({
        MaHocSinh: student.MaHocSinh || '',
        HoTen: student.HoTen || '',
        Lop: student.Lop || '',
        TinhTrang: student.TinhTrang || '',
        MaPhuHuynh: student.MaPhuHuynh || '',
        MaDiemDon: student.MaDiemDon || ''
      });
    } else if (id) {
      // Fetch student data from API using id from URL params
      getStudentById(id).then(res => {
        const data = res?.data || res;
        setFormData({
          MaHocSinh: data.MaHocSinh || '',
          HoTen: data.HoTen || '',
          Lop: data.Lop || '',
          TinhTrang: data.TinhTrang || '',
          MaPhuHuynh: data.MaPhuHuynh || '',
          MaDiemDon: data.MaDiemDon || ''
        });
      }).catch(err => console.error('Error fetching student:', err));
    }
  }, [student, id, open]);

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
      const studentId = student?.MaHocSinh || id;
      await updateStudent(studentId, formData);
      onRefresh?.();
      onClose?.();
      navigate('/students');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật học sinh lỗi');
      console.error('Error updating student:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/students'));

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
      }}>❄️ Cập Nhật Học Sinh</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
          {error && <Box sx={{ color: '#d32f2f' }}>{error}</Box>}
          <TextField
            label="Mã Học Sinh"
            name="MaHocSinh"
            value={formData.MaHocSinh}
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
            label="Họ Tên"
            name="HoTen"
            value={formData.HoTen}
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
            label="Lớp"
            name="Lop"
            value={formData.Lop}
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
            label="Tình Trạng"
            name="TinhTrang"
            value={formData.TinhTrang}
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
            label="Mã Phụ Huynh"
            name="MaPhuHuynh"
            value={formData.MaPhuHuynh}
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
            label="Mã Điểm Đón"
            name="MaDiemDon"
            value={formData.MaDiemDon}
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

export default UpdateStudentModal;
