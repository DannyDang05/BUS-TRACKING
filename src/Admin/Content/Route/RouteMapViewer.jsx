import React, { useEffect, useRef, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert } from '@mui/material';
import { MapOutlined as MapIcon, Navigation as NavigationIcon } from '@mui/icons-material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getRouteById, getPickupPoints } from '../../../service/apiService';
import PaginationControls from '../PaginationControls';
import { useLanguage } from '../../Shared/LanguageContext';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

// Snowflakes are provided globally by Admin layout

const RouteMapViewer = ({ open, onClose, routeId }) => {
  const { t } = useLanguage();
  const [route, setRoute] = useState(null);
  const [points, setPoints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [optimizedOrder, setOptimizedOrder] = useState([]);

  // pagination state for points list
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (!open || !routeId) return;
    const load = async () => {
      setLoading(true);
      setOptimizedOrder([]); // Reset optimized order when loading new route
      try {
        const [routeRes, pointsRes] = await Promise.all([
          getRouteById(routeId),
          getPickupPoints(routeId)
        ]);
        const routeData = routeRes?.data || routeRes;
        const pointsData = pointsRes?.data || pointsRes;
        setRoute(routeData);
        setPoints(pointsData || []);
      } catch (err) {
        console.error('Failed to load route data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [open, routeId]);

  useEffect(() => {
    if (!containerRef.current || !open) return;

    // Small delay to ensure DOM has rendered
    const timer = setTimeout(() => {
      mapboxgl.accessToken = MAPBOX_TOKEN;
      try {
        mapRef.current = new mapboxgl.Map({
          container: containerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [106.67973554, 10.75496887], // Trường ĐH Sài Gòn Quận 5
          zoom: 13
        });

        // Draw map when fully loaded
        mapRef.current.on('load', () => {
          mapRef.current.resize();
          // Draw if points are already loaded
          if (points.length > 0) {
            drawOnMap(points);
          }
        });
      } catch (err) {
        console.error('Map initialization error:', err);
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [open, points]);

  // Calculate optimized order when points change
  useEffect(() => {
    if (points.length > 0 && optimizedOrder.length === 0) {
      setOptimizedOrder(findShortestPath(points));
    }
  }, [points, optimizedOrder]);

  // Redraw when optimizedOrder is ready and map exists
  useEffect(() => {
    if (!mapRef.current || !open || points.length === 0 || optimizedOrder.length === 0) return;
    drawOnMap(points);
  }, [optimizedOrder]);

  const clearMarkers = () => {
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];
    if (!mapRef.current) return;
    if (mapRef.current.getSource('route-line')) {
      if (mapRef.current.getLayer('route-line')) mapRef.current.removeLayer('route-line');
      mapRef.current.removeSource('route-line');
    }
  };

  useEffect(() => {
    setPage(0);
  }, [points]);

  const displayedPoints = points.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Nearest Neighbor + 2-opt optimization for shortest path
  const findShortestPath = (pts) => {
    if (pts.length < 3) return Array.from({ length: pts.length }, (_, i) => i);
    
    // Nearest Neighbor
    const unvisited = new Set(Array.from({ length: pts.length }, (_, i) => i));
    const path = [0];
    unvisited.delete(0);
    let current = 0;

    while (unvisited.size > 0) {
      let nearest = -1;
      let minDist = Infinity;
      const curLat = parseFloat(pts[current].Latitude);
      const curLng = parseFloat(pts[current].Longitude);

      for (const idx of unvisited) {
        const dist = calculateDistance(
          curLat, curLng,
          parseFloat(pts[idx].Latitude),
          parseFloat(pts[idx].Longitude)
        );
        if (dist < minDist) {
          minDist = dist;
          nearest = idx;
        }
      }

      path.push(nearest);
      unvisited.delete(nearest);
      current = nearest;
    }

    // 2-opt improvement
    let improved = true;
    let iterations = 0;
    while (improved && iterations < 100) {
      improved = false;
      iterations++;

      for (let i = 0; i < path.length - 2; i++) {
        for (let k = i + 2; k < path.length; k++) {
          const a = path[i], b = path[i + 1], c = path[k], d = path[(k + 1) % path.length];
          const lat1 = parseFloat(pts[a].Latitude), lng1 = parseFloat(pts[a].Longitude);
          const lat2 = parseFloat(pts[b].Latitude), lng2 = parseFloat(pts[b].Longitude);
          const lat3 = parseFloat(pts[c].Latitude), lng3 = parseFloat(pts[c].Longitude);
          const lat4 = parseFloat(pts[d].Latitude), lng4 = parseFloat(pts[d].Longitude);

          const d1 = calculateDistance(lat1, lng1, lat2, lng2) + calculateDistance(lat3, lng3, lat4, lng4);
          const d2 = calculateDistance(lat1, lng1, lat3, lng3) + calculateDistance(lat2, lng2, lat4, lng4);

          if (d2 < d1) {
            const newPath = path.slice(0, i + 1).concat(path.slice(i + 1, k + 1).reverse()).concat(path.slice(k + 1));
            path.splice(0, path.length, ...newPath);
            improved = true;
          }
        }
      }
    }

    return path;
  };

  const getPathDistance = (pts, order) => {
    if (pts.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < order.length - 1; i++) {
      const p1 = pts[order[i]];
      const p2 = pts[order[i + 1]];
      if (!p1 || !p2) {
        console.error(`Invalid point at index ${order[i]} or ${order[i + 1]}. Order:`, order, 'Points length:', pts.length);
        continue;
      }
      total += calculateDistance(
        parseFloat(p1.Latitude), parseFloat(p1.Longitude),
        parseFloat(p2.Latitude), parseFloat(p2.Longitude)
      );
    }
    return total.toFixed(2);
  };

  const drawOnMap = async (pts) => {
    if (!mapRef.current || pts.length === 0) return;
    
    const map = mapRef.current;

    clearMarkers();

    // Thêm marker trường học (Đại học Sài Gòn Quận 5)
    const schoolEl = document.createElement('div');
    schoolEl.innerHTML = '🏫';
    schoolEl.style.fontSize = '32px';
    schoolEl.style.cursor = 'pointer';
    schoolEl.style.filter = 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))';
    const schoolMarker = new mapboxgl.Marker({ element: schoolEl })
      .setLngLat([106.68216890, 10.76143060])
      .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="padding: 10px; min-width: 200px; text-align: center;">
          <h4 style="margin: 0 0 5px 0; font-size: 16px; color: #f44336; font-weight: bold;">
            🏫 Trường ĐH Sài Gòn, Quận 5
          </h4>
          <p style="margin: 0; font-size: 12px; color: #666;">Điểm xuất phát & về</p>
        </div>
      `))
      .addTo(map);
    markersRef.current.push(schoolMarker);

    // NOTE: Admin route viewer displays static route configuration
    // Don't filter by pickup status - show all configured pickup points
    console.log(`🗺️ Displaying ${pts.length} pickup points`);

    // Calculate or use existing optimized order
    const order = optimizedOrder.length > 0 ? optimizedOrder : findShortestPath(pts);
    
    // Tọa độ điểm đón học sinh
    const studentCoords = order.map(idx => {
      const p = pts[idx];
      if (!p) {
        console.error(`Point at index ${idx} is undefined. Order: ${order}, Points length: ${pts.length}`);
        return null;
      }
      return [parseFloat(p.Longitude), parseFloat(p.Latitude)];
    }).filter(c => c && Number.isFinite(c[0]) && Number.isFinite(c[1]));

    // Tạo route hoàn chỉnh: Trường -> Học sinh -> Trường
    const schoolCoord = [106.68216890, 10.75496887];
    const coords = [schoolCoord, ...studentCoords, schoolCoord];

    console.log('Drawing map with coords:', coords, 'Order:', order);

    // Add markers với icon nhỏ gọn 30px
    order.forEach((originalIdx, displayIdx) => {
      const p = pts[originalIdx];
      if (!p) {
        console.error(`Cannot create marker: Point at index ${originalIdx} is undefined`);
        return;
      }
      const lng = parseFloat(p.Longitude);
      const lat = parseFloat(p.Latitude);
      
      if (Number.isFinite(lng) && Number.isFinite(lat)) {
        const el = document.createElement('div');
        const number = displayIdx + 1;
        const svgData = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 30 30%22%3E%3Ccircle cx=%2215%22 cy=%2215%22 r=%2213%22 fill=%22%232196F3%22 stroke=%22white%22 stroke-width=%222%22/%3E%3Ctext x=%2215%22 y=%2220%22 text-anchor=%22middle%22 fill=%22white%22 font-weight=%22bold%22 font-size=%2214%22%3E${number}%3C/text%3E%3C/svg%3E`;
        el.style.backgroundImage = `url('${svgData}')`;
        el.style.backgroundSize = '100%';
        el.style.width = '30px';
        el.style.height = '30px';
        el.style.cursor = 'pointer';
        
        const marker = new mapboxgl.Marker({ element: el })
          .setLngLat([lng, lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 20 }).setHTML(
              `<div style="font-weight:bold;color:#2196F3;font-size:13px;">${p.PointName || 'Điểm ' + (originalIdx + 1)}</div><div style="font-size:11px;color:#666;">${p.Address || 'Chưa có địa chỉ'}</div>`
            )
          )
          .addTo(map);
        markersRef.current.push(marker);
      }
    });

    if (coords.length > 1) {
      // Remove existing line and source if present
      try {
        if (map.getLayer('route-line')) {
          map.removeLayer('route-line');
        }
        if (map.getSource('route-line')) {
          map.removeSource('route-line');
        }
      } catch (e) {
        console.log('Layer/source not found, creating new');
      }

      // Gọi OSRM API để lấy đường đi thực tế
      try {
        const coordsStr = coords.map(c => `${c[0]},${c[1]}`).join(';');
        const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${coordsStr}?overview=full&geometries=geojson`;
        const response = await fetch(osrmUrl);
        const data = await response.json();
        
        if (data.code === 'Ok' && data.routes && data.routes[0]) {
          const routeGeometry = data.routes[0].geometry;
          
          map.addSource('route-line', {
            type: 'geojson',
            data: { type: 'Feature', geometry: routeGeometry }
          });

          map.addLayer({
            id: 'route-line',
            type: 'line',
            source: 'route-line',
            layout: { 'line-join': 'round', 'line-cap': 'round' },
            paint: { 'line-color': '#2196F3', 'line-width': 4, 'line-opacity': 0.75 }
          });
        } else {
          throw new Error('OSRM failed');
        }
      } catch (error) {
        console.warn('OSRM routing failed, using straight lines:', error);
        // Fallback: vẽ đường thẳng
        map.addSource('route-line', {
          type: 'geojson',
          data: { 
            type: 'Feature', 
            geometry: { 
              type: 'LineString', 
              coordinates: coords 
            } 
          }
        });

        map.addLayer({
          id: 'route-line',
          type: 'line',
          source: 'route-line',
          layout: { 'line-join': 'round', 'line-cap': 'round' },
          paint: { 'line-color': '#2196F3', 'line-width': 4, 'line-opacity': 0.8 }
        });
      }

      // Fit bounds to show all points
      const bounds = coords.reduce(
        (b, c) => b.extend(c),
        new mapboxgl.LngLatBounds(coords[0], coords[0])
      );
      map.fitBounds(bounds, { padding: 60, maxZoom: 15, duration: 500 });
    }
  };

  const calculateTotalDistance = () => {
    if (!points || points.length === 0) return 0;
    let order = optimizedOrder.length > 0 ? optimizedOrder : Array.from({ length: points.length }, (_, i) => i);
    // Filter out invalid indices
    order = order.filter(idx => idx >= 0 && idx < points.length);
    if (order.length < 2) return 0;
    return getPathDistance(points, order);
  };

  return (
    <>
      <Dialog 
        open={open} 
        onClose={onClose} 
        maxWidth="lg" 
        fullWidth
        PaperProps={{
          sx: {
            height: '90vh',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
            backdropFilter: 'blur(10px)'
          }
        }}
      >
        <DialogTitle sx={{ 
          background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)', 
          color: 'white', 
          fontWeight: 'bold', 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          flexShrink: 0,
          boxShadow: '0 4px 20px rgba(0, 151, 167, 0.3)'
        }}>
          ❄️ {t('routeMap')} ❄️
        </DialogTitle>
        <DialogContent sx={{ flex: 1, display: 'flex', overflow: 'hidden', p: 2 ,marginTop:"30px"}}>
          <Box sx={{ display: 'flex', gap: 2.5, width: '100%', height: '100%' }}>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2, overflow: 'auto' }}>
              {loading ? (
                <Typography sx={{ py: 4, textAlign: 'center', color: '#00838f', fontWeight: 'bold' }}>⏳ {t('loading')}</Typography>
              ) : route ? (
                <>
                  <Paper sx={{ 
                    p: 2.5, 
                    background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.08) 0%, rgba(0, 188, 212, 0.08) 100%)',
                    borderLeft: '4px solid #0097a7',
                    borderRadius: '8px',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1.5 }}>
                      <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#0097a7' }}>{route.Name}</Typography>
                            <Typography variant="caption" sx={{ color: '#00838f' }}>{t('codeLabel')}: {route.MaTuyen}</Typography>
                      </Box>
                      <Chip 
                        label={route.Status === 'active' ? `✓ ${t('activeStatus')}` : `✗ ${t('inactiveStatus')}`} 
                        size="small" 
                        color={route.Status === 'active' ? 'success' : 'default'}
                        sx={{ fontWeight: 'bold' }}
                      />
                    </Box>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, mt: 1.5, pt: 1.5, borderTop: '1px solid rgba(0, 151, 167, 0.3)' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00838f' }}>👤 Tài Xế</Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', color: '#0097a7' }}>{route.DriverId || '—'}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" sx={{ color: '#00838f' }}>🚌 Xe</Typography>
                        <Typography variant="body2" sx={{ fontWeight: '500', color: '#0097a7' }}>{route.VehicleId || '—'}</Typography>
                      </Box>
                    </Box>
                  </Paper>

                  <Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#0097a7' }}>📍 {points.length} {t('pickupPoints')}</Typography>
                      <Chip 
                        icon={<NavigationIcon />}
                        label={`${calculateTotalDistance()} km`} 
                        size="small" 
                        sx={{ bgcolor: '#0097a7', color: 'white', fontWeight: 'bold', boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)' }}
                      />
                    </Box>
                    <TableContainer component={Paper} sx={{ maxHeight: 320, bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)' }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow sx={{ background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)' }}>
                            <TableCell sx={{ color: 'black', fontWeight: 'bold', width: 50 }}>{t('index')}</TableCell>
                              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>{t('pointName')}</TableCell>
                              <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>{t('address')}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {points.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={3} align="center" sx={{ py: 2, color: '#999' }}>{t('noPickupPoints')}</TableCell>
                            </TableRow>
                          ) : (
                            displayedPoints.map((p, idx) => {
                              const originalIdx = page * rowsPerPage + idx;
                              return (
                                <TableRow key={p.Id || originalIdx} sx={{ '&:hover': { bgcolor: 'rgba(0, 151, 167, 0.1)' }, '&:nth-of-type(even)': { bgcolor: 'rgba(0, 151, 167, 0.05)' } }}>
                                  <TableCell sx={{ fontWeight: 'bold', bgcolor: 'rgba(0, 151, 167, 0.08)' }}>
                                    <Chip 
                                      label={optimizedOrder.length > 0 ? optimizedOrder.indexOf(originalIdx) + 1 : originalIdx + 1} 
                                      size="small" 
                                      sx={{ bgcolor: '#0097a7', color: 'white' }} 
                                    />
                                  </TableCell>
                                  <TableCell sx={{ fontWeight: '500', fontSize: '0.9rem', color: '#00838f' }}>{p.MaHocSinh || '—'}</TableCell>
                                  <TableCell sx={{ fontSize: '0.8rem', color: '#666' }}>{p.DiaChi || t('noPickupPoints')}</TableCell>
                                </TableRow>
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <div className="custom-table-footer">
                      <select className="rows-per-page" value={rowsPerPage} onChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}>
                        <option value={3}>3 {t('perPage')}</option>
                          <option value={5}>5 {t('perPage')}</option>
                          <option value={10}>10 {t('perPage')}</option>
                      </select>
                      <PaginationControls count={points.length} page={page} rowsPerPage={rowsPerPage} onPageChange={(p) => setPage(p)} />
                    </div>
                  </Box>
                </>
              ) : (
                <Alert severity="error">Không tìm thấy dữ liệu tuyến</Alert>
              )}
            </Box>

            <Box sx={{ width: 500, minWidth: 500, borderRadius: 2, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0, 151, 167, 0.3)', display: 'flex', flexDirection: 'column', flexShrink: 0, maxHeight: 'calc(90vh - 120px)', background: 'rgba(255, 255, 255, 0.9)', backdropFilter: 'blur(10px)' }}>
              <Box sx={{ background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)', color: 'white', p: 1.5, fontSize: '0.9rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0, boxShadow: '0 4px 15px rgba(0, 151, 167, 0.2)' }}>
                ❄️ Bản Đồ Tuyến Đường ❄️
              </Box>
              <Box sx={{ flex: 1, position: 'relative', bgcolor: '#e8f4f8', overflow: 'hidden', minHeight: 400 }}>
                <div
                  ref={containerRef}
                  className="full-size"
                />
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 151, 167, 0.2)', background: 'rgba(255, 255, 255, 0.5)' }}>
          <Button onClick={onClose} sx={{ color: '#0097a7', fontWeight: 'bold', '&:hover': { bgcolor: 'rgba(0, 151, 167, 0.1)' } }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default RouteMapViewer;
