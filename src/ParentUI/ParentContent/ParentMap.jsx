import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { 
    Box, Typography, Paper, Divider, Button, CircularProgress, 
    Alert, Chip, Stack, Card, CardContent, IconButton, Tooltip 
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import PlaceIcon from '@mui/icons-material/Place';
import SpeedIcon from '@mui/icons-material/Speed';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';

import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllRoutesWithPoints, getActiveSimulations } from '../../service/apiService';

const ParentMap = (props) => {
    const navigate = useNavigate(); 
    const { studentId } = useParams();
    
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const vehicleMarkerRef = useRef();
    const studentMarkerRef = useRef();
    const pickupMarkersRef = useRef([]);
    const routeLayerRef = useRef(null);

    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [distance, setDistance] = useState(null);
    const [eta, setEta] = useState(null);
    const [vehicleStatus, setVehicleStatus] = useState('unknown');

    // Calculate distance between two coordinates
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371000;
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                  Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                  Math.sin(dLon/2) * Math.sin(dLon/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c;
    };

    // Initialize map
    useEffect(() => {
        const initMap = () => {
            if (!mapContainerRef.current) return;
            
            mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
            
            try {
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 13,
                    attributionControl: false
                });

                mapRef.current.on('load', () => {
                    console.log('✅ Parent map loaded');
                });

                mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
            } catch (err) {
                console.error('❌ Error initializing parent map:', err);
                setError('Không thể tải bản đồ');
            }
        };

        const timeoutId = setTimeout(initMap, 100);
        return () => {
            clearTimeout(timeoutId);
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    // Fetch route data and track vehicle
    const fetchRouteData = async () => {
        try {
            if (!studentId) {
                setError('Không có thông tin học sinh');
                setLoading(false);
                return;
            }

            const response = await getAllRoutesWithPoints();
            const routes = response.data || [];
            
            let studentRoute = null;
            let studentPickupPoint = null;

            for (const route of routes) {
                if (route.pickupPoints && route.pickupPoints.length > 0) {
                    const pickup = route.pickupPoints.find(p => 
                        p.MaHocSinh === studentId || p.studentId === studentId
                    );
                    if (pickup) {
                        studentRoute = route;
                        studentPickupPoint = pickup;
                        break;
                    }
                }
            }

            if (!studentRoute || !studentPickupPoint) {
                setError('Không tìm thấy tuyến xe của con bạn');
                setLoading(false);
                return;
            }

            try {
                const simResponse = await getActiveSimulations();
                const simulations = simResponse.data || [];
                const currentSim = simulations.find(s => s.routeId === studentRoute.routeId);
                
                if (currentSim) {
                    studentRoute.latitude = currentSim.currentLatitude;
                    studentRoute.longitude = currentSim.currentLongitude;
                    studentRoute.speed = currentSim.speed || 0;
                }
            } catch (err) {
                console.log('⚠️ No active simulation');
            }

            setRouteData({
                ...studentRoute,
                studentPickupPoint
            });

            if (studentRoute.latitude && studentRoute.longitude) {
                const dist = calculateDistance(
                    studentRoute.latitude,
                    studentRoute.longitude,
                    studentPickupPoint.latitude || studentPickupPoint.Latitude,
                    studentPickupPoint.longitude || studentPickupPoint.Longitude
                );
                setDistance(dist);

                if (dist < 100) {
                    setVehicleStatus('arrived');
                } else if (dist < 500) {
                    setVehicleStatus('approaching');
                } else {
                    setVehicleStatus('far');
                }

                const avgSpeed = studentRoute.speed || 30;
                const timeInMinutes = Math.round((dist / 1000) / avgSpeed * 60);
                setEta(timeInMinutes);
            }

            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching route data:', err);
            setError('Lỗi khi tải dữ liệu tuyến xe');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRouteData();
        const interval = setInterval(fetchRouteData, 10000);
        return () => clearInterval(interval);
    }, [studentId]);

    useEffect(() => {
        if (!routeData || !mapRef.current) return;
        updateMapView();
    }, [routeData]);

    const updateMapView = () => {
        const route = routeData;
        if (!route || !mapRef.current) return;

        if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
        if (studentMarkerRef.current) studentMarkerRef.current.remove();
        pickupMarkersRef.current.forEach(m => m.remove());
        pickupMarkersRef.current = [];

        if (routeLayerRef.current && mapRef.current.getLayer(routeLayerRef.current)) {
            mapRef.current.removeLayer(routeLayerRef.current);
            mapRef.current.removeSource(routeLayerRef.current);
        }

        const studentPickup = route.studentPickupPoint;
        const studentLat = studentPickup.latitude || studentPickup.Latitude;
        const studentLng = studentPickup.longitude || studentPickup.Longitude;

        const studentMarkerEl = document.createElement('div');
        studentMarkerEl.style.cssText = `
            width: 50px; height: 50px;
            background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
            border: 4px solid white; border-radius: 50%;
            box-shadow: 0 4px 12px rgba(76, 175, 80, 0.5);
            display: flex; align-items: center; justify-content: center;
            font-size: 24px; cursor: pointer;
            animation: pulse 2s infinite;
        `;
        studentMarkerEl.innerHTML = '🏠';

        studentMarkerRef.current = new mapboxgl.Marker({ element: studentMarkerEl })
            .setLngLat([studentLng, studentLat])
            .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 8px;">
                    <strong style="color: #4CAF50;">📍 Điểm đón của con bạn</strong><br/>
                    <small>${studentPickup.address || studentPickup.Address || 'Không có địa chỉ'}</small>
                </div>
            `))
            .addTo(mapRef.current);

        let vehicleLat = route.latitude;
        let vehicleLng = route.longitude;

        if (!vehicleLat || !vehicleLng) {
            const schoolPoint = route.pickupPoints?.find(p => !p.MaHocSinh && !p.studentId);
            if (schoolPoint) {
                vehicleLat = schoolPoint.latitude || schoolPoint.Latitude;
                vehicleLng = schoolPoint.longitude || schoolPoint.Longitude;
            }
        }

        if (vehicleLat && vehicleLng) {
            const vehicleMarkerEl = document.createElement('div');
            vehicleMarkerEl.style.cssText = `
                width: 60px; height: 60px;
                background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                border: 4px solid white; border-radius: 50%;
                box-shadow: 0 4px 16px rgba(33, 150, 243, 0.6);
                display: flex; align-items: center; justify-content: center;
                font-size: 32px; cursor: pointer; z-index: 1000;
            `;
            vehicleMarkerEl.innerHTML = '🚌';

            vehicleMarkerRef.current = new mapboxgl.Marker({ element: vehicleMarkerEl })
                .setLngLat([vehicleLng, vehicleLat])
                .setPopup(new mapboxgl.Popup({ offset: 30 }).setHTML(`
                    <div style="padding: 8px;">
                        <strong style="color: #2196F3;">🚌 Xe bus</strong><br/>
                        <small>Tuyến: ${route.routeName || 'N/A'}</small><br/>
                        <small>Biển số: ${route.vehicleNumber || 'N/A'}</small><br/>
                        <small>Tốc độ: ${route.speed || 0} km/h</small>
                    </div>
                `))
                .addTo(mapRef.current);
        }

        if (route.pickupPoints) {
            route.pickupPoints.forEach((point, index) => {
                const lat = point.latitude || point.Latitude;
                const lng = point.longitude || point.Longitude;
                
                if (point.MaHocSinh === studentId || point.studentId === studentId) return;

                if (lat && lng) {
                    const markerEl = document.createElement('div');
                    markerEl.style.cssText = `
                        width: 30px; height: 30px; background: #FFA726;
                        border: 2px solid white; border-radius: 50%;
                        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                        display: flex; align-items: center; justify-content: center;
                        font-size: 12px; font-weight: bold; color: white;
                    `;
                    markerEl.textContent = index + 1;

                    const marker = new mapboxgl.Marker({ element: markerEl })
                        .setLngLat([lng, lat])
                        .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML(`
                            <div style="padding: 6px;">
                                <strong>Điểm ${index + 1}</strong><br/>
                                <small>${point.address || point.Address || ''}</small>
                            </div>
                        `))
                        .addTo(mapRef.current);
                    
                    pickupMarkersRef.current.push(marker);
                }
            });
        }

        if (route.pickupPoints && route.pickupPoints.length > 0) {
            const coordinates = route.pickupPoints
                .map(p => [p.longitude || p.Longitude, p.latitude || p.Latitude])
                .filter(coord => coord[0] && coord[1]);

            if (coordinates.length > 1) {
                const sourceId = `route-${route.routeId}`;
                routeLayerRef.current = sourceId;

                if (!mapRef.current.getSource(sourceId)) {
                    mapRef.current.addSource(sourceId, {
                        type: 'geojson',
                        data: {
                            type: 'Feature',
                            properties: {},
                            geometry: {
                                type: 'LineString',
                                coordinates: coordinates
                            }
                        }
                    });

                    mapRef.current.addLayer({
                        id: sourceId,
                        type: 'line',
                        source: sourceId,
                        layout: { 'line-join': 'round', 'line-cap': 'round' },
                        paint: { 'line-color': '#2196F3', 'line-width': 4, 'line-opacity': 0.8 }
                    });
                }
            }
        }

        const bounds = new mapboxgl.LngLatBounds();
        if (vehicleLat && vehicleLng) bounds.extend([vehicleLng, vehicleLat]);
        bounds.extend([studentLng, studentLat]);
        mapRef.current.fitBounds(bounds, { padding: 80, maxZoom: 15 });
    };

    const handleRecenter = () => {
        if (!routeData || !mapRef.current) return;
        const studentPickup = routeData.studentPickupPoint;
        const lat = studentPickup.latitude || studentPickup.Latitude;
        const lng = studentPickup.longitude || studentPickup.Longitude;
        mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
    };

    const getStatusColor = () => {
        switch (vehicleStatus) {
            case 'arrived': return '#4CAF50';
            case 'approaching': return '#FF9800';
            case 'far': return '#2196F3';
            default: return '#9E9E9E';
        }
    };

    const getStatusText = () => {
        switch (vehicleStatus) {
            case 'arrived': return '🎉 Xe đã đến gần!';
            case 'approaching': return '⚠️ Xe đang đến gần';
            case 'far': return '🚌 Xe đang trên đường';
            default: return '❓ Không có thông tin';
        }
    };

    const handleGoBackToParent = () => {
        navigate(-1); 
    };
    

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
            {/* Back Button */}
            <Button 
                variant="outlined" 
                color="primary"
                onClick={handleGoBackToParent}
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'flex-start' }}
            >
                Trở về
            </Button>

            {/* Status Card */}
            {routeData && (
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)'
                }}>
                    <CardContent>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                            <Chip 
                                icon={<DirectionsBusIcon />}
                                label={getStatusText()}
                                sx={{ 
                                    bgcolor: getStatusColor(),
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontSize: '14px'
                                }}
                            />
                            {distance !== null && (
                                <Chip 
                                    icon={<PlaceIcon />}
                                    label={`${distance < 1000 ? Math.round(distance) + 'm' : (distance/1000).toFixed(1) + 'km'}`}
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                            {eta !== null && vehicleStatus !== 'arrived' && (
                                <Chip 
                                    icon={<AccessTimeIcon />}
                                    label={`Còn ~${eta} phút`}
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                            {routeData.speed > 0 && (
                                <Chip 
                                    icon={<SpeedIcon />}
                                    label={`${routeData.speed} km/h`}
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" sx={{ mt: 1, color: '#546E7A' }}>
                            Tuyến: <strong>{routeData.routeName}</strong> | 
                            Biển số: <strong>{routeData.vehicleNumber || 'N/A'}</strong>
                        </Typography>
                    </CardContent>
                </Card>
            )}

            {/* Map Container */}
            <Paper 
                sx={{ 
                    flex: 1, 
                    position: 'relative', 
                    overflow: 'hidden',
                    borderRadius: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                    minHeight: '500px'
                }}
            >
                {loading && (
                    <Box sx={{ 
                        position: 'absolute', 
                        top: 0, left: 0, right: 0, bottom: 0, 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        zIndex: 1000
                    }}>
                        <Stack alignItems="center" spacing={2}>
                            <CircularProgress />
                            <Typography>Đang tải bản đồ...</Typography>
                        </Stack>
                    </Box>
                )}

                {error && (
                    <Alert severity="error" sx={{ m: 2 }}>
                        {error}
                    </Alert>
                )}

                <Box ref={mapContainerRef} sx={{ width: '100%', height: '100%' }} />

                {/* Control Buttons */}
                <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16, 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: 1 
                }}>
                    <Tooltip title="Làm mới">
                        <IconButton 
                            onClick={fetchRouteData}
                            sx={{ 
                                bgcolor: 'white', 
                                boxShadow: 2,
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                        >
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Về vị trí con">
                        <IconButton 
                            onClick={handleRecenter}
                            sx={{ 
                                bgcolor: 'white', 
                                boxShadow: 2,
                                '&:hover': { bgcolor: '#f5f5f5' }
                            }}
                        >
                            <MyLocationIcon />
                        </IconButton>
                    </Tooltip>
                </Box>

                {/* Legend */}
                <Paper sx={{ 
                    position: 'absolute', 
                    bottom: 16, 
                    right: 16, 
                    p: 1.5,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    boxShadow: 2
                }}>
                    <Stack spacing={0.5}>
                        <Typography variant="caption" fontWeight="bold" color="primary">
                            Chú thích:
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ fontSize: '20px' }}>🚌</Box>
                            <Typography variant="caption">Xe bus</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ fontSize: '20px' }}>🏠</Box>
                            <Typography variant="caption">Điểm đón con bạn</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ 
                                width: 16, height: 16, 
                                bgcolor: '#FFA726', 
                                borderRadius: '50%',
                                border: '2px solid white'
                            }} />
                            <Typography variant="caption">Điểm đón khác</Typography>
                        </Stack>
                    </Stack>
                </Paper>
            </Paper>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); }
                        50% { transform: scale(1.1); }
                    }
                `}
            </style>
        </Box>
    );
};

export default ParentMap;