import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useOutletContext } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    List,
    ListItem,
    ListItemText,
    Chip,
    IconButton,
    Divider,
    Tooltip,
    CircularProgress,
    Alert,
    ToggleButton,
    ToggleButtonGroup,
    FormControlLabel,
    Switch,
    Accordion,
    AccordionSummary,
    AccordionDetails
} from '@mui/material';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import RefreshIcon from '@mui/icons-material/Refresh';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RouteIcon from '@mui/icons-material/Route';
import PlaceIcon from '@mui/icons-material/Place';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TimelineIcon from '@mui/icons-material/Timeline';
import { getLiveLocations, getPickupPoints, getAllRoutesWithPoints } from '../../service/apiService';

const Map = (props) => {
    const { collapsed } = useOutletContext();
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const markersRef = useRef({}); // Store markers for each vehicle
    const pickupMarkersRef = useRef([]); // Store pickup point markers
    const routeLayersRef = useRef({}); // Store route layers

    // State
    const [allRoutes, setAllRoutes] = useState([]); // All routes (including non-running)
    const [vehicles, setVehicles] = useState([]); // Currently running vehicles
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all'); // all, running, delayed, issue
    const [showRoutes, setShowRoutes] = useState(false);
    const [showPickupPoints, setShowPickupPoints] = useState(false);
    const [pickupPoints, setPickupPoints] = useState([]);
    const [viewMode, setViewMode] = useState('running'); // 'running' or 'all'

    // Initialize map
    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [106.660172, 10.762622],
            zoom: 12
        });

        return () => {
            mapRef.current.remove();
        };
    }, [])

    // Resize map when sidebar collapses
    useEffect(() => {
        if (mapRef.current) {
            mapRef.current.resize();
        }
    }, [collapsed]);

    // Fetch all routes (including non-running ones)
    const fetchAllRoutes = async (isInitialLoad = false) => {
        try {
            if (isInitialLoad) setLoading(true);
            
            const response = await getAllRoutesWithPoints();
            const routesData = response.data || [];
            
            // Only update state if this is initial load or data changed significantly
            if (isInitialLoad) {
                setAllRoutes(routesData);
                const runningVehicles = routesData.filter(route => 
                    route.latitude && route.longitude && 
                    (route.status?.toLowerCase().includes('chạy') || route.status?.toLowerCase() === 'running')
                );
                setVehicles(runningVehicles);
                setError(null);
            }
            
            // Always update markers (smooth position updates)
            const runningVehicles = routesData.filter(route => 
                route.latitude && route.longitude && 
                (route.status?.toLowerCase().includes('chạy') || route.status?.toLowerCase() === 'running')
            );
            
            if (viewMode === 'running') {
                updateMapMarkers(runningVehicles);
            } else {
                updateMapMarkers(routesData);
            }
            
        } catch (err) {
            console.error('Error fetching routes:', err);
            if (isInitialLoad) {
                setError('Không thể tải dữ liệu tuyến xe. Vui lòng thử lại.');
            }
        } finally {
            if (isInitialLoad) setLoading(false);
        }
    };

    // Fetch live vehicle locations (backward compatibility)
    const fetchVehicleLocations = async () => {
        await fetchAllRoutes();
    };

    // Fetch pickup points for selected route
    const fetchPickupPoints = async (routeId) => {
        try {
            const response = await getPickupPoints(routeId);
            const points = response.data || [];
            setPickupPoints(points);
            return points;
        } catch (err) {
            console.error('Error fetching pickup points:', err);
            return [];
        }
    };

    // Update markers on map (optimized to only update position, not recreate)
    const updateMapMarkers = (routeData) => {
        if (!mapRef.current) return;

        const currentRouteIds = new Set();

        routeData.forEach(route => {
            // For non-running routes, use first pickup point as location if no current location
            let lat = route.latitude;
            let lng = route.longitude;
            
            if (!lat || !lng) {
                // If route has no current location, use first pickup point
                if (route.pickupPoints && route.pickupPoints.length > 0) {
                    const firstPoint = route.pickupPoints[0];
                    lat = firstPoint.latitude;
                    lng = firstPoint.longitude;
                }
            }
            
            if (!lat || !lng) return;

            currentRouteIds.add(route.routeId);

            // If marker exists, just update position (smooth animation)
            if (markersRef.current[route.routeId]) {
                markersRef.current[route.routeId].setLngLat([lng, lat]);
                return;
            }

            // Create custom marker element only if new
            const el = document.createElement('div');
            el.className = 'custom-marker';
            el.style.width = '40px';
            el.style.height = '40px';
            el.style.backgroundImage = 'url(https://cdn-icons-png.flaticon.com/512/3448/3448339.png)';
            el.style.backgroundSize = 'cover';
            el.style.cursor = 'pointer';
            el.style.borderRadius = '50%';
            el.style.border = '3px solid ' + getStatusColor(route.status);

            // Create popup
            const isRunning = route.latitude && route.longitude;
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="padding: 10px; min-width: 200px;">
                    <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #1976d2;">
                        <strong>${route.routeName || 'N/A'}</strong>
                    </h3>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Mã tuyến:</strong> ${route.routeCode || 'N/A'}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Trạng thái:</strong> ${route.status || 'N/A'}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Biển số:</strong> ${route.licensePlate || 'Chưa có'}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Tài xế:</strong> ${route.driverName || 'Chưa có'}</p>
                    <p style="margin: 5px 0; font-size: 13px;"><strong>Học sinh:</strong> ${route.pickedUp || 0}/${route.totalStudents || 0}</p>
                    ${isRunning ? `<p style="margin: 5px 0; font-size: 13px;"><strong>Tốc độ:</strong> ${route.speed || 0} km/h</p>` : ''}
                    ${isRunning && route.timestamp ? `<p style="margin: 5px 0; font-size: 13px;"><strong>Cập nhật:</strong> ${new Date(route.timestamp).toLocaleTimeString('vi-VN')}</p>` : ''}
                </div>
            `);

            // Add marker to map
            const marker = new mapboxgl.Marker(el)
                .setLngLat([lng, lat])
                .setPopup(popup)
                .addTo(mapRef.current);

            markersRef.current[route.routeId || route.vehicleId] = marker;

            // Click handler
            el.addEventListener('click', () => {
                setSelectedVehicle(route);
                mapRef.current.flyTo({
                    center: [lng, lat],
                    zoom: 15,
                    duration: 1000
                });
            });
        });

        // Remove markers that no longer exist in data
        Object.keys(markersRef.current).forEach(routeId => {
            if (!currentRouteIds.has(parseInt(routeId))) {
                markersRef.current[routeId].remove();
                delete markersRef.current[routeId];
            }
        });
    };

    // Get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'Đang chạy':
            case 'running':
                return '#4caf50'; // Green
            case 'Trễ':
            case 'delayed':
                return '#ff9800'; // Orange
            case 'Sự cố':
            case 'issue':
                return '#f44336'; // Red
            default:
                return '#9e9e9e'; // Gray
        }
    };

    // Fetch locations on mount and set interval
    useEffect(() => {
        fetchAllRoutes(true); // Initial load with loading state
        
        // Auto refresh every 1 second for smooth tracking (without loading state)
        const interval = setInterval(() => {
            fetchAllRoutes(false); // Silent updates, only update markers
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Focus on route/vehicle
    const handleFocusVehicle = async (route) => {
        // For non-running routes, use first pickup point as location
        let lat = route.latitude;
        let lng = route.longitude;
        
        if (!lat || !lng) {
            if (route.pickupPoints && route.pickupPoints.length > 0) {
                const firstPoint = route.pickupPoints[0];
                lat = firstPoint.latitude;
                lng = firstPoint.longitude;
            }
        }
        
        if (!lat || !lng) return;
        
        setSelectedVehicle(route);
        mapRef.current.flyTo({
            center: [lng, lat],
            zoom: 15,
            duration: 1000
        });

        // Open popup
        const marker = markersRef.current[route.routeId || route.vehicleId];
        if (marker) {
            marker.togglePopup();
        }

        // Use pickupPoints from route data if available
        const points = route.pickupPoints || [];
        
        // Load pickup points if enabled
        if (showPickupPoints && points.length > 0) {
            drawPickupPoints(points);
        }

        // Draw route if enabled
        if (showRoutes && points.length > 0) {
            drawRoutePolyline(route);
        }
    };

    // Draw pickup points on map
    const drawPickupPoints = (points) => {
        // Remove old pickup markers
        pickupMarkersRef.current.forEach(marker => marker.remove());
        pickupMarkersRef.current = [];

        if (!points || points.length === 0) return;

        points.forEach((point, index) => {
            // Support both data formats
            const status = point.TinhTrangDon || point.status;
            const address = point.DiaChi || point.address;
            const order = point.PointOrder;
            const longitude = point.Longitude || point.longitude;
            const latitude = point.Latitude || point.latitude;
            const isSchool = !point.MaHocSinh; // Điểm trường không có MaHocSinh
            
            if (!longitude || !latitude) return;
            
            // Create marker element
            const el = document.createElement('div');
            el.className = 'pickup-marker';
            
            if (isSchool) {
                // Marker trường: 🏫
                el.innerHTML = `<div style="
                    background-color: #f44336;
                    color: white;
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    border: 2px solid white;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.4);
                ">🏫</div>`;
            } else {
                // Marker học sinh: số thứ tự
                el.innerHTML = `<div style="
                    background-color: ${status === 'Đã đón' ? '#4caf50' : status === 'Đã trả' ? '#2196f3' : '#ff9800'};
                    color: white;
                    width: 30px;
                    height: 30px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">${order || (index + 1)}</div>`;
            }

            // Create popup
            const popupContent = isSchool 
                ? `<div style="padding: 10px; min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 15px; color: #f44336; font-weight: bold;">
                        🏫 ${status === 'Xuất phát' ? 'ĐIỂM XUẤT PHÁT' : 'ĐIỂM VỀ'}
                    </h4>
                    <p style="margin: 4px 0; font-size: 13px;"><strong>Trường ĐH Sài Gòn, Quận 5</strong></p>
                    <p style="margin: 4px 0; font-size: 11px; color: #666;">${address || 'Điểm tập trung'}</p>
                </div>`
                : `<div style="padding: 8px; min-width: 180px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #1976d2;">
                        Điểm ${order || (index + 1)}: ${status || 'Chưa đón'}
                    </h4>
                    <p style="margin: 4px 0; font-size: 12px;"><strong>Địa chỉ:</strong> ${address || 'N/A'}</p>
                    ${point.studentName ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Học sinh:</strong> ${point.studentName}</p>` : ''}
                </div>`;

            const popup = new mapboxgl.Popup({ offset: 15 }).setHTML(popupContent);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(mapRef.current);

            pickupMarkersRef.current.push(marker);
        });
    };

    // Draw route polyline (straight line between points)
    const drawRoutePolyline = async (route) => {
        if (!mapRef.current || !route.routeId) return;

        const sourceId = `route-${route.routeId}`;
        const layerId = `route-layer-${route.routeId}`;

        // Remove existing route layer
        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        // Use pickupPoints from route data (bao gồm điểm trường từ backend)
        const points = route.pickupPoints || [];
        if (points.length === 0) return;

        // Sắp xếp điểm theo PointOrder (bao gồm cả điểm trường)
        const sortedPoints = points.sort((a, b) => {
            const orderA = a.PointOrder || 0;
            const orderB = b.PointOrder || 0;
            return orderA - orderB;
        });
        
        // Tạo waypoints từ pickupPoints (đã bao gồm điểm trường từ backend)
        let waypoints = [];
        sortedPoints.forEach(p => {
            const lng = p.Longitude || p.longitude;
            const lat = p.Latitude || p.latitude;
            if (lng && lat) {
                waypoints.push([lng, lat]);
            }
        });

        if (waypoints.length < 2) return;

        try {
            let allCoordinates = [];

            // Split into chunks of 25 points (Mapbox limit)
            const chunkSize = 25;
            const chunks = [];
            
            for (let i = 0; i < waypoints.length; i += chunkSize - 1) {
                const chunk = waypoints.slice(i, i + chunkSize);
                if (chunk.length >= 2) {
                    chunks.push(chunk);
                }
            }

            console.log(`📦 Split ${waypoints.length} waypoints into ${chunks.length} chunks`);

            // Fetch route for each chunk
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const coordinates = chunk.map(wp => `${wp[0]},${wp[1]}`).join(';');
                const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
                
                const response = await fetch(directionsUrl);
                const data = await response.json();
                
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const chunkCoords = data.routes[0].geometry.coordinates;
                    allCoordinates = allCoordinates.concat(chunkCoords);
                } else {
                    console.warn(`⚠️ Failed to get route for chunk ${i + 1}, using straight lines`);
                    allCoordinates = allCoordinates.concat(chunk);
                }
            }
            
            if (allCoordinates.length > 0) {
                // Use combined route from API
                const routeGeometry = {
                    type: 'LineString',
                    coordinates: allCoordinates
                };
                
                mapRef.current.addSource(sourceId, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: routeGeometry
                    }
                });

                mapRef.current.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#2196f3',
                        'line-width': 4,
                        'line-opacity': 0.8
                    }
                });

                // Fit bounds to show entire route
                const coordinates = routeGeometry.coordinates;
                const bounds = coordinates.reduce((bounds, coord) => {
                    return bounds.extend(coord);
                }, new mapboxgl.LngLatBounds(coordinates[0], coordinates[0]));

                mapRef.current.fitBounds(bounds, {
                    padding: 50,
                    duration: 1000
                });
            } else {
                // Fallback: Draw straight line (as-the-crow-flies)
                console.log('Using straight line route (API unavailable or no route found)');
                mapRef.current.addSource(sourceId, {
                    type: 'geojson',
                    data: {
                        type: 'Feature',
                        geometry: {
                            type: 'LineString',
                            coordinates: waypoints
                        }
                    }
                });

                mapRef.current.addLayer({
                    id: layerId,
                    type: 'line',
                    source: sourceId,
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    paint: {
                        'line-color': '#2196f3',
                        'line-width': 3,
                        'line-opacity': 0.6,
                        'line-dasharray': [3, 3] // Dashed line for straight route
                    }
                });

                // Fit bounds to show all waypoints
                const bounds = new mapboxgl.LngLatBounds();
                waypoints.forEach(coord => bounds.extend(coord));
                mapRef.current.fitBounds(bounds, { 
                    padding: 50,
                    duration: 1000
                });
            }
        } catch (error) {
            // On error, always draw straight line - no error message to user
            console.log('Drawing fallback straight line route');
            
            mapRef.current.addSource(sourceId, {
                type: 'geojson',
                data: {
                    type: 'Feature',
                    geometry: {
                        type: 'LineString',
                        coordinates: waypoints
                    }
                }
            });

            mapRef.current.addLayer({
                id: layerId,
                type: 'line',
                source: sourceId,
                layout: {
                    'line-join': 'round',
                    'line-cap': 'round'
                },
                paint: {
                    'line-color': '#2196f3',
                    'line-width': 3,
                    'line-opacity': 0.6,
                    'line-dasharray': [3, 3] // Dashed line indicates straight path
                }
            });

            // Fit bounds to show all waypoints
            const bounds = new mapboxgl.LngLatBounds();
            waypoints.forEach(coord => bounds.extend(coord));
            mapRef.current.fitBounds(bounds, { 
                padding: 50,
                duration: 1000
            });
        }

        // Store layer info for cleanup
        routeLayersRef.current[route.routeId] = { sourceId, layerId };
    };

    // Clear route layers
    const clearRouteLayers = () => {
        Object.values(routeLayersRef.current).forEach(({ layerId, sourceId }) => {
            if (mapRef.current.getLayer(layerId)) {
                mapRef.current.removeLayer(layerId);
            }
            if (mapRef.current.getSource(sourceId)) {
                mapRef.current.removeSource(sourceId);
            }
        });
        routeLayersRef.current = {};
    };

    // Handle show routes toggle
    useEffect(() => {
        if (!showRoutes) {
            clearRouteLayers();
        } else if (selectedVehicle) {
            drawRoutePolyline(selectedVehicle);
        }
    }, [showRoutes]);

    // Handle show pickup points toggle
    useEffect(() => {
        if (!showPickupPoints) {
            pickupMarkersRef.current.forEach(marker => marker.remove());
            pickupMarkersRef.current = [];
        } else if (selectedVehicle) {
            const points = selectedVehicle.pickupPoints || [];
            if (points.length > 0) {
                drawPickupPoints(points);
            }
        }
    }, [showPickupPoints]);

    // Switch between running and all routes view
    useEffect(() => {
        if (viewMode === 'running') {
            const runningVehicles = allRoutes.filter(route => 
                route.latitude && route.longitude &&
                (route.status?.toLowerCase().includes('chạy') || route.status?.toLowerCase() === 'running')
            );
            setVehicles(runningVehicles);
            updateMapMarkers(runningVehicles);
        } else {
            setVehicles(allRoutes);
            updateMapMarkers(allRoutes);
        }
    }, [viewMode, allRoutes]);

    const getStatusChip = (status) => {
        const colorMap = {
            'Đang chạy': 'success',
            'running': 'success',
            'Trễ': 'warning',
            'delayed': 'warning',
            'Sự cố': 'error',
            'issue': 'error',
            'Chưa chạy': 'default',
        };
        return <Chip label={status} color={colorMap[status] || 'default'} size="small" />;
    };

    // Filter vehicles by status
    const filteredVehicles = vehicles.filter(vehicle => {
        if (statusFilter === 'all') return true;
        const status = vehicle.status?.toLowerCase() || '';
        if (statusFilter === 'running') return status.includes('chạy') || status === 'running';
        if (statusFilter === 'delayed') return status.includes('trễ') || status === 'delayed';
        if (statusFilter === 'issue') return status.includes('cố') || status === 'issue';
        return true;
    });

    return (
        <Box sx={{ display: 'flex', height: 'calc(100vh - 100px)', position: 'relative' }}>
            {/* Sidebar - Vehicle List */}
            <Paper
                elevation={3}
                sx={{
                    width: 350,
                    overflowY: 'auto',
                    zIndex: 1,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                {/* Header */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', bgcolor: 'primary.main', color: 'white' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <DirectionsBusIcon />
                            {viewMode === 'running' ? 'Xe đang chạy' : 'Tất cả tuyến xe'}
                        </Typography>
                        <Tooltip title="Làm mới">
                            <IconButton color="inherit" size="small" onClick={fetchVehicleLocations}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        {filteredVehicles.length} / {vehicles.length} {viewMode === 'running' ? 'xe đang hoạt động' : 'tuyến'}
                    </Typography>
                    
                    {/* View Mode Toggle */}
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(e, newValue) => {
                            if (newValue !== null) {
                                setViewMode(newValue);
                            }
                        }}
                        size="small"
                        fullWidth
                        sx={{ mt: 1, bgcolor: 'white' }}
                    >
                        <ToggleButton value="running">
                            <Typography variant="caption">Đang chạy</Typography>
                        </ToggleButton>
                        <ToggleButton value="all">
                            <Typography variant="caption">Tất cả</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Box>

                {/* Filters and Controls */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    {/* Status Filter */}
                    <Typography variant="subtitle2" gutterBottom>
                        Lọc theo trạng thái:
                    </Typography>
                    <ToggleButtonGroup
                        value={statusFilter}
                        exclusive
                        onChange={(e, newValue) => {
                            if (newValue !== null) {
                                setStatusFilter(newValue);
                            }
                        }}
                        size="small"
                        fullWidth
                        sx={{ mb: 2 }}
                    >
                        <ToggleButton value="all">
                            <Typography variant="caption">Tất cả</Typography>
                        </ToggleButton>
                        <ToggleButton value="running">
                            <Typography variant="caption">Chạy</Typography>
                        </ToggleButton>
                        <ToggleButton value="delayed">
                            <Typography variant="caption">Trễ</Typography>
                        </ToggleButton>
                        <ToggleButton value="issue">
                            <Typography variant="caption">Sự cố</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>

                    {/* Map Controls */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={showRoutes} 
                                    onChange={(e) => setShowRoutes(e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <RouteIcon fontSize="small" />
                                    <Typography variant="body2">Hiển thị tuyến đường</Typography>
                                </Box>
                            }
                        />
                        <FormControlLabel
                            control={
                                <Switch 
                                    checked={showPickupPoints} 
                                    onChange={(e) => setShowPickupPoints(e.target.checked)}
                                    size="small"
                                />
                            }
                            label={
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                    <PlaceIcon fontSize="small" />
                                    <Typography variant="body2">Hiển thị điểm đón</Typography>
                                </Box>
                            }
                        />
                    </Box>

                    {/* Legend */}
                    <Accordion sx={{ mt: 2, boxShadow: 'none' }}>
                        <AccordionSummary 
                            expandIcon={<ExpandMoreIcon />}
                            sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { margin: '8px 0' } }}
                        >
                            <Typography variant="body2" fontWeight="bold">Chú thích</Typography>
                        </AccordionSummary>
                        <AccordionDetails sx={{ pt: 0 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                <Typography variant="caption" fontWeight="bold">
                                    Trạng thái xe:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, border: '2px solid #4caf50', borderRadius: '50%' }} />
                                    <Typography variant="caption">Đang chạy</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, border: '2px solid #ff9800', borderRadius: '50%' }} />
                                    <Typography variant="caption">Trễ</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 16, height: 16, border: '2px solid #f44336', borderRadius: '50%' }} />
                                    <Typography variant="caption">Sự cố</Typography>
                                </Box>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="caption" fontWeight="bold">
                                    Điểm đón:
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ 
                                        width: 20, 
                                        height: 20, 
                                        borderRadius: '50%', 
                                        bgcolor: '#4caf50',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>1</Box>
                                    <Typography variant="caption">Đã đón</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ 
                                        width: 20, 
                                        height: 20, 
                                        borderRadius: '50%', 
                                        bgcolor: '#2196f3',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>2</Box>
                                    <Typography variant="caption">Đã trả</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ 
                                        width: 20, 
                                        height: 20, 
                                        borderRadius: '50%', 
                                        bgcolor: '#ff9800',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '10px',
                                        fontWeight: 'bold'
                                    }}>3</Box>
                                    <Typography variant="caption">Chưa đón</Typography>
                                </Box>
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                </Box>

                {/* Loading / Error */}
                {loading && (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                )}

                {error && (
                    <Box sx={{ p: 2 }}>
                        <Alert severity="error">{error}</Alert>
                    </Box>
                )}

                {/* Route/Vehicle List */}
                {!loading && !error && (
                    <List sx={{ p: 0 }}>
                        {filteredVehicles.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary={
                                        viewMode === 'all' 
                                            ? "Không tìm thấy tuyến nào" 
                                            : statusFilter === 'all' 
                                                ? "Không có xe nào đang chạy" 
                                                : "Không tìm thấy xe với trạng thái này"
                                    }
                                    sx={{ textAlign: 'center', color: 'text.secondary' }}
                                />
                            </ListItem>
                        ) : (
                            filteredVehicles.map((vehicle, index) => (
                                <React.Fragment key={vehicle.vehicleId || index}>
                                    <ListItem
                                        button
                                        selected={selectedVehicle?.vehicleId === vehicle.vehicleId}
                                        onClick={() => handleFocusVehicle(vehicle)}
                                        sx={{
                                            '&:hover': { bgcolor: 'action.hover' },
                                            borderLeft: 3,
                                            borderColor: getStatusColor(vehicle.status)
                                        }}
                                    >
                                        <ListItemText
                                            primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <Typography variant="subtitle2" fontWeight="bold">
                                                        {vehicle.routeName || 'N/A'}
                                                    </Typography>
                                                    {getStatusChip(vehicle.status)}
                                                </Box>
                                            }
                                            secondary={
                                                <>
                                                    <Typography variant="body2" color="text.secondary">
                                                        🚗 {vehicle.licensePlate || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        👨‍✈️ {vehicle.driverName || 'N/A'}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        👨‍🎓 {vehicle.pickedUp || 0}/{vehicle.totalStudents || 0} học sinh
                                                    </Typography>
                                                    <Typography variant="caption" color="text.disabled">
                                                        Cập nhật: {new Date(vehicle.timestamp).toLocaleTimeString('vi-VN')}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                        <Tooltip title="Xem vị trí">
                                            <IconButton size="small" color="primary">
                                                <MyLocationIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </ListItem>
                                    {index < vehicles.length - 1 && <Divider />}
                                </React.Fragment>
                            ))
                        )}
                    </List>
                )}
            </Paper>

            {/* Map Container */}
            <Box sx={{ flex: 1, position: 'relative' }}>
                <div className='map-container' ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
            </Box>
        </Box>
    );
};

export default Map;