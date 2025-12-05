import { 
  FaBus, 
  FaUsers, 
  FaRoute, 
  FaCalendar,
  FaChartBar,
  FaClock
} from 'react-icons/fa';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import { useLanguage } from '../../Shared/LanguageContext';
import { useState, useEffect } from 'react';
import { getDashboardStats } from '../../../service/apiService';
import { toast } from 'react-toastify';

const MainPage = () => {
  const { t } = useLanguage();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setDashboardData(response.data);
    } catch (error) {
      console.error('Lỗi tải thống kê:', error);
      toast.error('Không thể tải thống kê dashboard!');
    } finally {
      setLoading(false);
    }
  };

  const stats = dashboardData ? [
    { 
      icon: <FaBus size={32} />, 
      label: t('totalBuses'), 
      value: dashboardData.totalBuses, 
      color: '#0097a7',
      bg: 'rgba(0, 151, 167, 0.1)'
    },
    { 
      icon: <FaUsers size={32} />, 
      label: t('driversLabel'), 
      value: dashboardData.totalDrivers, 
      color: '#00838f',
      bg: 'rgba(0, 131, 143, 0.1)'
    },
    { 
      icon: <FaRoute size={32} />, 
      label: t('routesLabel'), 
      value: dashboardData.totalRoutes, 
      color: '#0097a7',
      bg: 'rgba(0, 151, 167, 0.1)'
    },
    { 
      icon: <FaUsers size={32} />, 
      label: t('studentsLabel'), 
      value: dashboardData.totalStudents, 
      color: '#00838f',
      bg: 'rgba(0, 131, 143, 0.1)'
    },
    { 
      icon: <FaCalendar size={32} />, 
      label: t('schedulesLabel'), 
      value: dashboardData.totalSchedules, 
      color: '#0097a7',
      bg: 'rgba(0, 151, 167, 0.1)'
    },
    { 
      icon: <FaClock size={32} />, 
      label: t('activeToday'), 
      value: dashboardData.activeToday, 
      color: '#00838f',
      bg: 'rgba(0, 131, 143, 0.1)'
    }
  ] : [];

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)'
      }}>
        <CircularProgress sx={{ color: '#0097a7' }} />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      padding: '24px',
      height: '100%',
      overflowY: 'auto',
      background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)'
    }}>
      {/* Header */}
      <Box sx={{ 
        marginBottom: '32px',
        textAlign: 'center',
        animation: 'fadeInDown 0.6s ease'
      }}>
        <Typography 
          variant="h4" 
          sx={{ 
            color: '#0097a7',
            fontWeight: 'bold',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            marginBottom: '8px'
          }}
        >
          ❄️ {t('dashboardTitle')}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ 
            color: '#00838f',
            fontSize: '1rem'
          }}
        >
          {t('welcomeBack')}
        </Typography>
      </Box>

      {/* Statistics Grid */}
      <Grid container spacing={3} sx={{ marginBottom: '32px' }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255, 255, 255, 0.8) 100%)`,
                backdropFilter: 'blur(10px)',
                border: `2px solid ${stat.color}`,
                borderRadius: '16px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                cursor: 'pointer',
                height: '100%',
                boxShadow: `0 4px 15px ${stat.color}20`,
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: `0 12px 30px ${stat.color}40`,
                  background: `linear-gradient(135deg, ${stat.bg} 0%, rgba(255, 255, 255, 0.95) 100%)`
                },
                animation: `slideUp 0.6s ease ${index * 0.1}s both`
              }}
            >
              <CardContent sx={{ padding: '24px', textAlign: 'center' }}>
                <Box sx={{ 
                  fontSize: '40px',
                  marginBottom: '12px',
                  color: stat.color,
                  filter: 'drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))',
                  transition: 'all 0.3s ease'
                }}>
                  {stat.icon}
                </Box>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#00838f',
                    fontWeight: '600',
                    marginBottom: '8px',
                    fontSize: '0.95rem'
                  }}
                >
                  {stat.label}
                </Typography>
                <Typography 
                  variant="h5" 
                  sx={{ 
                    color: stat.color,
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    textShadow: `0 2px 4px ${stat.color}30`
                  }}
                >
                  {stat.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Activity Section */}
      <Card sx={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(0, 151, 167, 0.2)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 151, 167, 0.15)',
        animation: 'fadeInUp 0.6s ease 0.3s both',
        marginBottom: '52px'
      }}>
        <CardContent sx={{ padding: '24px' ,height: '250px'}}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: '#0097a7',
              fontWeight: 'bold',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            📊 {t('recentStats')}
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: '16px'
          }}>
            {dashboardData && [
              { 
                title: `🚌 ${t('tripsToday')}`, 
                count: `${dashboardData.todayTrips.completed + dashboardData.todayTrips.running}/${dashboardData.todayTrips.total}` 
              },
              { title: `✅ ${t('completed')}`, count: dashboardData.todayTrips.completed },
              { title: `⏳ ${t('running')}`, count: dashboardData.todayTrips.running },
              { title: `⚠️ ${t('delayed')}`, count: dashboardData.todayTrips.delayed }
            ].map((item, idx) => (
              <Box 
                key={idx}
                sx={{
                  padding: '16px',
                  background: 'rgba(0, 151, 167, 0.05)',
                  borderRadius: '12px',
                  borderLeft: `4px solid #0097a7`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(0, 151, 167, 0.1)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <Typography sx={{ color: '#00838f', fontWeight: '600', marginBottom: '4px' }}>
                  {item.title}
                </Typography>
                <Typography sx={{ color: '#0097a7', fontWeight: 'bold', fontSize: '1.4rem' }}>
                  {item.count}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </Box>
  );
}

export default MainPage;