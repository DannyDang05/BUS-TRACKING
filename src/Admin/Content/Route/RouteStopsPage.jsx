import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Divider, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, MapOutlined as MapIcon, Navigation as NavigationIcon } from '@mui/icons-material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPickupPoints, createPickupPoint, updatePickupPoint, deletePickupPoint, getAllStudents } from '../../../service/apiService';
import PaginationControls from '../PaginationControls';
import ConfirmDialog from '../../Shared/ConfirmDialog';
import { useLanguage } from '../../Shared/LanguageContext';
import AddressAutocomplete from '../../Shared/AddressAutocomplete';
import { toast } from 'react-toastify';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

const RouteStopsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [form, setForm] = useState({ PointOrder: '', PointName: '', Address: '', Latitude: '', Longitude: '', StudentId: '' });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);
  


  // map refs
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [106.7714, 10.8494], // Đại học Sài Gòn
      zoom: 13
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    loadPoints();
    loadStudents();
  }, [id]);

  const loadStudents = async () => {
    try {
      const res = await getAllStudents('', 1, 1000);
      setStudents(res?.data || []);
    } catch (err) {
      console.error('Failed to load students', err);
    }
  };

  const loadPoints = async () => {
    setLoading(true);
    try {
      const res = await getPickupPoints(id);
      const data = res?.data || res;
      setPoints(data || []);
      drawOnMap(data || []);
    } catch (err) {
      console.error('Failed to load pickup points', err);
    } finally {
      setLoading(false);
    }
  };

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (!mapRef.current) return;
    if (mapRef.current.getSource('route-line')) {
      if (mapRef.current.getLayer('route-line')) mapRef.current.removeLayer('route-line');
      mapRef.current.removeSource('route-line');
    }
  };

  // pagination for points table
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    setPage(0);
  }, [points]);

  const displayedPoints = points.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const drawOnMap = async (pts) => {
    if (!mapRef.current) return;
    clearMarkers();
    const map = mapRef.current;
    const coords = [];
    
    // Thêm marker trường học (Đại học Sài Gòn)
    const schoolEl = document.createElement('div');
    schoolEl.innerHTML = '🏫';
    schoolEl.style.fontSize = '30px';
    schoolEl.style.cursor = 'pointer';
    const schoolMarker = new mapboxgl.Marker({ element: schoolEl })
      .setLngLat([106.7714, 10.8494])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML('<div style="font-weight:bold;color:#00838f;font-size:14px;">🏫 Đại học Sài Gòn</div>'))
      .addTo(map);
    markersRef.current.push(schoolMarker);
    
    pts.forEach((p, idx) => {
      const lng = parseFloat(p.Longitude);
      const lat = parseFloat(p.Latitude);
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        // Icon nhỏ gọn 30px
        const el = document.createElement('div');
        const svgData = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%2213%22 fill=%22%232196F3%22 stroke=%22white%22 stroke-width=%222%22/%3E%3Ctext x=%2215%22 y=%2220%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22 font-size=%2214%22%3E${idx + 1}%3C/text%3E%3C/svg%3E`;
        el.style.backgroundImage = `url('${svgData}')`;
        el.style.backgroundSize = '100%';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(`<div style="font-weight:bold;color:#2196F3;font-size:13px;">${p.PointName || 'Điểm ' + (idx + 1)}</div><div style="font-size:11px;color:#666;">${p.Address || 'Chưa có địa chỉ'}</div>`))
          .addTo(map);
        markersRef.current.push(marker);
        coords.push([lng, lat]);
      }
    });
    
    if (coords.length > 0) {
      // Gọi OSRM API để lấy đường đi thực tế
      try {
        const coordsStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
        const response = await fetch(osrmUrl);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const routeGeometry = data.routes[0].geometry;
          
          if (map.getSource('route-line')) {
            map.getSource('route-line').setData({ type: 'Feature', geometry: routeGeometry });
          } else {
            map.addSource('route-line', { type: 'geojson', data: { type: 'Feature', geometry: routeGeometry } });
            map.addLayer({
              id: 'route-line',
              type: 'line',
              source: 'route-line',
              layout: { 'line-join': 'round', 'line-cap': 'round' },
              paint: { 'line-color': '#2196F3', 'line-width': 4, 'line-opacity': 0.75 }
            });
          }
        } else {
          throw new Error('OSRM failed');
        }
      } catch (error) {
        console.warn('OSRM routing failed, using straight lines:', error);
        // Fallback: vẽ đường thẳng nếu OSRM lỗi
        if (map.getSource('route-line')) {
          map.getSource('route-line').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords } });
        } else {
          map.addSource('route-line', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } });
          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route-line',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#2196F3', 'line-width': 4, 'line-opacity': 0.8 }
          });
        }
      }
      
      const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 500 });
    }
  };

  const { t } = useLanguage();

  // Chọn địa chỉ từ AddressAutocomplete component
  const handleSelectAddress = (suggestion) => {
    setForm(prev => ({
      ...prev,
      Address: suggestion.address,
      Latitude: suggestion.latitude.toString(),
      Longitude: suggestion.longitude.toString()
    }));
  };

  const handleOpenAdd = () => {
    setEditingPoint(null);
    setForm({ PointOrder: '', PointName: '', Address: '', Latitude: '', Longitude: '', StudentId: '' });
    setOpenDialog(true);
  };

  const handleEdit = (p) => {
    setEditingPoint(p);
    setForm({ 
      PointOrder: p.PointOrder, 
      PointName: p.MaHocSinh || '', 
      Address: p.DiaChi || '', 
      Latitude: p.Latitude, 
      Longitude: p.Longitude,
      StudentId: p.MaHocSinh || ''
    });
    setOpenDialog(true);
  };

  const handleDelete = async (p) => {
    setConfirmTarget(p);
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    if (!form.PointOrder || form.Latitude === '' || form.Longitude === '') {
      toast.error('Vui lòng nhập Thứ tự, Latitude và Longitude');
      return;
    }
    const payload = {
      RouteId: id,
      PointOrder: Number(form.PointOrder),
      MaHocSinh: (form.StudentId && form.StudentId.trim() !== '') ? form.StudentId : null, // Dùng StudentId đã chọn
      DiaChi: form.Address || null,
      Latitude: Number(form.Latitude),
      Longitude: Number(form.Longitude)
    };
    try {
      if (editingPoint) {
        await updatePickupPoint(editingPoint.Id, payload);
        toast.success('Cập nhật điểm đón thành công!');
      } else {
        await createPickupPoint(payload);
        toast.success('Thêm điểm đón thành công!');
      }
      setOpenDialog(false);
      await loadPoints();
    } catch (err) {
      console.error('Save failed', err);
      toast.error(err?.message || 'Lỗi khi lưu điểm đón');
    }
  }

  const handleConfirmResult = async (result) => {
    setConfirmOpen(false);
    const p = confirmTarget;
    setConfirmTarget(null);
    if (!result || !p) return;
    try {
      await deletePickupPoint(p.Id);
      await loadPoints();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '3px solid #00838f' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#00838f', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon sx={{ fontSize: 28 }} /> {t('managePickup')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>{t('route') || `Tuyến #${id}`} - {points.length} {t('points')}</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/routes')} sx={{ borderColor: '#00838f', color: '#00838f', '&:hover': { bgcolor: '#d0f1f4ff' } }}>{t('backToList')}</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ bgcolor: '#00838f', '&:hover': { bgcolor: '#43c0c9ff' } }}>{t('addNewPoint')}</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 400 }}>
          <Paper sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#00838f' }}>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 60 }}>{t('index')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>{t('pointName')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 180 }}>{t('address')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 100 }}>{t('coordinates')}</TableCell>
                      <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }} align="center">{t('action')}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>⏳ {t('loading')}</TableCell></TableRow>
                  ) : points.length === 0 ? (
                        <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: '#999' }}>📍 {t('noData')}</TableCell></TableRow>
                  ) : (
                    displayedPoints.map((p, idx) => {
                      const student = students.find(s => s.MaHocSinh === p.MaHocSinh);
                      return (
                      <TableRow key={p.Id} sx={{ '&:hover': { bgcolor: '#fff5f2' }, '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff3f0' }}>
                          <Chip label={page * rowsPerPage + idx + 1} size="small" sx={{ bgcolor: '#00838f', color: 'white', fontWeight: 'bold' }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: '500' }}>
                          {student ? (
                            <Box>
                              <Typography sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{student.HoTen}</Typography>
                              <Typography sx={{ fontSize: '0.75rem', color: '#666' }}>{p.MaHocSinh} {student.Lop ? `- ${student.Lop}` : ''}</Typography>
                            </Box>
                          ) : (
                            p.MaHocSinh || <em style={{ color: '#999' }}>Không có học sinh</em>
                          )}
                        </TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', color: '#555' }}>{p.DiaChi || t('noPickupPoints')}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#666' }}>{Number(p.Latitude).toFixed(4)}<br/>{Number(p.Longitude).toFixed(4)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleEdit(p)} color="primary" title={t('edit')}><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(p)} color="error" title={t('delete')}><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>

          <div className="align-right">
            <PaginationControls
              count={points.length}
              page={page}
              rowsPerPage={rowsPerPage}
              onPageChange={(p) => setPage(p)}
            />
          </div>
        </Box>

        <Box sx={{ width: 540, borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 24px rgba(255,87,51,0.2)', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ bgcolor: '#00838f', color: 'white', p: 1.5, fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <NavigationIcon /> {t('routeMap')} ({points.length} {t('points')})
          </Box>
          <Box sx={{ flex: 1, position: 'relative', minHeight: 550, bgcolor: '#e0e0e0' }}>
            <div ref={containerRef} className="full-size" />
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#00838f', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingPoint ? `✏️ ${t('editPickupPoint')}` : `📍 ${t('addNewPoint')}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <TextField 
              label="Thứ tự"
              type="number"
              value={form.PointOrder} 
              onChange={(e) => setForm(prev => ({ ...prev, PointOrder: e.target.value }))} 
              fullWidth
              size="small"
              placeholder="VD: 1, 2, 3..."
            />
            
            <FormControl fullWidth size="small">
              <InputLabel>Chọn học sinh (tùy chọn)</InputLabel>
              <Select
                value={form.StudentId}
                onChange={(e) => setForm(prev => ({ ...prev, StudentId: e.target.value, PointName: e.target.value }))}
                label="Chọn học sinh (tùy chọn)"
                sx={{
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#00838f' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0097a7' }
                }}
              >
                <MenuItem value="">
                  <em>-- Không chọn học sinh --</em>
                </MenuItem>
                {students.map((student) => (
                  <MenuItem key={student.MaHocSinh} value={student.MaHocSinh}>
                    {student.MaHocSinh} - {student.HoTen} {student.Lop ? `(${student.Lop})` : ''}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <AddressAutocomplete
              value={form.Address}
              onChange={(value) => setForm(prev => ({ ...prev, Address: value }))}
              onSelectAddress={handleSelectAddress}
              label="Địa chỉ"
              placeholder="VD: 123 Nguyễn Hữu Cảnh, Quận 1, TP HCM"
              helperText="💡 Nhập địa chỉ để tự động lấy tọa độ"
              multiline={true}
              rows={2}
            />
            <Divider sx={{ my: 1 }}>{t('gpsCoordinates')}</Divider>
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField 
                label="Latitude" 
                name="Latitude" 
                type="number"
                value={form.Latitude} 
                onChange={(e) => setForm(prev => ({ ...prev, Latitude: e.target.value }))} 
                fullWidth
                size="small"
                placeholder="10.7763"
              />
              <TextField 
                label="Longitude" 
                name="Longitude" 
                type="number"
                value={form.Longitude} 
                onChange={(e) => setForm(prev => ({ ...prev, Longitude: e.target.value }))} 
                fullWidth
                size="small"
                placeholder="106.6601"
              />
            </Box>
            <Typography variant="caption" sx={{ color: '#999', fontStyle: 'italic' }}>💡 Bạn có thể lấy tọa độ từ Google Maps</Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid #eee' }}>
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#666' }}>{t('cancel')}</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#00838f', '&:hover': { bgcolor: '#d9421f' } }}>
            {editingPoint ? `💾 ${t('update')}` : `✅ ${t('create')}`}
          </Button>
        </DialogActions>
      </Dialog>
      <ConfirmDialog open={confirmOpen} title={t('confirmTitle')} message={t('confirmDeleteMessage')} onClose={handleConfirmResult} />
    </Box>
  );
};

export default RouteStopsPage;
