import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { Box, Typography, Paper, Divider, Button } from '@mui/material'; // Đảm bảo Button được import
import AccessTimeIcon from '@mui/icons-material/AccessTime'; 
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Icon Quay lại

import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate } from 'react-router-dom'; // <--- IMPORT HOOK ĐIỀU HƯỚNG

// Dữ liệu mock (Giữ nguyên)
const mockFooterData = {
    driverName: "Võ Mạnh",
    routeCode: "Tuyến 1 - Sáng",
    statusText: "Đã hoàn thành",
    center: [106.660172, 10.762622], 
    zoom: 12
};

const ParentMap = (props) => {
    // Khởi tạo hook useNavigate
    const navigate = useNavigate(); 
    
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);

    // ===============================================
    // LOGIC MAPBOX GL JS (GIỮ NGUYÊN)
    // ===============================================

    useEffect(() => {
        mapboxgl.accessToken = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';
        
        mapRef.current = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/mapbox/streets-v11', 
            center: mockFooterData.center,
            zoom: mockFooterData.zoom,
            attributionControl: false
        });

        mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        
        // Cleanup function
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
            }
        };
    }, []);

    // HÀM QUAY LẠI TRANG CHỦ PHỤ HUYNH
    const handleGoBackToParent = () => {
        navigate(-1); 
    };
    

    return (
        <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            
            {/* NÚT QUAY LẠI */}
            <Button 
                variant="outlined" 
                color="primary"
                onClick={handleGoBackToParent}
                startIcon={<ArrowBackIcon />}
                sx={{ mb: 2, alignSelf: 'flex-start' }} // Căn trái, Margin bottom
            >
                Trở về
            </Button>
            
            {/* KHỐI 1: MAP CONTAINER */}
            <Box ref={mapContainerRef} sx={{ 
                flexGrow: 1, 
                width: '100%', 
                minHeight: '650px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
            }} />
            
            {/* KHỐI 2: FOOTER THÔNG TIN (Giữ nguyên) */}
            <Paper elevation={3} sx={{ 
                mt: 2, 
                p: 1.5, 
                display: 'flex', 
                justifyContent: 'space-around', 
                alignItems: 'center', 
                backgroundColor: '#185a9d', 
                color: 'white',
                borderRadius: '8px',
                minHeight: '70px'
            }}>
                
                {/* 1. TÊN TÀI XẾ */}
                <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="caption" fontWeight="bold">TÊN TÀI XẾ</Typography>
                    <Typography variant="subtitle1">{mockFooterData.driverName}</Typography>
                </Box>
                
                {/* Divider 1 */}
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.4)', mx: 2 }}/>
                
                {/* 2. TUYẾN */}
                <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="caption" fontWeight="bold">TUYẾN</Typography>
                    <Typography variant="subtitle1">{mockFooterData.routeCode}</Typography>
                </Box>
                
                {/* Divider 2 */}
                <Divider orientation="vertical" flexItem sx={{ bgcolor: 'rgba(255, 255, 255, 0.4)', mx: 2 }}/>
                
                {/* 3. THỜI GIAN DỰ KIẾN */}
                <Box sx={{ textAlign: 'center', flexGrow: 1 }}>
                    <Typography variant="caption" fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="small"/>
                        TRẠNG THÁI
                    </Typography>
                    <Typography variant="subtitle1">{mockFooterData.statusText}</Typography>
                </Box>
            </Paper>

        </Box>
    );
};

export default ParentMap;