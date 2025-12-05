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
import EditScheduleModal from './EditScheduleModal';

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
    const [selectedShift, setSelectedShift] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedSchedule, setSelectedSchedule] = useState(null);
    
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
    
    const handleOpenAssignModal = (route, date, shift, e) => {
        if (e) e.stopPropagation();
        setSelectedRoute(route);
        setSelectedDate(date);
        setSelectedShift(shift);
        setAssignModalOpen(true);
    };
    
    const handleCloseAssignModal = () => {
        setAssignModalOpen(false);
        setSelectedRoute(null);
        setSelectedDate(null);
        setSelectedShift(null);
    };
    
    const handleOpenEditModal = (schedule, e) => {
        if (e) e.stopPropagation();
        setSelectedSchedule(schedule);
        setEditModalOpen(true);
    };
    
    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setSelectedSchedule(null);
    };
    
    const handleEditSuccess = () => {
        fetchData();
    };
    
    const handleAssignSuccess = async (driverId, vehicleId, startTime) => {
        // Tạo schedule cho ca đã chọn
        try {
            // Format ngày đúng (tránh timezone UTC làm lùi ngày)
            const year = selectedDate.getFullYear();
            const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
            const day = String(selectedDate.getDate()).padStart(2, '0');
            const dateStr = `${year}-${month}-${day}`;
            
            // Tạo schedule với driver_id và vehicle_id
            const scheduleData = {
                route_id: selectedRoute.Id,
                date: dateStr,
                start_time: startTime || (selectedShift === 'Sáng' ? '07:00:00' : '16:00:00'),
                shift: selectedShift,
                status: 'Đã phân công',
                driver_id: driverId,
                vehicle_id: vehicleId
            };
            
            await createSchedule(scheduleData);
            
            toast.success(`Đã phân công ca ${selectedShift} thành công!`);
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
        const day = String(date.getDate()).padStart(2, '0');
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
        <Box sx={{ padding: '20px', background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)' }}>
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
                    
                    {/* Schedules List - Hiển thị 2 ca cho mỗi tuyến */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {loading ? (
                        <Typography sx={{ fontSize: '0.85rem', color: '#999', textAlign: 'center' }}>
                          Đang tải...
                        </Typography>
                      ) : (() => {
                          // Lấy tất cả schedules cho ngày này
                          const year = day.getFullYear();
                          const month = String(day.getMonth() + 1).padStart(2, '0');
                          const dayStr = String(day.getDate()).padStart(2, '0');
                          const dateStr = `${year}-${month}-${dayStr}`;
                          
                          const schedulesForDay = schedules.filter(s => {
                            const scheduleDateStr = s.date.split('T')[0];
                            return scheduleDateStr === dateStr;
                          });
                          
                          // Tạo Map: route_id -> { morning: schedule | null, afternoon: schedule | null }
                          const routeScheduleMap = new Map();
                          
                          // Thêm tất cả các tuyến hiện có
                          routes.forEach(route => {
                            routeScheduleMap.set(route.Id, { morning: null, afternoon: null, route });
                          });
                          
                          // Fill schedules vào map
                          schedulesForDay.forEach(schedule => {
                            if (routeScheduleMap.has(schedule.route_id)) {
                              const entry = routeScheduleMap.get(schedule.route_id);
                              if (schedule.shift === 'Sáng') {
                                entry.morning = schedule;
                              } else if (schedule.shift === 'Chiều') {
                                entry.afternoon = schedule;
                              }
                            }
                          });
                          
                          // Render cards cho mỗi ca
                          const cards = [];
                          routeScheduleMap.forEach((entry, routeId) => {
                            const { route, morning, afternoon } = entry;
                            
                            // Card ca sáng
                            if (morning) {
                              // Đã có schedule sáng - hiển thị thông tin
                              cards.push(
                                <Card
                                  key={`${routeId}-morning`}
                                  onClick={(e) => handleOpenEditModal(morning, e)}
                                  sx={{
                                    padding: '10px',
                                    background: 
                                      morning.status === 'Hoàn thành' ? 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)' :
                                      morning.status === 'Đã hủy' ? 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)' :
                                      morning.status === 'Đang chạy' ? 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)' :
                                      'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
                                    borderRadius: '8px',
                                    border: 
                                      morning.status === 'Hoàn thành' ? '1px solid #66bb6a' :
                                      morning.status === 'Đã hủy' ? '1px solid #e57373' :
                                      morning.status === 'Đang chạy' ? '1px solid #4fc3f7' :
                                      '1px solid #fff176',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.02)',
                                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                    <FaBus color="#0097a7" size={14} />
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00838f' }}>
                                      {morning.routeCode}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: '0.8rem', color: '#555', marginBottom: '8px' }}>
                                    {morning.routeName}
                                  </Typography>
                                  <Chip 
                                    label="☀️ Ca sáng"
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      height: '22px',
                                      background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                                      color: '#fff',
                                      marginBottom: '4px',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                                    }}
                                  />
                                  {morning.start_time && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#0097a7', fontWeight: 'bold', mt: 0.5 }}>
                                      ⏰ {morning.start_time}
                                    </Typography>
                                  )}
                                  {morning.driverName && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                      👨‍✈️ {morning.driverName}
                                    </Typography>
                                  )}
                                  {morning.licensePlate && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                      🚌 {morning.licensePlate}
                                    </Typography>
                                  )}
                                </Card>
                              );
                            } else {
                              // Chưa có schedule sáng - hiển thị card chưa phân công
                              cards.push(
                                <Card
                                  key={`${routeId}-morning`}
                                  onClick={(e) => handleOpenAssignModal(route, day, 'Sáng', e)}
                                  sx={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #fff8e1 0%, #ffecb3 100%)',
                                    borderRadius: '8px',
                                    border: '1px solid #ffb74d',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.02)',
                                      boxShadow: '0 4px 12px rgba(255, 152, 0, 0.3)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                    <FaBus color="#0097a7" size={14} />
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00838f' }}>
                                      {route.MaTuyen}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: '0.8rem', color: '#555', marginBottom: '8px' }}>
                                    {route.Name}
                                  </Typography>
                                  <Chip 
                                    label="☀️ Ca sáng"
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      height: '22px',
                                      background: 'linear-gradient(135deg, #ffa726 0%, #ff9800 100%)',
                                      color: '#fff',
                                      marginBottom: '4px',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                                    }}
                                  />
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
                                </Card>
                              );
                            }
                            
                            // Card ca chiều
                            if (afternoon) {
                              // Đã có schedule chiều - hiển thị thông tin
                              cards.push(
                                <Card
                                  key={`${routeId}-afternoon`}
                                  onClick={(e) => handleOpenEditModal(afternoon, e)}
                                  sx={{
                                    padding: '10px',
                                    background: 
                                      afternoon.status === 'Hoàn thành' ? 'linear-gradient(135deg, #c8e6c9 0%, #a5d6a7 100%)' :
                                      afternoon.status === 'Đã hủy' ? 'linear-gradient(135deg, #ffcdd2 0%, #ef9a9a 100%)' :
                                      afternoon.status === 'Đang chạy' ? 'linear-gradient(135deg, #b3e5fc 0%, #81d4fa 100%)' :
                                      'linear-gradient(135deg, #fff9c4 0%, #fff59d 100%)',
                                    borderRadius: '8px',
                                    border: 
                                      afternoon.status === 'Hoàn thành' ? '1px solid #66bb6a' :
                                      afternoon.status === 'Đã hủy' ? '1px solid #e57373' :
                                      afternoon.status === 'Đang chạy' ? '1px solid #4fc3f7' :
                                      '1px solid #fff176',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.02)',
                                      boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                    <FaBus color="#0097a7" size={14} />
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00838f' }}>
                                      {afternoon.routeCode}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: '0.8rem', color: '#555', marginBottom: '8px' }}>
                                    {afternoon.routeName}
                                  </Typography>
                                  <Chip 
                                    label="🌙 Ca chiều"
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      height: '22px',
                                      background: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
                                      color: '#fff',
                                      marginBottom: '4px',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                                    }}
                                  />
                                  {afternoon.start_time && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#0097a7', fontWeight: 'bold', mt: 0.5 }}>
                                      ⏰ {afternoon.start_time}
                                    </Typography>
                                  )}
                                  {afternoon.driverName && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                      👨‍✈️ {afternoon.driverName}
                                    </Typography>
                                  )}
                                  {afternoon.licensePlate && (
                                    <Typography sx={{ fontSize: '0.7rem', color: '#2e7d32' }}>
                                      🚌 {afternoon.licensePlate}
                                    </Typography>
                                  )}
                                </Card>
                              );
                            } else {
                              // Chưa có schedule chiều - hiển thị card chưa phân công
                              cards.push(
                                <Card
                                  key={`${routeId}-afternoon`}
                                  onClick={(e) => handleOpenAssignModal(route, day, 'Chiều', e)}
                                  sx={{
                                    padding: '10px',
                                    cursor: 'pointer',
                                    background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                                    borderRadius: '8px',
                                    border: '1px solid #64b5f6',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      transform: 'scale(1.02)',
                                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)'
                                    }
                                  }}
                                >
                                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                                    <FaBus color="#0097a7" size={14} />
                                    <Typography sx={{ fontSize: '0.9rem', fontWeight: 'bold', color: '#00838f' }}>
                                      {route.MaTuyen}
                                    </Typography>
                                  </Box>
                                  <Typography sx={{ fontSize: '0.8rem', color: '#555', marginBottom: '8px' }}>
                                    {route.Name}
                                  </Typography>
                                  <Chip 
                                    label="🌙 Ca chiều"
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      height: '22px',
                                      background: 'linear-gradient(135deg, #42a5f5 0%, #1e88e5 100%)',
                                      color: '#fff',
                                      marginBottom: '4px',
                                      fontWeight: 'bold',
                                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)'
                                    }}
                                  />
                                  <Chip 
                                    label="Chưa phân công" 
                                    size="small"
                                    sx={{ 
                                      fontSize: '0.65rem',
                                      height: '20px',
                                      background: '#2196f3',
                                      color: '#fff'
                                    }}
                                  />
                                </Card>
                              );
                            }
                          });
                          
                          return cards.length > 0 ? cards : (
                            <Typography sx={{ fontSize: '0.85rem', color: '#999', textAlign: 'center', marginTop: '20px' }}>
                              Chưa có tuyến
                            </Typography>
                          );
                        })()
                      }
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
                shift={selectedShift}
                onSuccess={handleAssignSuccess}
            />
            
            {/* Edit Schedule Modal */}
            <EditScheduleModal
                open={editModalOpen}
                onClose={handleCloseEditModal}
                schedule={selectedSchedule}
                onSuccess={handleEditSuccess}
            />
        </Box>
    )
}

export default Calendar