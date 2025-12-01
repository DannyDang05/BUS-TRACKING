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
import { Warning } from '@mui/icons-material';

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
    const [scheduleStatus, setScheduleStatus] = useState('Chưa khởi hành');
    const [stats, setStats] = useState({ speed: 0, distance: 0 });

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
            if (!mapContainerRef.current) {
                console.error('❌ mapContainerRef.current is null');
                return;
            }
            
            // Kiểm tra dimensions của container
            const containerWidth = mapContainerRef.current.offsetWidth;
            const containerHeight = mapContainerRef.current.offsetHeight;
            console.log('🗺️ Initializing Parent map...', { 
                containerWidth, 
                containerHeight,
                containerDisplay: window.getComputedStyle(mapContainerRef.current).display,
                containerVisibility: window.getComputedStyle(mapContainerRef.current).visibility
            });
            
            if (containerWidth === 0 || containerHeight === 0) {
                console.error('❌ Map container has zero dimensions!');
                return;
            }
            
            mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
            
            try {
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/streets-v12',
                    center: [106.6297, 10.8231],
                    zoom: 13
                });

                mapRef.current.on('load', () => {
                    console.log('✅ Parent map loaded successfully');
                });

                mapRef.current.on('error', (e) => {
                    console.error('❌ Map error:', e);
                });

                mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
                console.log('✅ Map initialized');
            } catch (err) {
                console.error('❌ Error initializing parent map:', err);
                setError('Không thể tải bản đồ');
            }
        };

        const timeoutId = setTimeout(initMap, 100);
        return () => {
            clearTimeout(timeoutId);
            if (mapRef.current && typeof mapRef.current.remove === 'function') {
                try {
                    mapRef.current.remove();
                    mapRef.current = null;
                } catch (err) {
                    console.error('⚠️ Error removing map:', err);
                }
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

            console.log('🗺️ Parent Map - Fetching route for student:', studentId);
            
            const response = await getAllRoutesWithPoints();
            const routes = response.data || [];
            
            let studentRoute = null;
            let studentPickupPoint = null;

            // Tìm route có học sinh này
            for (const route of routes) {
                if (route.pickupPoints && route.pickupPoints.length > 0) {
                    const pickup = route.pickupPoints.find(p => 
                        String(p.MaHocSinh) === String(studentId) || String(p.studentId) === String(studentId)
                    );
                    if (pickup) {
                        studentRoute = route;
                        studentPickupPoint = pickup;
                        console.log('✅ Found route:', route.routeName, 'pickup point:', pickup.address || pickup.Address);
                        break;
                    }
                }
            }

            if (!studentRoute || !studentPickupPoint) {
                console.error('❌ Not found:', { 
                    studentRoute: !!studentRoute, 
                    studentPickupPoint: !!studentPickupPoint,
                    studentId,
                    routesCount: routes.length 
                });
                setError('Không tìm thấy tuyến xe của con bạn');
                setLoading(false);
                return;
            }

            console.log('✅ Student pickup point details:', {
                studentId,
                pickupPoint: studentPickupPoint,
                hasCoords: !!(studentPickupPoint.latitude || studentPickupPoint.Latitude),
                lat: studentPickupPoint.latitude || studentPickupPoint.Latitude,
                lng: studentPickupPoint.longitude || studentPickupPoint.Longitude
            });

            // Lấy thông tin simulation (vị trí xe real-time)
            let currentScheduleStatus = 'Chưa khởi hành';
            
            try {
                const simResponse = await getActiveSimulations();
                const simulations = simResponse.data || [];
                const currentSim = simulations.find(s => s.routeId === studentRoute.routeId);
                
                if (currentSim && currentSim.currentLatitude && currentSim.currentLongitude) {
                    studentRoute.latitude = currentSim.currentLatitude;
                    studentRoute.longitude = currentSim.currentLongitude;
                    studentRoute.speed = currentSim.speed || 0;
                    currentScheduleStatus = 'Đang chạy';
                    console.log('🚗 Active simulation found, vehicle at:', currentSim.currentLatitude, currentSim.currentLongitude);
                } else {
                    console.log('⚠️ No active simulation or no position data');
                }
            } catch (err) {
                console.log('⚠️ Error fetching simulations:', err);
            }

            setScheduleStatus(currentScheduleStatus);
            setStats({ speed: studentRoute.speed || 0, distance: 0 });

            const finalRouteData = {
                ...studentRoute,
                studentPickupPoint
            };

            console.log('📦 Setting routeData:', {
                routeId: finalRouteData.routeId,
                routeName: finalRouteData.routeName,
                hasStudentPickup: !!finalRouteData.studentPickupPoint,
                studentLat: finalRouteData.studentPickupPoint?.latitude || finalRouteData.studentPickupPoint?.Latitude,
                studentLng: finalRouteData.studentPickupPoint?.longitude || finalRouteData.studentPickupPoint?.Longitude,
                pickupPointsCount: finalRouteData.pickupPoints?.length || 0,
                vehicleLat: finalRouteData.latitude,
                vehicleLng: finalRouteData.longitude
            });

            setRouteData(finalRouteData);
            setLoading(false);
        } catch (err) {
            console.error('❌ Error fetching route data:', err);
            setError('Lỗi khi tải dữ liệu tuyến xe');
            setLoading(false);
        }
    };

    // Polling GPS location mỗi 3 giây
    useEffect(() => {
        // Initial fetch để lấy route data
        fetchRouteData();

        // Polling GPS mỗi 1 giây cho mượt hơn
        const pollInterval = setInterval(() => {
            console.log('🔄 Polling GPS update...');
            fetchRouteData();
        }, 1000);

        return () => {
            clearInterval(pollInterval);
            console.log('🛑 Stopped polling GPS updates');
        };
    }, [studentId]);

    useEffect(() => {
        console.log('🔄 routeData changed, checking if should update map:', {
            hasRouteData: !!routeData,
            hasMap: !!mapRef.current,
            mapLoaded: mapRef.current?.loaded(),
            routeName: routeData?.routeName,
            vehicleLat: routeData?.latitude,
            vehicleLng: routeData?.longitude
        });
        
        if (!routeData || !mapRef.current) {
            console.log('⏳ Waiting for map or route data...');
            return;
        }
        
        // Nếu vehicle marker đã tồn tại, chỉ update vị trí (smooth update)
        if (vehicleMarkerRef.current && routeData.latitude && routeData.longitude) {
            try {
                vehicleMarkerRef.current.setLngLat([routeData.longitude, routeData.latitude]);
                console.log('🚌 Vehicle marker updated to:', [routeData.longitude, routeData.latitude]);
            } catch (err) {
                console.warn('⚠️ Error updating vehicle marker, will redraw:', err);
                updateMapView();
            }
        } else {
            // Lần đầu hoặc marker chưa có, vẽ lại toàn bộ
            updateMapView();
        }
    }, [routeData]);

    const updateMapView = () => {
        const route = routeData;
        if (!route) {
            console.warn('⚠️ No route data for map update');
            return;
        }
        if (!mapRef.current) {
            console.warn('⚠️ Map not initialized yet, will retry');
            setTimeout(() => {
                if (routeData && mapRef.current) {
                    updateMapView();
                }
            }, 500);
            return;
        }
        
        // Wait for map to be fully loaded
        if (!mapRef.current.loaded()) {
            console.warn('⚠️ Map not loaded yet, waiting...');
            mapRef.current.once('load', () => {
                console.log('✅ Map loaded, now updating view');
                updateMapView();
            });
            return;
        }

        console.log('🎨 Updating Parent map view for route:', route.routeName);
        console.log('📊 Route data details:', {
            routeId: route.routeId,
            routeName: route.routeName,
            hasStudentPickup: !!route.studentPickupPoint,
            pickupPointsCount: route.pickupPoints?.length || 0,
            vehiclePos: route.latitude && route.longitude ? [route.latitude, route.longitude] : null
        });

        // Resize map
        try {
            mapRef.current.resize();
        } catch (err) {
            console.warn('⚠️ Error resizing map:', err);
        }

        // Xóa markers cũ
        try {
            if (vehicleMarkerRef.current) vehicleMarkerRef.current.remove();
            if (studentMarkerRef.current) studentMarkerRef.current.remove();
            pickupMarkersRef.current.forEach(m => m.remove());
            pickupMarkersRef.current = [];
        } catch (err) {
            console.warn('⚠️ Error removing markers:', err);
        }

        // Xóa route layer cũ
        try {
            if (routeLayerRef.current) {
                if (mapRef.current.getLayer(routeLayerRef.current)) {
                    mapRef.current.removeLayer(routeLayerRef.current);
                }
                if (mapRef.current.getSource(routeLayerRef.current)) {
                    mapRef.current.removeSource(routeLayerRef.current);
                }
                routeLayerRef.current = null;
            }
        } catch (err) {
            console.warn('⚠️ Error removing route layer:', err);
        }

        const studentPickup = route.studentPickupPoint;
        
        if (!studentPickup) {
            console.error('❌ No studentPickupPoint in route data!');
            console.error('Route data:', route);
            return;
        }

        const studentLat = studentPickup.latitude || studentPickup.Latitude;
        const studentLng = studentPickup.longitude || studentPickup.Longitude;

        console.log('📍 Student pickup point:', { 
            lat: studentLat, 
            lng: studentLng, 
            address: studentPickup.address || studentPickup.Address,
            rawData: studentPickup
        });

        if (!studentLat || !studentLng) {
            console.error('❌ Student pickup point missing coordinates!', studentPickup);
            return;
        }

        // VẼ ĐƯỜNG ĐI THỰC TẾ THEO MAPBOX DIRECTIONS (VẼ TRƯỚC ĐỂ MARKERS NẰM TRÊN)
        if (route.pickupPoints && route.pickupPoints.length > 1) {
            try {
                // Sắp xếp theo thứ tự
                const sortedPoints = [...route.pickupPoints].sort((a, b) => {
                    const orderA = a.STT || a.OrderIndex || a.order_index || 0;
                    const orderB = b.STT || b.OrderIndex || b.order_index || 0;
                    return orderA - orderB;
                });

                // Tạo mảng coordinates từ các điểm
                const coordinates = sortedPoints
                    .map(p => {
                        const lat = p.latitude || p.Latitude;
                        const lng = p.longitude || p.Longitude;
                        return lat && lng ? [lng, lat] : null;
                    })
                    .filter(coord => coord !== null);

                if (coordinates.length > 1) {
                    const routeLineId = 'route-line-' + route.routeId;
                    
                    // Xóa layer cũ nếu có
                    if (mapRef.current.getLayer(routeLineId)) {
                        mapRef.current.removeLayer(routeLineId);
                    }
                    if (mapRef.current.getSource(routeLineId)) {
                        mapRef.current.removeSource(routeLineId);
                    }

                    // Gọi Mapbox Directions API để lấy đường đi thực tế
                    const coordsString = coordinates.map(c => `${c[0]},${c[1]}`).join(';');
                    const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${coordsString}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
                    
                    console.log('🔍 Fetching route from Mapbox Directions API...');
                    fetch(directionsUrl)
                        .then(response => response.json())
                        .then(data => {
                            if (data.routes && data.routes.length > 0) {
                                const routeGeometry = data.routes[0].geometry;
                                
                                // Thêm source và layer với đường thực tế
                                mapRef.current.addSource(routeLineId, {
                                    type: 'geojson',
                                    data: {
                                        type: 'Feature',
                                        properties: {},
                                        geometry: routeGeometry
                                    }
                                });

                                mapRef.current.addLayer({
                                    id: routeLineId,
                                    type: 'line',
                                    source: routeLineId,
                                    layout: {
                                        'line-join': 'round',
                                        'line-cap': 'round'
                                    },
                                    paint: {
                                        'line-color': '#2196F3',
                                        'line-width': 4,
                                        'line-opacity': 0.7
                                    }
                                });

                                routeLayerRef.current = routeLineId;
                                console.log('✅ Real route line drawn via Mapbox Directions API');
                            } else {
                                console.warn('⚠️ No route returned from Directions API');
                            }
                        })
                        .catch(err => {
                            console.error('❌ Error fetching directions:', err);
                        });
                } else {
                    console.warn('⚠️ Not enough coordinates to draw route line');
                }
            } catch (err) {
                console.error('❌ Error drawing route line:', err);
            }
        }

        // VẼ ĐIỂM ĐÓN CỦA HỌC SINH (NỔI BẬT)
        if (studentLat && studentLng) {
            const studentMarkerEl = document.createElement('div');
            studentMarkerEl.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 32px;
                    box-shadow: 0 6px 20px rgba(76, 175, 80, 0.6);
                    border: 4px solid white;
                    cursor: pointer;
                    animation: pulse 2s infinite;
                    position: relative;
                ">
                    🏠
                    <div style="
                        position: absolute;
                        top: -30px;
                        background: #4CAF50;
                        color: white;
                        padding: 4px 8px;
                        border-radius: 4px;
                        font-size: 12px;
                        white-space: nowrap;
                        font-weight: bold;
                    ">Điểm đón</div>
                </div>
            `;

            studentMarkerRef.current = new mapboxgl.Marker({ element: studentMarkerEl })
                .setLngLat([studentLng, studentLat])
                .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`
                    <div style="padding: 12px;">
                        <strong style="color: #4CAF50; font-size: 16px;">📍 Điểm đón của con bạn</strong><br/>
                        <small style="color: #666;">${studentPickup.address || studentPickup.Address || 'Không có địa chỉ'}</small>
                    </div>
                `))
                .addTo(mapRef.current);
            console.log('✅ Student marker added at:', [studentLng, studentLat]);
        } else {
            console.warn('⚠️ No student coordinates, marker not added');
        }

        // VẼ XE BUS
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
            vehicleMarkerEl.innerHTML = `
                <div style="
                    background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
                    width: 55px;
                    height: 55px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 28px;
                    box-shadow: 0 4px 16px rgba(33, 150, 243, 0.6);
                    border: 3px solid white;
                    cursor: pointer;
                ">
                    🚌
                </div>
            `;

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
            console.log('✅ Vehicle marker added at:', [vehicleLng, vehicleLat]);
        } else {
            console.log('⚠️ No vehicle position, marker not added');
        }

        // VẼ CÁC ĐIỂM ĐÓN KHÁC (NHỎ HƠN)
        if (route.pickupPoints && route.pickupPoints.length > 0) {
            console.log('📍 Drawing other pickup points, total:', route.pickupPoints.length);
            console.log('📍 All pickup points:', route.pickupPoints.map(p => ({
                id: p.Id || p.id,
                studentId: p.MaHocSinh || p.studentId,
                lat: p.latitude || p.Latitude,
                lng: p.longitude || p.Longitude,
                address: p.address || p.Address
            })));
            
            route.pickupPoints.forEach((point, index) => {
                const lat = point.latitude || point.Latitude;
                const lng = point.longitude || point.Longitude;
                
                console.log(`  📌 Point ${index}:`, {
                    id: point.Id || point.id,
                    studentId: point.MaHocSinh || point.studentId,
                    lat,
                    lng,
                    hasCoords: !!(lat && lng)
                });
                
                // Bỏ qua điểm đón của học sinh này (đã vẽ rồi)
                const isStudentPoint = String(point.MaHocSinh) === String(studentId) || String(point.studentId) === String(studentId);
                if (isStudentPoint) {
                    console.log(`  ⏭️ Skipping student point ${index} (already drawn as main point)`);
                    return;
                }

                // Điểm trường (không có MaHocSinh)
                const isSchoolPoint = !point.MaHocSinh && !point.studentId;

                if (lat && lng) {
                    console.log(`  ✅ Adding marker ${index}:`, { isSchoolPoint, isStudentPoint, lat, lng });
                    const markerEl = document.createElement('div');
                    
                    if (isSchoolPoint) {
                        // Marker cho điểm trường
                        markerEl.innerHTML = `
                            <div style="
                                width: 50px;
                                height: 50px;
                                background: linear-gradient(135deg, #FF5722 0%, #E64A19 100%);
                                border: 3px solid white;
                                border-radius: 50%;
                                box-shadow: 0 4px 12px rgba(255, 87, 34, 0.5);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 24px;
                                cursor: pointer;
                            ">
                                🏫
                            </div>
                        `;
                        
                        const marker = new mapboxgl.Marker({ element: markerEl })
                            .setLngLat([lng, lat])
                            .setPopup(new mapboxgl.Popup({ offset: 20 }).setHTML(`
                                <div style="padding: 8px;">
                                    <strong style="color: #FF5722; font-size: 14px;">🏫 Trường học</strong><br/>
                                    <small style="color: #666;">${point.address || point.Address || 'Không có địa chỉ'}</small>
                                </div>
                            `))
                            .addTo(mapRef.current);
                        
                        pickupMarkersRef.current.push(marker);
                    } else {
                        // Marker cho học sinh khác
                        markerEl.innerHTML = `
                            <div style="
                                width: 35px;
                                height: 35px;
                                background: #FFA726;
                                border: 2px solid white;
                                border-radius: 50%;
                                box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 18px;
                                cursor: pointer;
                            ">
                                👦
                            </div>
                        `;

                        const marker = new mapboxgl.Marker({ element: markerEl })
                            .setLngLat([lng, lat])
                            .setPopup(new mapboxgl.Popup({ offset: 15 }).setHTML(`
                                <div style="padding: 6px;">
                                    <strong>Học sinh khác</strong><br/>
                                    <small>${point.address || point.Address || ''}</small>
                                </div>
                            `))
                            .addTo(mapRef.current);
                        
                        pickupMarkersRef.current.push(marker);
                    }
                } else {
                    console.warn(`  ⚠️ Point ${index} missing coordinates:`, point);
                }
            });
            console.log(`✅ Total markers added: ${pickupMarkersRef.current.length}`);
        } else {
            console.warn('⚠️ No pickup points to draw!');
        }

        // FIT BOUNDS
        const bounds = new mapboxgl.LngLatBounds();
        let pointsAdded = 0;
        
        if (vehicleLat && vehicleLng) {
            bounds.extend([vehicleLng, vehicleLat]);
            pointsAdded++;
            console.log('  🚌 Added vehicle to bounds:', [vehicleLng, vehicleLat]);
        }
        if (studentLat && studentLng) {
            bounds.extend([studentLng, studentLat]);
            pointsAdded++;
            console.log('  🏠 Added student point to bounds:', [studentLng, studentLat]);
        }
        
        // Thêm các điểm khác vào bounds
        if (route.pickupPoints && route.pickupPoints.length > 0) {
            route.pickupPoints.forEach(point => {
                const lat = point.latitude || point.Latitude;
                const lng = point.longitude || point.Longitude;
                if (lat && lng) {
                    bounds.extend([lng, lat]);
                    pointsAdded++;
                }
            });
        }
        
        console.log(`📏 Total points for bounds: ${pointsAdded}`);
        
        if (!bounds.isEmpty()) {
            console.log('🗺️ Fitting bounds:', { 
                ne: bounds.getNorthEast(), 
                sw: bounds.getSouthWest() 
            });
            mapRef.current.fitBounds(bounds, { padding: 100, maxZoom: 14, duration: 1000 });
        } else if (studentLat && studentLng) {
            // Nếu không có bounds nhưng có điểm học sinh, center vào đó
            console.log('🎯 Centering on student pickup point');
            mapRef.current.setCenter([studentLng, studentLat]);
            mapRef.current.setZoom(15);
        } else {
            console.log('⚠️ No valid coordinates, using default center (TP.HCM)');
            mapRef.current.setCenter([106.6297, 10.8231]);
            mapRef.current.setZoom(13);
        }
        
        console.log('✅ Map view update completed');
    };

    const handleRecenter = () => {
        if (!routeData || !mapRef.current) return;
        const studentPickup = routeData.studentPickupPoint;
        const lat = studentPickup.latitude || studentPickup.Latitude;
        const lng = studentPickup.longitude || studentPickup.Longitude;
        if (lat && lng) {
            mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
        }
    };

    const getStatusColor = () => {
        return scheduleStatus === 'Đang chạy' ? '#4CAF50' : '#9E9E9E';
    };

    const getStatusText = () => {
        return scheduleStatus === 'Đang chạy' ? '🚌 Xe đang trên đường' : '📅 Xe chưa khởi hành';
    };

    const handleGoBackToParent = () => {
        navigate(-1); 
    };
    

    return (
        <Box sx={{ 
            width: '100%', 
            height: '100vh', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: 2, 
            p: 2,
            boxSizing: 'border-box',
            overflow: 'hidden'
        }}>
            {/* Back Button */}
            <Button 
                variant="outlined" 
                color="primary"
                onClick={handleGoBackToParent}
                startIcon={<ArrowBackIcon />}
                sx={{ alignSelf: 'flex-start', flexShrink: 0 }}
            >
                Trở về
            </Button>

            {/* Status Card */}
            {routeData && (
                <Card sx={{ 
                    background: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
                    boxShadow: '0 4px 12px rgba(33, 150, 243, 0.2)',
                    flexShrink: 0
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
                            
                            {stats.speed > 0 && (
                                <Chip 
                                    icon={<SpeedIcon />}
                                    label={`${stats.speed} km/h`}
                                    variant="outlined"
                                    color="primary"
                                />
                            )}
                        </Stack>
                        <Typography variant="body2" sx={{ mt: 1, color: '#546E7A' }}>
                            Tuyến: <strong>{routeData.routeName}</strong> | 
                            Biển số: <strong>{routeData.vehicleNumber || 'N/A'}</strong>
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5, color: '#4CAF50', fontWeight: 'bold' }}>
                            📍 Điểm đón: {routeData.studentPickupPoint?.address || routeData.studentPickupPoint?.Address || 'N/A'}
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
                    minHeight: 0
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
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ fontSize: '20px' }}>🏫</Box>
                            <Typography variant="caption">Trường học</Typography>
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