import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
    Box,
    Paper,
    Typography,
    IconButton,
    Tooltip,
    CircularProgress,
    Alert,
    Chip,
    Stack
} from '@mui/material';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import RefreshIcon from '@mui/icons-material/Refresh';
import RouteIcon from '@mui/icons-material/Route';
import PlaceIcon from '@mui/icons-material/Place';
import DirectionsBusIcon from '@mui/icons-material/DirectionsBus';
import { getAllRoutesWithPoints, getActiveSimulations, getScheduleStudents } from '../../service/apiService';

const DriverMap = ({ scheduleId, routeId }) => {
    const mapRef = useRef();
    const mapContainerRef = useRef();
    const vehicleMarkerRef = useRef();
    const pickupMarkersRef = useRef([]);
    const isInitializedRef = useRef(false);
    const routeLayerRef = useRef(null);

    const [routeData, setRouteData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ 
        pickedUp: 0, 
        total: 0, 
        speed: 0,
        distance: 0 
    });

    // Initialize map
    useEffect(() => {
        // Wait for container to be fully rendered
        const initMap = () => {
            if (!mapContainerRef.current) {
                console.error('❌ mapContainerRef.current is null');
                return;
            }
            
            console.log('🗺️ Initializing map...');
            mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
            
            try {
                // Trường Đại học Sài Gòn: 10.8231° N, 106.6297° E
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231], // Trường ĐH Sài Gòn
                    zoom: 13
                });

                mapRef.current.on('load', () => {
                    console.log('✅ Map loaded successfully');
                });

                // Add navigation controls
                mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
                console.log('✅ Map initialized');
            } catch (err) {
                console.error('❌ Error initializing map:', err);
            }
        };

        // Small delay to ensure DOM is ready
        const timeoutId = setTimeout(initMap, 100);

        return () => {
            clearTimeout(timeoutId);
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    // Fetch route data with realtime simulation position
    const fetchRouteData = async () => {
        try {
            console.log('🗺️ Fetching route data for scheduleId:', scheduleId, 'routeId:', routeId);
            
            // QUAN TRỌNG: Lấy pickup points từ schedule (có trạng thái đúng)
            const scheduleResponse = await getScheduleStudents(scheduleId);
            const pickupPoints = (scheduleResponse.data || []).map(p => ({
                pickupPointId: p.pickupPointId,
                Id: p.pickupPointId,
                MaHocSinh: p.studentId,
                PointOrder: p.PointOrder,
                address: p.pickupAddress,
                Latitude: p.Latitude,
                Longitude: p.Longitude,
                latitude: p.Latitude,
                longitude: p.Longitude,
                TinhTrangDon: p.status,
                status: p.status,
                studentName: p.studentName,
                class: p.studentClass,
                studentId: p.studentId
            }));
            
            console.log('📍 Pickup points from schedule:', pickupPoints.length, pickupPoints);
            
            // Lấy thông tin route cơ bản
            const response = await getAllRoutesWithPoints();
            const routes = response.data || [];
            
            let currentRoute = routes.find(r => r.routeId === routeId);
            
            if (currentRoute) {
                console.log('✅ Found route:', currentRoute.routeName);
                
                // Ghi đè pickup points với dữ liệu từ schedule (có trạng thái đúng)
                currentRoute.pickupPoints = pickupPoints;
                
                // Tính lại số lượng đã đón/trả từ schedule_pickup_status
                currentRoute.pickedUp = pickupPoints.filter(p => p.status === 'Đã đón' && p.MaHocSinh).length;
                currentRoute.droppedOff = pickupPoints.filter(p => p.status === 'Đã trả' && p.MaHocSinh).length;
                currentRoute.totalStudents = pickupPoints.filter(p => p.MaHocSinh).length;
                
                console.log('📊 Stats from schedule:', {
                    total: currentRoute.totalStudents,
                    pickedUp: currentRoute.pickedUp,
                    droppedOff: currentRoute.droppedOff
                });
                
                // Try to get realtime position from active simulation
                try {
                    const simResponse = await getActiveSimulations();
                    const activeSimulations = simResponse.data || [];
                    console.log('🚀 Active simulations:', activeSimulations.length);
                    
                    // Find simulation for this schedule
                    const simulation = activeSimulations.find(s => 
                        s.scheduleId === parseInt(scheduleId) || 
                        s.routeId === routeId
                    );
                    
                    if (simulation && simulation.currentLatitude && simulation.currentLongitude) {
                        console.log('🎯 Found active simulation with position:', simulation.currentLatitude, simulation.currentLongitude);
                        // Update route with realtime position
                        currentRoute = {
                            ...currentRoute,
                            latitude: simulation.currentLatitude,
                            longitude: simulation.currentLongitude,
                            speed: simulation.speed || 0
                        };
                    } else {
                        console.log('⚠️ No active simulation or no position data');
                    }
                } catch (simErr) {
                    console.warn('⚠️ Could not fetch active simulations:', simErr.message);
                }
                
                console.log('📊 Final route data:', currentRoute);
                setRouteData(currentRoute);
                setStats({
                    pickedUp: currentRoute.pickedUp || 0,
                    total: currentRoute.totalStudents || 0,
                    speed: currentRoute.speed || 0,
                    distance: 0
                });
                
                // Update map markers and route
                if (mapRef.current) {
                    // First time: draw everything
                    if (!isInitializedRef.current) {
                        updateMapView(currentRoute);
                        isInitializedRef.current = true;
                    } else {
                        // Subsequent updates: only update vehicle position
                        updateVehiclePosition(currentRoute);
                    }
                } else {
                    console.warn('⚠️ Map not ready, will retry on next fetch');
                }
                setError(null);
            } else {
                console.warn('⚠️ Route not found. Available routes:', routes.map(r => ({ id: r.routeId, name: r.routeName })));
                setError(`Không tìm thấy tuyến đường (ID: ${routeId})`);
            }
        } catch (err) {
            console.error('❌ Error fetching route data:', err);
            setError('Không thể tải dữ liệu tuyến đường: ' + (err.message || 'Lỗi không xác định'));
        } finally {
            setLoading(false);
        }
    };

    // Update vehicle position only (for smooth updates)
    const updateVehiclePosition = (route) => {
        if (!mapRef.current || !mapContainerRef.current) {
            console.warn('⚠️ Map or container not ready');
            return;
        }

        const vehicleLat = route.latitude;
        const vehicleLng = route.longitude;

        if (vehicleLat && vehicleLng && vehicleMarkerRef.current) {
            const currentLngLat = vehicleMarkerRef.current.getLngLat();
            const newLngLat = [vehicleLng, vehicleLat];
            
            if (currentLngLat.lng !== newLngLat[0] || currentLngLat.lat !== newLngLat[1]) {
                vehicleMarkerRef.current.setLngLat(newLngLat);
                console.log(`🚗 Vehicle moved to: [${vehicleLat}, ${vehicleLng}]`);
            }
        }

        // Update pickup point markers if status changed
        updatePickupPointsStatus(route.pickupPoints || []);

        // Update stats
        setStats({
            pickedUp: route.pickedUp || 0,
            total: route.totalStudents || 0,
            speed: route.speed || 0,
            distance: 0
        });
    };

    // Update map view
    const updateMapView = (route) => {
        if (!mapRef.current || !mapContainerRef.current) {
            console.warn('⚠️ Map or container not ready, skipping update');
            return;
        }
        if (!route) {
            console.warn('⚠️ No route data, skipping update');
            return;
        }

        console.log('🎨 Updating map view for route:', route.routeName);
        console.log('📊 Route pickup points:', route.pickupPoints?.length || 0);

        // Get current vehicle position
        let vehicleLat = route.latitude;
        let vehicleLng = route.longitude;
        
        // Nếu không có vị trí vehicle (chưa có tracking), dùng điểm xuất phát (trường)
        if (!vehicleLat || !vehicleLng) {
            if (route.pickupPoints && route.pickupPoints.length > 0) {
                // Điểm đầu tiên là trường (MaHocSinh = null)
                const schoolPoint = route.pickupPoints.find(p => !p.MaHocSinh && !p.studentId);
                if (schoolPoint) {
                    vehicleLat = schoolPoint.latitude || schoolPoint.Latitude;
                    vehicleLng = schoolPoint.longitude || schoolPoint.Longitude;
                    console.log('🏫 Using school point as vehicle position:', vehicleLat, vehicleLng);
                }
            }
        }
        
        // Find center point for map (use vehicle position or first pickup point)
        let centerLat = vehicleLat;
        let centerLng = vehicleLng;

        // If no vehicle position, use first pickup point for centering
        if (!centerLat || !centerLng) {
            if (route.pickupPoints && route.pickupPoints.length > 0) {
                const firstPoint = route.pickupPoints[0];
                centerLat = firstPoint.latitude || firstPoint.Latitude;
                centerLng = firstPoint.longitude || firstPoint.Longitude;
                console.log('📍 Using first pickup point as center:', centerLat, centerLng);
            }
        }

        // Update or create vehicle marker (only if vehicle has position)
        if (vehicleLat && vehicleLng) {
            if (vehicleMarkerRef.current) {
                vehicleMarkerRef.current.setLngLat([vehicleLng, vehicleLat]);
                console.log(`🚗 Vehicle positioned at: [${vehicleLat}, ${vehicleLng}]`);
            } else {
                // Create vehicle marker
                const el = document.createElement('div');
                el.innerHTML = `
                    <div style="
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                        width: 50px;
                        height: 50px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        color: white;
                        font-size: 24px;
                        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
                        border: 3px solid white;
                        cursor: pointer;
                        transition: transform 0.3s ease;
                    ">
                        🚌
                    </div>
                `;

                const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="padding: 12px; min-width: 220px;">
                        <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #667eea;">
                            <strong>${route.routeName || 'Tuyến của bạn'}</strong>
                        </h3>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Biển số:</strong> ${route.licensePlate || 'N/A'}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Trạng thái:</strong> ${route.status || 'N/A'}</p>
                        <p style="margin: 5px 0; font-size: 13px;"><strong>Học sinh:</strong> ${route.pickedUp || 0}/${route.totalStudents || 0}</p>
                        ${route.speed ? `<p style="margin: 5px 0; font-size: 13px;"><strong>Tốc độ:</strong> ${route.speed} km/h</p>` : ''}
                    </div>
                `);

                vehicleMarkerRef.current = new mapboxgl.Marker(el)
                    .setLngLat([vehicleLng, vehicleLat])
                    .setPopup(popup)
                    .addTo(mapRef.current);

                el.querySelector('div').addEventListener('mouseenter', () => {
                    el.querySelector('div').style.transform = 'scale(1.1)';
                });
                el.querySelector('div').addEventListener('mouseleave', () => {
                    el.querySelector('div').style.transform = 'scale(1)';
                });
            }
        } else {
            console.log('⚠️ Vehicle position not available, will only show pickup points');
        }

        // Draw pickup points and route (only called once due to isInitialized flag)
        console.log('📍 Drawing pickup points:', route.pickupPoints?.length || 0);
        drawPickupPoints(route.pickupPoints || []);

        // Draw route polyline
        if (route.pickupPoints && route.pickupPoints.length > 0) {
            console.log('🛣️ Drawing route polyline');
            drawRoutePolyline(route);
        }

        // Center map on first load
        if (centerLat && centerLng) {
            console.log('🎯 Centering map at:', centerLat, centerLng);
            mapRef.current.flyTo({
                center: [centerLng, centerLat],
                zoom: 14,
                duration: 1500
            });
        }
    };

    // Update pickup points status (without redrawing all markers)
    const updatePickupPointsStatus = (newPoints) => {
        if (!newPoints || newPoints.length === 0) return;
        if (pickupMarkersRef.current.length === 0) return;

        // Compare and update only changed pickup points
        newPoints.forEach((point) => {
            const pointId = point.pickupPointId || point.Id || point.id;
            const status = point.TinhTrangDon || point.status || 'Chưa đón';
            
            // Find existing marker for this point
            const existingMarker = pickupMarkersRef.current.find(m => m._pointId === pointId);
            
            if (existingMarker && existingMarker._status !== status) {
                // Status changed - update marker color
                let bgColor = '#ff9800'; // Chưa đón
                if (status === 'Đã đón') bgColor = '#4caf50';
                if (status === 'Đã trả') bgColor = '#2196f3';
                if (status === 'Vắng mặt') bgColor = '#f44336';

                const markerElement = existingMarker.getElement();
                const markerDiv = markerElement.querySelector('div');
                if (markerDiv) {
                    markerDiv.style.background = bgColor;
                }
                
                existingMarker._status = status;
                console.log(`📍 Updated pickup point ${pointId} status to: ${status}`);
            }
        });
    };

    // Draw pickup points
    const drawPickupPoints = (points) => {
        // Remove old markers
        pickupMarkersRef.current.forEach(marker => marker.remove());
        pickupMarkersRef.current = [];

        if (!points || points.length === 0) return;

        const sortedPoints = points.sort((a, b) => 
            (a.PointOrder || 0) - (b.PointOrder || 0)
        );

        sortedPoints.forEach((point, index) => {
            const status = point.TinhTrangDon || point.status || 'Chưa đón';
            const longitude = point.Longitude || point.longitude;
            const latitude = point.Latitude || point.latitude;
            const order = point.PointOrder || (index + 1);
            const isSchool = !point.MaHocSinh; // Điểm trường không có MaHocSinh
            
            if (!longitude || !latitude) return;

            const el = document.createElement('div');
            
            if (isSchool) {
                // Marker trường: 🏫
                el.innerHTML = `
                    <div style="
                        background-color: #f44336;
                        color: white;
                        width: 40px;
                        height: 40px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-size: 20px;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
                        cursor: pointer;
                    ">
                        🏫
                    </div>
                `;
            } else {
                // Determine color based on status
                let bgColor = '#ff9800'; // Chưa đón
                if (status === 'Đã đón') bgColor = '#4caf50';
                if (status === 'Đã trả') bgColor = '#2196f3';
                if (status === 'Vắng mặt') bgColor = '#f44336';

                el.innerHTML = `
                    <div style="
                        background-color: ${bgColor};
                        color: white;
                        width: 36px;
                        height: 36px;
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        font-weight: bold;
                        font-size: 14px;
                        border: 3px solid white;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                        cursor: pointer;
                        transition: transform 0.2s;
                    ">
                        ${order}
                    </div>
                `;
            }

            const popupContent = isSchool 
                ? `<div style="padding: 10px; min-width: 220px; background: linear-gradient(135deg, #f44336 0%, #e91e63 100%); border-radius: 8px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 16px; color: white; font-weight: bold; text-align: center;">
                        🏫 ${status === 'Xuất phát' ? 'ĐIỂM XUẤT PHÁT' : 'ĐIỂM VỀ'}
                    </h4>
                    <p style="margin: 4px 0; font-size: 14px; color: white; font-weight: bold; text-align: center;">Trường ĐH Sài Gòn, Quận 5</p>
                    <p style="margin: 4px 0; font-size: 11px; color: #ffebee; text-align: center;">${point.DiaChi || point.address || 'Điểm tập trung'}</p>
                </div>`
                : `<div style="padding: 10px; min-width: 200px;">
                    <h4 style="margin: 0 0 8px 0; font-size: 14px; color: #667eea;">
                        Điểm ${order}: ${status}
                    </h4>
                    <p style="margin: 4px 0; font-size: 12px;"><strong>Địa chỉ:</strong> ${point.DiaChi || point.address || 'N/A'}</p>
                    ${point.studentName ? `<p style="margin: 4px 0; font-size: 12px;"><strong>Học sinh:</strong> ${point.studentName}</p>` : ''}
                </div>`;

            const popup = new mapboxgl.Popup({ offset: 20 }).setHTML(popupContent);

            const marker = new mapboxgl.Marker(el)
                .setLngLat([longitude, latitude])
                .setPopup(popup)
                .addTo(mapRef.current);

            // Store point ID and status for tracking changes
            marker._pointId = point.pickupPointId || point.Id || point.id;
            marker._status = status;

            el.querySelector('div').addEventListener('mouseenter', () => {
                el.querySelector('div').style.transform = 'scale(1.15)';
            });
            el.querySelector('div').addEventListener('mouseleave', () => {
                el.querySelector('div').style.transform = 'scale(1)';
            });

            pickupMarkersRef.current.push(marker);
        });
    };

    // Draw route polyline
    const drawRoutePolyline = async (route) => {
        if (!mapRef.current || !route.routeId) return;

        const sourceId = `driver-route-${route.routeId}`;
        const layerId = `driver-route-layer-${route.routeId}`;

        // Remove existing layer
        if (mapRef.current.getLayer(layerId)) {
            mapRef.current.removeLayer(layerId);
        }
        if (mapRef.current.getSource(sourceId)) {
            mapRef.current.removeSource(sourceId);
        }

        const points = route.pickupPoints || [];
        if (points.length === 0) return;

        // Sắp xếp điểm theo PointOrder (bao gồm cả điểm trường từ backend)
        const sortedPoints = points.sort((a, b) => 
            (a.PointOrder || 0) - (b.PointOrder || 0)
        );
        
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
            const lineColor = '#667eea';
            const lineWidth = 5;

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
                
                console.log(`🚗 Fetching route for chunk ${i + 1}/${chunks.length} (${chunk.length} points)`);
                
                const response = await fetch(directionsUrl);
                const data = await response.json();
                
                if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
                    const chunkCoords = data.routes[0].geometry.coordinates;
                    allCoordinates = allCoordinates.concat(chunkCoords);
                    console.log(`✅ Got ${chunkCoords.length} coordinates for chunk ${i + 1}`);
                } else {
                    console.warn(`⚠️ Failed to get route for chunk ${i + 1}, using straight lines`);
                    allCoordinates = allCoordinates.concat(chunk);
                }
            }

            // Create combined route geometry
            const routeGeometry = {
                type: 'LineString',
                coordinates: allCoordinates.length > 0 ? allCoordinates : waypoints
            };

            console.log(`✅ Total route coordinates: ${routeGeometry.coordinates.length}`);

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
                    'line-color': lineColor,
                    'line-width': lineWidth,
                    'line-opacity': 0.8
                }
            });

            routeLayerRef.current = { sourceId, layerId };

            // Fit bounds
            const coords = routeGeometry.coordinates;
            const bounds = coords.reduce((bounds, coord) => {
                return bounds.extend(coord);
            }, new mapboxgl.LngLatBounds(coords[0], coords[0]));

            mapRef.current.fitBounds(bounds, {
                padding: 80,
                duration: 1000
            });
        } catch (error) {
            console.error('Error drawing route:', error);
        }
    };

    // Auto refresh
    useEffect(() => {
        if (routeId) {
            fetchRouteData();
            
            const interval = setInterval(() => {
                fetchRouteData();
            }, 5000); // Refresh every 5 seconds (slower polling)

            return () => clearInterval(interval);
        }
    }, [routeId]);

    // Recenter on vehicle
    const handleRecenter = () => {
        if (routeData && routeData.latitude && routeData.longitude) {
            mapRef.current.flyTo({
                center: [routeData.longitude, routeData.latitude],
                zoom: 15,
                duration: 1500
            });
        }
    };

    if (loading && !routeData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                <CircularProgress sx={{ color: '#667eea' }} />
            </Box>
        );
    }

    return (
        <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
            {/* Loading Overlay */}
            {loading && (
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        zIndex: 1000,
                        borderRadius: '12px'
                    }}
                >
                    <CircularProgress size={60} sx={{ color: '#667eea' }} />
                    <Typography variant="h6" sx={{ mt: 2, color: '#667eea' }}>
                        Đang tải bản đồ...
                    </Typography>
                </Box>
            )}

            {/* Map Container */}
            <div 
                ref={mapContainerRef}
                style={{ 
                    width: '100%', 
                    height: '100%',
                    borderRadius: '12px',
                    overflow: 'hidden'
                }} 
            />

            {/* Stats Overlay */}
            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    top: 16,
                    left: 16,
                    p: 2,
                    minWidth: 220,
                    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
                    color: 'white',
                    borderRadius: 3,
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Stack spacing={1.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <DirectionsBusIcon />
                        <Typography variant="h6" fontWeight="bold">
                            {routeData?.routeName || 'Tuyến của bạn'}
                        </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Học sinh</Typography>
                        <Chip 
                            label={`${stats.pickedUp}/${stats.total}`}
                            size="small"
                            sx={{ 
                                bgcolor: 'rgba(255,255,255,0.3)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Box>

                    {stats.speed > 0 && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body2">Tốc độ</Typography>
                            <Chip 
                                label={`${stats.speed} km/h`}
                                size="small"
                                sx={{ 
                                    bgcolor: 'rgba(255,255,255,0.3)',
                                    color: 'white',
                                    fontWeight: 'bold'
                                }}
                            />
                        </Box>
                    )}

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2">Trạng thái</Typography>
                        <Chip 
                            label={routeData?.status || 'N/A'}
                            size="small"
                            sx={{ 
                                bgcolor: routeData?.status === 'Đang chạy' 
                                    ? 'rgba(76, 175, 80, 0.9)' 
                                    : 'rgba(255,255,255,0.3)',
                                color: 'white',
                                fontWeight: 'bold'
                            }}
                        />
                    </Box>
                </Stack>
            </Paper>

            {/* Control Buttons */}
            <Paper
                elevation={3}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    p: 1,
                    borderRadius: 2
                }}
            >
                <Tooltip title="Về vị trí xe" placement="left">
                    <IconButton 
                        onClick={handleRecenter}
                        sx={{ 
                            bgcolor: '#667eea',
                            color: 'white',
                            '&:hover': { bgcolor: '#764ba2' }
                        }}
                    >
                        <MyLocationIcon />
                    </IconButton>
                </Tooltip>
                
                <Tooltip title="Làm mới" placement="left">
                    <IconButton 
                        onClick={fetchRouteData}
                        sx={{ 
                            bgcolor: '#667eea',
                            color: 'white',
                            '&:hover': { bgcolor: '#764ba2' }
                        }}
                    >
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Paper>

            {/* Error Alert */}
            {error && (
                <Alert 
                    severity="error" 
                    sx={{ 
                        position: 'absolute',
                        bottom: 16,
                        left: 16,
                        maxWidth: 300
                    }}
                >
                    {error}
                </Alert>
            )}

            {/* Legend */}
            <Paper
                elevation={2}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)'
                }}
            >
                <Typography variant="caption" fontWeight="bold" display="block" gutterBottom>
                    Chú thích:
                </Typography>
                <Stack spacing={0.5}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#4caf50' }} />
                        <Typography variant="caption">Đã đón</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#2196f3' }} />
                        <Typography variant="caption">Đã trả</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: '#ff9800' }} />
                        <Typography variant="caption">Chưa đón</Typography>
                    </Box>
                </Stack>
            </Paper>
        </Box>
    );
};

export default DriverMap;
