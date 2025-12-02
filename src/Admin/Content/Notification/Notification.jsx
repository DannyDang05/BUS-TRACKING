import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../Shared/LanguageContext';
import TableNotification from './TableNotification';
import { Box, Card, Typography, Button, Grid } from '@mui/material';
import { Add as AddIcon, Notifications as NotificationsIcon, MarkEmailRead as ReadIcon } from '@mui/icons-material';
import { getAllNotifications } from '../../../service/apiService';

const Notification = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    const [stats, setStats] = useState({
        total: 0,
        today: 0,
        unread: 0
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const res = await getAllNotifications('', 1, 1000);
            const notifications = res?.data || [];
            const today = new Date().toISOString().split('T')[0];
            
            setStats({
                total: notifications.length,
                today: notifications.filter(n => n.ThoiGian?.startsWith(today)).length,
                unread: notifications.filter(n => n.TrangThai === 'Chưa đọc').length
            });
        } catch (err) {
            console.error('Error loading stats:', err);
        }
    };

    const handleClickBtnCreateNotification = () => {
        navigate("/notifications/create-notification")
    }

    return (
        <Box className="page-body" sx={{ background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)', minHeight: '100vh' }}>
            {/* Header Card */}
            <Card sx={{ 
                mb: 3,
                background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                color: 'white',
                boxShadow: '0 4px 20px rgba(0,151,167,0.3)'
            }}>
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <NotificationsIcon sx={{ fontSize: 40 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Quản Lý Thông Báo
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleClickBtnCreateNotification}
                            sx={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    background: 'rgba(255,255,255,0.3)',
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                                },
                                transition: 'all 0.3s ease',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                px: 3
                            }}
                        >
                            Tạo Thông Báo
                        </Button>
                    </Box>

                    {/* Stats */}
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                p: 2,
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {stats.total}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    📢 Tổng Thông Báo
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                p: 2,
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {stats.today}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    🕐 Hôm Nay
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{
                                background: 'rgba(255,255,255,0.15)',
                                backdropFilter: 'blur(10px)',
                                borderRadius: '12px',
                                p: 2,
                                textAlign: 'center',
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                                    {stats.unread}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }}>
                                    ✉️ Chưa Đọc
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Card>

            {/* Table Card */}
            <Card sx={{ 
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                borderRadius: '16px',
                overflow: 'hidden'
            }}>
                <TableNotification onUpdate={loadStats} />
            </Card>
        </Box>
    )
}

export default Notification;
