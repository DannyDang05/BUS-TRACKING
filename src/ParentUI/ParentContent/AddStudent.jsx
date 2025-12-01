import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Grid,
    Alert,
    CircularProgress,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    IconButton
} from '@mui/material';
import {
    Save as SaveIcon,
    Cancel as CancelIcon,
    LocationOn as LocationIcon,
    Clear as ClearIcon
} from '@mui/icons-material';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Parent.scss';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

const AddStudent = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [addressSuggestions, setAddressSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const debounceTimer = useRef(null);

    const parentId = JSON.parse(localStorage.getItem('bus_user'))?.profileId || null;

    const [formData, setFormData] = useState({
        hoTen: '',
        lop: '',
        diaChi: '',
        kinhDo: '',
        viDo: ''
    });

    const [errors, setErrors] = useState({});

    // Geocoding với Mapbox
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
        setFormData({ ...formData, diaChi: value });

        // Clear previous timer
        if (debounceTimer.current) {
            clearTimeout(debounceTimer.current);
        }

        // Debounce search
        debounceTimer.current = setTimeout(() => {
            searchAddress(value);
        }, 500);
    };

    const handleSelectAddress = (feature) => {
        const [longitude, latitude] = feature.geometry.coordinates;
        setFormData({
            ...formData,
            diaChi: feature.place_name,
            kinhDo: longitude.toString(),
            viDo: latitude.toString()
        });
        setShowSuggestions(false);
        setAddressSuggestions([]);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.hoTen) newErrors.hoTen = 'Họ tên là bắt buộc';
        if (!formData.lop) newErrors.lop = 'Lớp là bắt buộc';
        if (!formData.diaChi) newErrors.diaChi = 'Địa chỉ là bắt buộc';
        if (!formData.kinhDo || !formData.viDo) {
            newErrors.coordinates = 'Vui lòng chọn địa chỉ từ gợi ý để lấy tọa độ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (!parentId) {
            toast.error('Không tìm thấy thông tin phụ huynh');
            return;
        }

        setLoading(true);
        try {
            const user = JSON.parse(localStorage.getItem('bus_user'));
            const token = user?.token || localStorage.getItem('bus_token');

            const response = await fetch('http://localhost:6969/api/v1/parent/add-student', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    hoTen: formData.hoTen,
                    lop: formData.lop,
                    diaChi: formData.diaChi,
                    kinhDo: parseFloat(formData.kinhDo),
                    viDo: parseFloat(formData.viDo),
                    maPhuHuynh: parentId
                })
            });

            const data = await response.json();

            if (data.errorCode === 0) {
                toast.success('Thêm học sinh thành công!');
                navigate('/parent');
            } else {
                toast.error(data.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error adding student:', error);
            toast.error('Lỗi khi thêm học sinh');
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/parent');
    };

    return (
        <Box sx={{ p: 4 }}>
            <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#1976d2' }}>
                    Thêm Học Sinh Mới
                </Typography>

                {errors.coordinates && (
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        {errors.coordinates}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Họ và tên"
                                name="hoTen"
                                value={formData.hoTen}
                                onChange={handleChange}
                                error={!!errors.hoTen}
                                helperText={errors.hoTen}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                required
                                label="Lớp"
                                name="lop"
                                value={formData.lop}
                                onChange={handleChange}
                                error={!!errors.lop}
                                helperText={errors.lop}
                                placeholder="VD: 10A1"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ position: 'relative' }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Địa chỉ"
                                    name="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleAddressChange}
                                    error={!!errors.diaChi}
                                    helperText={errors.diaChi || 'Nhập địa chỉ và chọn từ gợi ý'}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LocationIcon color="primary" />
                                            </InputAdornment>
                                        ),
                                        endAdornment: formData.diaChi && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => {
                                                        setFormData({ ...formData, diaChi: '', kinhDo: '', viDo: '' });
                                                        setAddressSuggestions([]);
                                                    }}
                                                >
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )
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
                                                    <LocationIcon sx={{ mr: 2, color: 'primary.main' }} />
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

                        {formData.kinhDo && formData.viDo && (
                            <Grid item xs={12}>
                                <Alert severity="success">
                                    <Typography variant="body2">
                                        📍 Tọa độ: {formData.viDo}, {formData.kinhDo}
                                    </Typography>
                                </Alert>
                            </Grid>
                        )}

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<CancelIcon />}
                                    onClick={handleCancel}
                                    disabled={loading}
                                >
                                    Hủy
                                </Button>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                    disabled={loading}
                                >
                                    {loading ? 'Đang lưu...' : 'Lưu học sinh'}
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
};

export default AddStudent;
