sequenceDsequenceDiagram
    participant DriverUI as Driver UI<br/>(DetailSchedule.jsx)
    participant DriverAPI as Driver API<br/>(scheduleController.js)
    participant Socket as Socket.IO Server<br/>(SocketService.js)
    participant Redis as Redis Cache<br/>(redisTrackingController.js)
    participant MySQL as MySQL Database<br/>(schedules, routes, pickuppoints)
    participant ParentUI as Parent UI<br/>(ParentMap.jsx)
    participant AdminUI as Admin Map<br/>(Map.jsx)

    Note over DriverUI,AdminUI: 1. DRIVER LOGIN & LOAD SCHEDULES
    DriverUI->>DriverAPI: GET /api/v1/drivers/{driverId}/schedules
    DriverAPI->>MySQL: SELECT s.*, r.MaTuyen, v.LicensePlate<br/>FROM schedules s<br/>JOIN routes r ON s.route_id = r.Id<br/>LEFT JOIN vehicles v ON s.vehicle_id = v.Id<br/>WHERE s.driver_id = '{driverId}'
    MySQL-->>DriverAPI: Return schedules list
    DriverAPI-->>DriverUI: schedules with route & vehicle info

    Note over DriverUI,AdminUI: 2. DRIVER CLICK VÀO SCHEDULE
    DriverUI->>DriverAPI: GET /api/v1/schedules/{scheduleId}/students
    DriverAPI->>MySQL: SELECT hs.*, p.DiaChi, p.Latitude, p.Longitude,<br/>sps.TinhTrangDon, sps.ThoiGianDon<br/>FROM pickuppoints p<br/>JOIN hocsinh hs ON p.MaHocSinh = hs.MaHocSinh<br/>LEFT JOIN schedule_pickup_status sps<br/>WHERE p.RouteId = {routeId}
    MySQL-->>DriverAPI: Student list with pickup status
    DriverAPI-->>DriverUI: Display students in table

    Note over DriverUI,AdminUI: 3. DRIVER BẮT ĐẦU HÀNH TRÌNH
    DriverUI->>DriverAPI: POST /api/v1/schedules/{scheduleId}/start
    DriverAPI->>MySQL: UPDATE schedules<br/>SET status='Đang chạy',<br/>start_time=NOW()<br/>WHERE id={scheduleId}
    DriverAPI->>MySQL: INSERT INTO schedule_pickup_status<br/>(ScheduleId, PickupPointId, TinhTrangDon)<br/>VALUES ({scheduleId}, {pointId}, 'Chưa đón')
    MySQL-->>DriverAPI: Success
    DriverAPI-->>DriverUI: Navigate to /driver/map

    Note over DriverUI,AdminUI: 4. DRIVER MAP TRACKING GPS
    activate DriverUI
    DriverUI->>Socket: socket.emit('driver:location', {<br/>  driverId: 'TX001',<br/>  latitude: 10.762622,<br/>  longitude: 106.660172,<br/>  scheduleId: 58<br/>})
    Socket->>Redis: redis.geoadd('driver_locations',<br/>  longitude, latitude, driverId)
    Socket->>Redis: redis.hset(`driver:${driverId}`, {<br/>  latitude, longitude,<br/>  timestamp: Date.now()<br/>})
    Socket->>Socket: io.to('admin').emit('location:update', data)
    Socket-->>AdminUI: Real-time location update
    deactivate DriverUI

    Note over DriverUI,AdminUI: 5. PARENT SUBSCRIBE THEO DÕI XE
    ParentUI->>Socket: socket.emit('parent:subscribe', {<br/>  busId: '51B-293.79',<br/>  scheduleId: 58<br/>})
    Socket->>Socket: socket.join(`bus-51B-293.79`)
    Socket->>Redis: redis.hget(`driver:TX001`)
    Redis-->>Socket: {lat, lng, timestamp}
    Socket-->>ParentUI: socket.emit('initial:location', data)

    Note over DriverUI,AdminUI: 6. CONTINUOUS GPS BROADCAST (Every 3s)
    loop Every 3 seconds
        DriverUI->>Socket: Emit 'driver:location'
        Socket->>Redis: Update geoadd + hset
        Socket->>Socket: io.to(`bus-51B-293.79`).emit('bus:location:update')
        Socket-->>ParentUI: Update map marker
        Socket->>Socket: io.to('admin').emit('location:update')
        Socket-->>AdminUI: Update admin map
    end

    Note over DriverUI,AdminUI: 7. PROXIMITY CHECK (Xe Gần Điểm Đón)
    Socket->>Redis: redis.georadius('driver_locations',<br/>  student_lng, student_lat, 100, 'm')
    alt Driver within 100m
        Socket->>MySQL: SELECT TinhTrangDon<br/>FROM schedule_pickup_status<br/>WHERE ScheduleId={id} AND PickupPointId={pid}
        MySQL-->>Socket: status = 'Chưa đón'
        Socket->>MySQL: UPDATE schedule_pickup_status<br/>SET TinhTrangDon='Đã đón',<br/>ThoiGianDon=NOW()
        Socket->>MySQL: INSERT INTO thongbao (MaThongBao, NoiDung)<br/>VALUES ('TB...', 'Xe sắp đến điểm đón')
        Socket->>MySQL: INSERT INTO thongbao_phuhuynh<br/>(MaThongBao, MaPhuHuynh)
        Socket-->>ParentUI: socket.emit('proximity:alert', {<br/>  message: 'Xe đang cách bạn 50m'<br/>})
    end

    Note over DriverUI,AdminUI: 8. DRIVER MANUAL UPDATE STATUS
    DriverUI->>DriverAPI: PUT /api/v1/pickuppoints/schedule/pickup-status
    DriverAPI->>MySQL: UPDATE schedule_pickup_status<br/>SET TinhTrangDon='{status}',<br/>ThoiGianDon=NOW()<br/>WHERE ScheduleId={id} AND PickupPointId={pid}
    MySQL-->>DriverAPI: Success
    DriverAPI-->>DriverUI: Status updated

    Note over DriverUI,AdminUI: 9. AUTO REFRESH STUDENT LIST (Polling)
    loop Every 3 seconds
        DriverUI->>DriverAPI: GET /api/v1/schedules/{scheduleId}/students
        DriverAPI->>MySQL: SELECT with latest pickup status
        MySQL-->>DriverAPI: Updated student list
        DriverAPI-->>DriverUI: Refresh table & map markers
    end

    Note over DriverUI,AdminUI: 10. ADMIN XEM TUYẾN ĐANG CHẠY
    AdminUI->>DriverAPI: GET /api/v1/routes/all-with-points
    DriverAPI->>MySQL: SELECT r.*, s.status, d.FullName, v.LicensePlate<br/>FROM routes r<br/>LEFT JOIN schedules s ON s.route_id = r.Id<br/>  AND DATE(s.date) = CURDATE()<br/>LEFT JOIN drivers d ON s.driver_id = d.Id<br/>LEFT JOIN vehicles v ON s.vehicle_id = v.Id<br/>WHERE s.status = 'Đang chạy'
    MySQL-->>DriverAPI: Running routes with schedule info
    DriverAPI->>Redis: redis.hget(`driver:${driverId}`)
    Redis-->>DriverAPI: Current GPS location
    DriverAPI-->>AdminUI: Routes with real-time locations

    Note over DriverUI,AdminUI: 11. DRIVER KẾT THÚC HÀNH TRÌNH
    DriverUI->>DriverAPI: POST /api/v1/schedules/{scheduleId}/end
    DriverAPI->>MySQL: UPDATE schedules<br/>SET status='Hoàn thành',<br/>end_time=NOW()<br/>WHERE id={scheduleId}
    MySQL-->>DriverAPI: Success
    DriverAPI->>Redis: redis.del(`driver:${driverId}`)
    DriverAPI->>Socket: io.emit('schedule:completed', {scheduleId})
    Socket-->>AdminUI: Remove from running routes
    Socket-->>ParentUI: Show completion notification
    DriverAPI-->>DriverUI: Navigate to /driver/schedule

    Note over DriverUI,AdminUI: 12. PARENT UNSUBSCRIBE
    ParentUI->>Socket: socket.emit('parent:unsubscribe', {busId})
    Socket->>Socket: socket.leave(`bus-51B-293.79`)