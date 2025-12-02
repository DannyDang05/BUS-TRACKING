import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Box, IconButton, Grid, Typography, Divider, Paper, InputAdornment, List, ListItem, ListItemText } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { updateStudent, getStudentById } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { useLanguage } from '../../Shared/LanguageContext';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import EditIcon from '@mui/icons-material/Edit';
import LocationIcon from '@mui/icons-material/LocationOn';
import ClearIcon from '@mui/icons-material/Clear';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

const UpdateStudentModal = ({ open, onClose, student, onRefresh } = {}) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    MaHocSinh: '',
    HoTen: '',
    Lop: '',
    TinhTrang: '',
    MaPhuHuynh: '',
    MaDiemDon: '',
    Latitude: '',
    Longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceTimer = useRef(null);

  // Debug log
  console.log('UpdateStudentModal render - open:', open, 'student:', student, 'formData:', formData);

  useEffect(() => {
    // Reset form khi đóng modal
    if (!open) {
      setFormData({
        MaHocSinh: '',
        HoTen: '',
        Lop: '',
        TinhTrang: '',
        MaPhuHuynh: '',
        MaDiemDon: '',
        Latitude: '',
        Longitude: ''
      });
      setError('');
      return;
    }
    
    // Load dữ liệu khi modal mở
    if (student) {
      console.log('Loading student data:', student);
      setFormData({
        MaHocSinh: student.MaHocSinh || '',
        HoTen: student.HoTen || '',
        Lop: student.Lop || '',
        TinhTrang: student.TrangThaiHocTap || student.TinhTrang || '',
        MaPhuHuynh: student.MaPhuHuynh || '',
        MaDiemDon: student.DiaChi || student.MaDiemDon || '',
        Latitude: student.Latitude || '',
        Longitude: student.Longitude || ''
      });
    } else if (id) {
      // Chỉ fetch từ API khi không có student prop nhưng có id từ URL
      getStudentById(id).then(res => {
        const data = res?.data || res;
        setFormData({
          MaHocSinh: data.MaHocSinh || '',
          HoTen: data.HoTen || '',
          Lop: data.Lop || '',
          TinhTrang: data.TrangThaiHocTap || data.TinhTrang || '',
          MaPhuHuynh: data.MaPhuHuynh || '',
          MaDiemDon: data.DiaChi || data.MaDiemDon || ''
        });
      }).catch(err => console.error('Error fetching student:', err));
    }
  }, [open, student, id]);

  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setAddressSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=VN&language=vi&limit=5`
      );
      const data = await response.json();

      if (data.features) {
        setAddressSuggestions(data.features);
        setShowSuggestions(true);
      }
    } catch (error) {
      console.error('Error searching address:', error);
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, MaDiemDon: value }));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      searchAddress(value);
    }, 500);
  };

  const handleSelectAddress = (feature) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    setFormData(prev => ({
      ...prev,
      MaDiemDon: feature.place_name,
      Latitude: latitude.toString(),
      Longitude: longitude.toString()
    }));
    setShowSuggestions(false);
    setAddressSuggestions([]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const isValid = () => {
    return formData.MaHocSinh && formData.HoTen && formData.Lop && formData.MaDiemDon;
  };

  const handleSubmit = async () => {
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const studentId = student?.MaHocSinh || id;
      await updateStudent(studentId, formData);
      if (onRefresh) {
        await onRefresh();
      }
      if (onClose) {
        onClose();
      } else {
        navigate('/students');
      }
      toast.success('Cập nhật học sinh thành công!');
    } catch (err) {
      setError(err.response?.data?.message || 'Cập nhật học sinh lỗi');
      toast.error(err.response?.data?.message || 'Cập nhật học sinh lỗi');
      console.error('Error updating student:', err);
    } finally {
      setLoading(false);
    }
  };

  const isOpen = open !== undefined ? open : true;
  const closeHandler = onClose || (() => navigate('/students'));

  const { t } = useLanguage();

  return (
    <Dialog 
      open={isOpen} 
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
            ❄️ Chỉnh Sửa Thông Tin Học Sinh
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
            <SchoolIcon /> Thông Tin Cơ Bản
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mã Học Sinh"
                name="MaHocSinh"
                value={formData.MaHocSinh}
                onChange={handleChange}
                fullWidth
                disabled={true}
                required
                helperText="Không thể chỉnh sửa trường này"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#e0e0e0' },
                    '&.Mui-focused fieldset': { borderColor: '#e0e0e0', borderWidth: '1px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#757575' },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#757575',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Họ Tên"
                name="HoTen"
                value={formData.HoTen}
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

        {/* Card 2: Thông Tin Học Tập */}
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
            📚 Thông Tin Học Tập
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Lớp"
                name="Lop"
                value={formData.Lop}
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
            <Grid item xs={12} sm={6}>
              <TextField
                label="Tình Trạng Học Tập"
                name="TinhTrang"
                value={formData.TinhTrang}
                onChange={handleChange}
                fullWidth
                disabled={true}
                helperText="Không thể chỉnh sửa trường này"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#e0e0e0' },
                    '&.Mui-focused fieldset': { borderColor: '#e0e0e0', borderWidth: '1px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#757575' },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#757575',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              />
            </Grid>
          </Grid>
        </Paper>

        {/* Card 3: Thông Tin Liên Hệ & Địa Chỉ */}
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
            👨‍👩‍👧 Thông Tin Liên Hệ & Địa Chỉ
          </Typography>
          <Divider sx={{ marginBottom: '16px' }} />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Mã Phụ Huynh"
                name="MaPhuHuynh"
                value={formData.MaPhuHuynh}
                onChange={handleChange}
                fullWidth
                disabled={true}
                helperText="Không thể chỉnh sửa trường này"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#e0e0e0' },
                    '&:hover fieldset': { borderColor: '#e0e0e0' },
                    '&.Mui-focused fieldset': { borderColor: '#e0e0e0', borderWidth: '1px' }
                  },
                  '& .MuiInputLabel-root.Mui-focused': { color: '#757575' },
                  '& .MuiInputBase-input.Mui-disabled': {
                    WebkitTextFillColor: '#757575',
                    backgroundColor: '#f5f5f5'
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ position: 'relative' }}>
                <TextField
                  label="Địa Chỉ"
                  name="MaDiemDon"
                  value={formData.MaDiemDon}
                  onChange={handleAddressChange}
                  fullWidth
                  disabled={loading}
                  required
                  helperText="Trường bắt buộc - Nhập và chọn từ gợi ý"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationIcon sx={{ color: '#0097a7' }} />
                      </InputAdornment>
                    ),
                    endAdornment: formData.MaDiemDon && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => {
                            setFormData({ ...formData, MaDiemDon: '', Latitude: '', Longitude: '' });
                            setAddressSuggestions([]);
                          }}
                        >
                          <ClearIcon />
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': { borderColor: '#e0e0e0' },
                      '&:hover fieldset': { borderColor: '#0097a7' },
                      '&.Mui-focused fieldset': { borderColor: '#0097a7', borderWidth: '2px' }
                    },
                    '& .MuiInputLabel-root.Mui-focused': { color: '#0097a7' }
                  }}
                />

                {showSuggestions && addressSuggestions.length > 0 && (
                  <Paper
                    elevation={3}
                    sx={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      right: 0,
                      zIndex: 1000,
                      maxHeight: 300,
                      overflow: 'auto',
                      mt: 1
                    }}
                  >
                    <List>
                      {addressSuggestions.map((feature, index) => (
                        <ListItem
                          key={index}
                          button
                          onClick={() => handleSelectAddress(feature)}
                          sx={{ '&:hover': { backgroundColor: 'action.hover' } }}
                        >
                          <LocationIcon sx={{ mr: 2, color: '#0097a7' }} />
                          <ListItemText
                            primary={feature.text}
                            secondary={feature.place_name}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
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

export default UpdateStudentModal;
