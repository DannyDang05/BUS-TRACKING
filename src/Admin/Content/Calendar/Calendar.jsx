import { 
  Button, 
  Typography,
  Box,
  Card,
  IconButton,
  Chip
} from "@mui/material"
import { FaCalendar, FaChevronLeft, FaChevronRight, FaBus, FaUserTie } from "react-icons/fa";
import { useLanguage } from '../../Shared/LanguageContext';
import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { getAllRoutes, getAllSchedules, createSchedule } from '../../../service/apiService';
import { toast } from 'react-toastify';
import AssignRouteDriverModal from './AssignRouteDriverModal';

const Calendar = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();
    
    // State quản lý tuần hiện tại
    const [currentWeekStart, setCurrentWeekStart] = useState(getMonday(new Date()));
    const [routes, setRoutes] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(false);
    const [assignModalOpen, setAssignModalOpen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    
    // Lấy thứ 2 của tuần
    function getMonday(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Điều chỉnh nếu là Chủ nhật
        return new Date(d.setDate(diff));
    }
    
    // Tạo mảng 7 ngày trong tuần
    const getWeekDays = () => {
        const days = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(currentWeekStart);
            date.setDate(currentWeekStart.getDate() + i);
            days.push(date);
        }
        return days;
    };
    
    const weekDays = getWeekDays();
    const daysOfWeek = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
    
    // Chuyển tuần trước/sau
    const goToPreviousWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentWeekStart(newDate);
    };
    
    const goToNextWeek = () => {
        const newDate = new Date(currentWeekStart);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentWeekStart(newDate);
    };
    
    const goToToday = () => {
        setCurrentWeekStart(getMonday(new Date()));
    };
    
    // Load routes và schedules
    useEffect(() => {
        fetchData();
    }, [currentWeekStart]);
    
    const fetchData = async () => {
        setLoading(true);
        try {
            const [routesRes, schedulesRes] = await Promise.all([
                getAllRoutes('', 1, 1000),
                getAllSchedules('', 1, 1000)
            ]);
            console.log('Routes:', routesRes?.data);
            console.log('Schedules:', schedulesRes?.data);
            setRoutes(routesRes?.data || []);
            setSchedules(schedulesRes?.data || []);
        } catch (err) {
            console.error('Lấy data lỗi', err);
            toast.error('Không thể tải dữ liệu!');
        } finally {
            setLoading(false);
        }
    };
    
    const handleOpenAssignModal = (route, date, e) => {
        if (e) e.stopPropagation();
        setSelectedRoute(route);
        setSelectedDate(date);
        setAssignModalOpen(true);
    };
    
    const handleCloseAssignModal = () => {
        setAssignModalOpen(false);
        setSelectedRoute(null);
        setSelectedDate(null);
    };
    
    const handleAssignSuccess = async (driverId, vehicleId, morningStartTime, afternoonStartTime) => {
        // Tạo 2 schedules (sáng + chiều) trong DB
        try {
            // Format ngày đúng (tránh timezone UTC làm lùi ngày)
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Tạo ca sáng
            const morningData = {
                route_id: selectedRoute.Id,
                date: dateStr,
                start_time: morningStartTime || '07:00:00',
                shift: 'Sáng',
                status: 'Đã phân công'
            };
            
            // Tạo ca chiều
            const afternoonData = {
                route_id: selectedRoute.Id,
                date: dateStr,
                start_time: afternoonStartTime || '16:00:00',
                shift: 'Chiều',
                status: 'Đã phân công'
            };
            
            await Promise.all([
                createSchedule(morningData),
                createSchedule(afternoonData)
            ]);
            
            toast.success('Đã phân công tài xế và tạo 2 ca (sáng + chiều)!');
            handleCloseAssignModal();
            
            // Refresh data
            fetchData();
        } catch (err) {
            console.error('Tạo schedule lỗi', err);
            toast.error('Không thể tạo lịch trình!');
        }
    };
    
    // Lấy TẤT CẢ schedules cho route và ngày (có thể có 2: sáng + chiều)
    const getSchedulesForRouteAndDate = (routeId, date) => {
        // Format ngày đúng (tránh timezone UTC)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()-1).padStart(2, '0');
        const dateStr = `${year}-${month}-${day}`;
        
        const found = schedules.filter(s => {
            // Extract date part from schedule.date (might be ISO timestamp like '2025-11-24T17:00:00.000Z')
            const scheduleDateStr = s.date.split('T')[0];
            return s.route_id === routeId && scheduleDateStr === dateStr;
        });
        
        // Sắp xếp: Ca sáng trước, ca chiều sau
        return found.sort((a, b) => {
            if (a.shift === 'Sáng' && b.shift === 'Chiều') return -1;
            if (a.shift === 'Chiều' && b.shift === 'Sáng') return 1;
            return 0;
        });
    };
    
    // Format tuần hiển thị
    const formatWeekRange = () => {
        const start = weekDays[0];
        const end = weekDays[6];
        return `${start.getDate()}/${start.getMonth() + 1}/${start.getFullYear()} - ${end.getDate()}/${end.getMonth() + 1}/${end.getFullYear()}`;
    };

    return (
        <Box sx={{ padding: '20px', height: '100%', overflowY: 'auto', background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)' }}>
            {/* Header */}
            <Box sx={{ 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaCalendar size={32} color="#0097a7" />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#0097a7',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                Phân Công Tuyến Xe Trong Tuần
              </Typography>
            </Box>

            {/* Week Navigation */}
            <Card sx={{
              background: 'white',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              boxShadow: '0 4px 15px rgba(0, 151, 167, 0.15)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                <IconButton onClick={goToPreviousWeek} sx={{ color: '#0097a7' }}>
                  <FaChevronLeft />
                </IconButton>
                
                <Box sx={{ textAlign: 'center', flex: 1 }}>
                  <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#00838f' }}>
                    {formatWeekRange()}
                  </Typography>
                  <Button 
                    onClick={goToToday} 
                    size="small"
                    sx={{ 
                      marginTop: '4px',
                      color: '#0097a7',
                      '&:hover': { background: 'rgba(0, 151, 167, 0.1)' }
                    }}
                  >
                    Hôm nay
                  </Button>
                </Box>
                
                <IconButton onClick={goToNextWeek} sx={{ color: '#0097a7' }}>
                  <FaChevronRight />
                </IconButton>
              </Box>
            </Card>

            {/* Calendar Grid */}
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 1fr)',
              gap: '16px',
              marginTop: '24px'
            }}>
              {weekDays.map((day, index) => {
                const isToday = day.toDateString() === new Date().toDateString();
                
                return (
                  <Card
                    key={index}
                    sx={{
                      background: isToday 
                        ? 'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)'
                        : 'white',
                      borderRadius: '12px',
                      padding: '12px',
                      minHeight: '200px',
                      boxShadow: isToday 
                        ? '0 6px 20px rgba(255, 193, 7, 0.3)'
                        : '0 4px 15px rgba(0, 151, 167, 0.1)',
                      border: isToday ? '2px solid #ffc107' : 'none',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 6px 20px rgba(0, 151, 167, 0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    {/* Day Header */}
                    <Box sx={{ 
                      textAlign: 'center',
                      marginBottom: '12px',
                      paddingBottom: '8px',
                      borderBottom: '2px solid',
                      borderColor: isToday ? '#ffc107' : '#b2ebf2'
                    }}>
                      <Typography sx={{ 
                        fontSize: '0.85rem', 
                        color: '#00838f',
                        fontWeight: 'bold'
                      }}>
                        {daysOfWeek[index]}
                      </Typography>
                      <Typography sx={{ 
                        fontSize: '1.5rem', 
                        fontWeight: 'bold',
                        color: isToday ? '#f57f17' : '#0097a7'
                      }}>
                        {day.getDate()}/{day.getMonth() + 1}
                      </Typography>
                      {isToday && (
                        <Chip 
                          label="Hôm nay" 
                          size="small" 
                          sx={{ 
                            marginTop: '4px',
                            background: '#ffc107',
                            color: '#fff',
                            fontWeight: 'bold',
                            fontSize: '0.7rem'
                          }} 
                        />
                      )}
                    </Box>
                    
                    {/* Routes List */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {loading ? (
                        <Typography sx={{ fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                          Đang tải...
                        </Typography>
                      ) : routes.length > 0 ? (
                        routes.map((route) => {
                          const schedulesForDay = getSchedulesForRouteAndDate(route.Id, day);
                          const hasSchedule = schedulesForDay.length > 0;
                          
                          return (
                            <Card
                              key={route.Id}
                              onClick={(e) => !hasSchedule && handleOpenAssignModal(route, day, e)}
                              sx={{
                                padding: '10px',
                                cursor: hasSchedule ? 'default' : 'pointer',
                                background: hasSchedule 
                                  ? 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)'
                                  : 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 100%)',
                                borderRadius: '8px',
                                border: hasSchedule ? '1px solid #66bb6a' : '1px solid #80deea',
                                position: 'relative',
                                transition: 'all 0.2s ease',
                                '&:hover': {
                                  transform: hasSchedule ? 'none' : 'scale(1.02)',
                                  boxShadow: hasSchedule ? undefined : '0 4px 12px rgba(0, 151, 167, 0.3)'
                                }
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <FaBus color="#0097a7" size={14} />
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00838f' }}>
                                  {route.MaTuyen}
                                </Typography>
                              </Box>
                              
                              <Typography sx={{ fontSize: '0.8rem', color: '#555', marginBottom: '6px' }}>
                                {route.Name}
                              </Typography>
                              
                              {/* Schedule Status - Hiển thị cả 2 ca */}
                              {hasSchedule ? (
                                <Box>
                                  {schedulesForDay.map((schedule, idx) => (
                                    <Box 
                                      key={schedule.id}
                                      sx={{ 
                                        marginBottom: idx < schedulesForDay.length - 1 ? '8px' : 0,
                                        paddingBottom: idx < schedulesForDay.length - 1 ? '8px' : 0,
                                        borderBottom: idx < schedulesForDay.length - 1 ? '1px dashed #81c784' : 'none'
                                      }}
                                    >
                                      <Chip 
                                        icon={<FaUserTie size={10} />}
                                        label={schedule.shift === 'Sáng' ? '🌅 Ca sáng' : '🌆 Ca chiều'}
                                        size="small"
                                        sx={{ 
                                          fontSize: '0.65rem',
                                          height: '20px',
                                          background: schedule.shift === 'Sáng' ? '#4caf50' : '#ff9800',
                                          color: '#fff',
                                          marginBottom: '4px',
                                          fontWeight: 'bold'
                                        }}
                                      />
                                      {schedule.start_time && (
                                        <Typography sx={{ fontSize: '0.7rem', color: '#0097a7', fontWeight: 'bold' }}>
                                          ⏰ {schedule.start_time}
                                        </Typography>
                                      )}
                                      {schedule.driverName && (
                                        <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                          👨‍✈️ {schedule.driverName}
                                        </Typography>
                                      )}
                                      {schedule.licensePlate && (
                                        <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                          🚌 {schedule.licensePlate}
                                        </Typography>
                                      )}
                                    </Box>
                                  ))}
                                </Box>
                              ) : (
                                <Chip 
                                  label="Chưa phân công" 
                                  size="small"
                                  sx={{ 
                                    fontSize: '0.65rem',
                                    height: '20px',
                                    background: '#ff9800',
                                    color: '#fff'
                                  }}
                                />
                              )}
                            </Card>
                          );
                        })
                      ) : (
                        <Typography sx={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: '20px' }}>
                          Không có tuyến
                        </Typography>
                      )}
                    </Box>
                  </Card>
                );
              })}
            </Box>

            {/* Assign Driver Modal */}
            <AssignRouteDriverModal
                open={assignModalOpen}
                onClose={handleCloseAssignModal}
                route={selectedRoute}
                date={selectedDate}
                onSuccess={handleAssignSuccess}
            />
        </Box>
    )
}

export default Calendar