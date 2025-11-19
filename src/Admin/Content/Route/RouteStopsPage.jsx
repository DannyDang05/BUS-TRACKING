import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton, Chip, Divider } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Add as AddIcon, MapOutlined as MapIcon, Navigation as NavigationIcon } from '@mui/icons-material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPickupPoints, createPickupPoint, updatePickupPoint, deletePickupPoint } from '../../../service/apiService';
import PaginationControls from '../PaginationControls';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

const RouteStopsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);

  // dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPoint, setEditingPoint] = useState(null);
  const [form, setForm] = useState({ PointOrder: '', PointName: '', Address: '', Latitude: '', Longitude: '' });

  // map refs
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    mapboxgl.accessToken = MAPBOX_TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: containerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [106.660172, 10.762622],
      zoom: 12
    });

    return () => {
      if (mapRef.current) mapRef.current.remove();
    };
  }, []);

  useEffect(() => {
    loadPoints();
  }, [id]);

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

  const drawOnMap = (pts) => {
    if (!mapRef.current) return;
    clearMarkers();
    const map = mapRef.current;
    const coords = [];
    
    pts.forEach((p, idx) => {
      const lng = parseFloat(p.Longitude);
      const lat = parseFloat(p.Latitude);
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        // Create custom marker with number
        const el = document.createElement('div');
        const svgData = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 40 40%22%3E%3Ccircle cx=%2220%22 cy=%2220%22 r=%2218%22 fill=%22%23FF5733%22 stroke=%22white%22 stroke-width=%222%22/%3E%3Ctext x=%2220%22 y=%2226%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22 font-size=%2218%22%3E${idx + 1}%3C/text%3E%3C/svg%3E`;
        el.style.backgroundImage = `url('${svgData}')`;
        el.style.backgroundSize = '100%';
        el.style.width = '40px';
        el.style.height = '40px';
        el.style.cursor = 'pointer';
        
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<div style="font-weight:bold;color:#FF5733;font-size:14px;">${p.PointName || 'Điểm ' + (idx + 1)}</div><div style="font-size:12px;color:#666;">${p.Address || 'Chưa có địa chỉ'}</div>`))
          .addTo(map);
        markersRef.current.push(marker);
        coords.push([lng, lat]);
      }
    });
    
    if (coords.length > 0) {
      if (map.getSource('route-line')) {
        map.getSource('route-line').setData({ type: 'Feature', geometry: { type: 'LineString', coordinates: coords } });
      } else {
        map.addSource('route-line', { type: 'geojson', data: { type: 'Feature', geometry: { type: 'LineString', coordinates: coords } } });
        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#FF5733', 'line-width': 4, 'line-opacity': 0.8 }
        });
      }
      
      const bounds = coords.reduce((b, c) => b.extend(c), new mapboxgl.LngLatBounds(coords[0], coords[0]));
      map.fitBounds(bounds, { padding: 80, maxZoom: 15, duration: 500 });
    }
  };

  const handleOpenAdd = () => {
    setEditingPoint(null);
    setForm({ PointOrder: '', PointName: '', Address: '', Latitude: '', Longitude: '' });
    setOpenDialog(true);
  };

  const handleEdit = (p) => {
    setEditingPoint(p);
    setForm({ PointOrder: p.PointOrder, PointName: p.PointName || '', Address: p.Address || '', Latitude: p.Latitude, Longitude: p.Longitude });
    setOpenDialog(true);
  };

  const handleDelete = async (p) => {
    if (!confirm('Bạn có chắc muốn xóa điểm đón này?')) return;
    try {
      await deletePickupPoint(p.Id);
      await loadPoints();
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  const handleSubmit = async () => {
    if (!form.PointOrder || form.Latitude === '' || form.Longitude === '') {
      alert('Vui lòng nhập Thứ tự, Latitude và Longitude');
      return;
    }
    const payload = {
      RouteId: id,
      PointOrder: Number(form.PointOrder),
      PointName: form.PointName,
      Address: form.Address,
      Latitude: Number(form.Latitude),
      Longitude: Number(form.Longitude)
    };
    try {
      if (editingPoint) {
        await updatePickupPoint(editingPoint.Id, payload);
      } else {
        await createPickupPoint(payload);
      }
      setOpenDialog(false);
      await loadPoints();
    } catch (err) {
      console.error('Save failed', err);
      alert('Lỗi khi lưu điểm đón');
    }
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fafafa', minHeight: '100vh' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, pb: 2, borderBottom: '3px solid #FF5733' }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#FF5733', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MapIcon sx={{ fontSize: 28 }} /> Quản Lý Điểm Đón Xe
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', mt: 0.5 }}>Tuyến #{id} - Có {points.length} điểm đón</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="outlined" onClick={() => navigate('/routes')} sx={{ borderColor: '#FF5733', color: '#FF5733', '&:hover': { bgcolor: '#fff3f0' } }}>← Quay lại Danh sách</Button>
          <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#d9421f' } }}>+ Thêm Điểm Mới</Button>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        <Box sx={{ flex: 1, minWidth: 400 }}>
          <Paper sx={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#FF5733' }}>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 60 }}>STT</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tên Điểm</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', minWidth: 180 }}>Địa Chỉ</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 100 }}>Tọa Độ</TableCell>
                    <TableCell sx={{ color: 'white', fontWeight: 'bold', width: 80 }} align="center">Hành Động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3 }}>⏳ Đang tải dữ liệu...</TableCell></TableRow>
                  ) : points.length === 0 ? (
                    <TableRow><TableCell colSpan={5} align="center" sx={{ py: 3, color: '#999' }}>📍 Chưa có điểm đón nào</TableCell></TableRow>
                  ) : (
                    displayedPoints.map((p, idx) => (
                      <TableRow key={p.Id} sx={{ '&:hover': { bgcolor: '#fff5f2' }, '&:nth-of-type(even)': { bgcolor: '#fafafa' } }}>
                        <TableCell sx={{ fontWeight: 'bold', bgcolor: '#fff3f0' }}>
                          <Chip label={page * rowsPerPage + idx + 1} size="small" sx={{ bgcolor: '#FF5733', color: 'white', fontWeight: 'bold' }} />
                        </TableCell>
                        <TableCell sx={{ fontWeight: '500' }}>{p.PointName || '—'}</TableCell>
                        <TableCell sx={{ fontSize: '0.85rem', color: '#555' }}>{p.Address || 'Chưa có'}</TableCell>
                        <TableCell sx={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#666' }}>{Number(p.Latitude).toFixed(4)}<br/>{Number(p.Longitude).toFixed(4)}</TableCell>
                        <TableCell align="center">
                          <IconButton size="small" onClick={() => handleEdit(p)} color="primary" title="Chỉnh sửa"><EditIcon fontSize="small" /></IconButton>
                          <IconButton size="small" onClick={() => handleDelete(p)} color="error" title="Xóa"><DeleteIcon fontSize="small" /></IconButton>
                        </TableCell>
                      </TableRow>
                    ))
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
          <Box sx={{ bgcolor: '#FF5733', color: 'white', p: 1.5, fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
            <NavigationIcon /> Bản Đồ Tuyến Đường ({points.length} điểm)
          </Box>
          <Box sx={{ flex: 1, position: 'relative', minHeight: 550, bgcolor: '#e0e0e0' }}>
            <div ref={containerRef} className="full-size" />
          </Box>
        </Box>
      </Box>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#FF5733', color: 'white', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1 }}>
          {editingPoint ? '✏️ Chỉnh Sửa Điểm Đón' : '📍 Thêm Điểm Đón Mới'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 2 }}>
            <TextField 
              type="number"
              value={form.PointOrder} 
              onChange={(e) => setForm(prev => ({ ...prev, PointOrder: e.target.value }))} 
              fullWidth
              size="small"
            />
            <TextField 
              label="Tên điểm đón" 
              name="PointName" 
              value={form.PointName} 
              onChange={(e) => setForm(prev => ({ ...prev, PointName: e.target.value }))} 
              fullWidth
              size="small"
              placeholder="VD: Trường Tiểu học ABC"
            />
            <TextField 
              label="Địa chỉ" 
              name="Address" 
              value={form.Address} 
              onChange={(e) => setForm(prev => ({ ...prev, Address: e.target.value }))} 
              fullWidth
              size="small"
              multiline
              rows={2}
              placeholder="VD: 123 Nguyễn Hữu Cảnh, Quận 1, TP HCM"
            />
            <Divider sx={{ my: 1 }}>Tọa Độ GPS</Divider>
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
          <Button onClick={() => setOpenDialog(false)} sx={{ color: '#666' }}>Hủy</Button>
          <Button variant="contained" onClick={handleSubmit} sx={{ bgcolor: '#FF5733', '&:hover': { bgcolor: '#d9421f' } }}>
            {editingPoint ? '💾 Cập Nhật' : '✅ Thêm Điểm'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RouteStopsPage;
