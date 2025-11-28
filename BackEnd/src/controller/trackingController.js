import { pool } from "../config/connectDB.js";
import { broadcastLocation } from "../service/WebsocketService.js";

// POST /api/v1/tracking/update-location
const updateLocation = async (req, res) => {
    // API này được gọi bởi app của tài xế (hoặc thiết bị GPS trên xe)
    // Hỗ trợ cả `busId` (vehicle id) hoặc `vehicleId` / `routeId` trong payload
    const { busId, vehicleId, routeId, latitude, longitude } = req.body;

    if ((busId || vehicleId || routeId) === undefined || latitude === undefined || longitude === undefined) {
        return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (vehicle/route id, latitude, longitude).' });
    }

    // Quy ước: nếu gửi `busId` hoặc `vehicleId` => cập nhật theo `VehicleId` ở bảng `routes`.
    // Nếu gửi `routeId` => cập nhật theo `Id` của bảng `routes`.
    const vid = vehicleId || busId;

    try {
        let result;
        if (routeId) {
            [result] = await pool.query(
                'UPDATE routes SET currentLatitude = ?, currentLongitude = ? WHERE Id = ?',
                [latitude, longitude, routeId]
            );
        } else {
            [result] = await pool.query(
                'UPDATE routes SET currentLatitude = ?, currentLongitude = ? WHERE VehicleId = ?',
                [latitude, longitude, vid]
            );
            // Nếu không có hàng nào bị ảnh hưởng, thử coi client gửi `busId` như là route Id
            if (result.affectedRows === 0) {
                [result] = await pool.query(
                    'UPDATE routes SET currentLatitude = ?, currentLongitude = ? WHERE Id = ?',
                    [latitude, longitude, vid]
                );
            }
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ errorCode: 3, message: 'Không tìm thấy route/vehicle để cập nhật.' });
        }

        // Gửi (Broadcast) vị trí mới cho Admin Map qua WebSocket
        const locationData = {
            routeId: routeId || null,
            busId: vid || null,
            latitude,
            longitude,
            timestamp: new Date()
        };
        broadcastLocation(locationData);

        return res.status(200).json({ errorCode: 0, message: 'Cập nhật vị trí thành công.' });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server khi cập nhật vị trí.' });
    }
};

// GET /api/v1/tracking/live
const getLiveLocations = async (req, res) => {
    // Trả về vị trí hiện tại của tất cả xe đang chạy với thông tin chi tiết
    // Nếu schedule đang chạy, lấy trạng thái từ schedule_pickup_status
    try {
        const [rows] = await pool.query(
            `SELECT 
                r.Id AS routeId,
                r.MaTuyen AS routeCode,
                r.Name AS routeName,
                r.Status AS routeStatus,
                r.currentLatitude AS latitude,
                r.currentLongitude AS longitude,
                r.VehicleId AS vehicleId,
                r.DriverId AS driverId,
                v.LicensePlate AS licensePlate,
                v.Model AS vehicleModel,
                v.SpeedKmh AS speed,
                d.FullName AS driverName,
                d.PhoneNumber AS driverPhone,
                s.id AS scheduleId,
                s.status AS scheduleStatus,
                s.shift AS shift,
                s.start_time AS startTime,
                NOW() AS timestamp
             FROM routes r
             LEFT JOIN vehicles v ON r.VehicleId = v.Id
             LEFT JOIN drivers d ON r.DriverId = d.Id
             LEFT JOIN schedules s ON r.Id = s.route_id AND s.date = CURDATE()
             WHERE r.currentLatitude IS NOT NULL 
               AND r.currentLongitude IS NOT NULL
               AND (r.Status = 'Đang chạy' OR s.status = 'Đang chạy')
             ORDER BY r.Name ASC`
        );

        // Lấy thông tin pickup status cho từng route
        const formattedData = [];
        for (const row of rows) {
            let totalStudents = 0;
            let pickedUp = 0;
            let droppedOff = 0;

            // Nếu có schedule đang chạy, lấy từ schedule_pickup_status
            if (row.scheduleId && row.scheduleStatus === 'Đang chạy') {
                const [statusData] = await pool.query(
                    `SELECT 
                        COUNT(*) AS total,
                        SUM(CASE WHEN sps.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS picked,
                        SUM(CASE WHEN sps.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS dropped
                     FROM schedule_pickup_status sps
                     INNER JOIN pickuppoints pp ON sps.PickupPointId = pp.Id
                     WHERE sps.ScheduleId = ? AND pp.MaHocSinh IS NOT NULL`,
                    [row.scheduleId]
                );
                totalStudents = statusData[0].total || 0;
                pickedUp = statusData[0].picked || 0;
                droppedOff = statusData[0].dropped || 0;
            } else {
                // Nếu không có schedule hoặc chưa chạy, lấy từ pickuppoints
                const [pickupData] = await pool.query(
                    `SELECT 
                        COUNT(*) AS total,
                        SUM(CASE WHEN pp.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS picked,
                        SUM(CASE WHEN pp.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS dropped
                     FROM pickuppoints pp
                     WHERE pp.RouteId = ? AND pp.MaHocSinh IS NOT NULL`,
                    [row.routeId]
                );
                totalStudents = pickupData[0].total || 0;
                pickedUp = pickupData[0].picked || 0;
                droppedOff = pickupData[0].dropped || 0;
            }

            formattedData.push({
                ...row,
                status: row.scheduleStatus || row.routeStatus || 'Không xác định',
                pickedUp,
                droppedOff,
                totalStudents
            });
        }

        return res.status(200).json({ 
            errorCode: 0, 
            message: 'OK', 
            data: formattedData 
        });
    } catch (e) {
        console.error('Error in getLiveLocations:', e);
        return res.status(500).json({ 
            errorCode: -1, 
            message: 'Lỗi server khi lấy vị trí xe.' 
        });
    }
};
const getRouteHistory = async (req, res) => {
    const { busId } = req.params;
    // Lấy query params, ví dụ: ?from=YYYY-MM-DD HH:MM:SS&to=YYYY-MM-DD HH:MM:SS
    const { from, to } = req.query;

    if (!busId) {
        return res.status(400).json({ errorCode: 1, message: 'Thiếu busId.' });
    }

    // Hiện tại không có bảng lịch sử vị trí (BusLocations) trong schema.
    // Trả về vị trí hiện tại (nếu có) cho busId (được hiểu là vehicleId).
    try {
        const id = busId;
        const [rows] = await pool.query(
            `SELECT VehicleId AS busId, currentLatitude AS latitude, currentLongitude AS longitude
             FROM routes
             WHERE VehicleId = ? OR Id = ?`,
            [id, id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ errorCode: 4, message: 'Không tìm thấy vị trí cho xe/tuyến này.' });
        }
        // Trả về mảng điểm (history tối giản, chỉ 1 điểm hiện tại)
        return res.status(200).json({ errorCode: 0, message: 'OK', data: [rows[0]] });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};

/**
 * GET /api/v1/tracking/pickup-points/:scheduleId
 * Lấy danh sách điểm đón với trạng thái từ schedule_pickup_status
 * Dùng cho map driver và admin khi schedule đang chạy
 */
const getSchedulePickupPoints = async (req, res) => {
    const scheduleId = req.params.scheduleId;

    try {
        // Lấy thông tin schedule và route
        const [scheduleData] = await pool.query(
            `SELECT s.id, s.route_id, s.status, s.shift, r.Name as routeName, r.MaTuyen as routeCode
             FROM schedules s
             INNER JOIN routes r ON s.route_id = r.Id
             WHERE s.id = ?`,
            [scheduleId]
        );

        if (scheduleData.length === 0) {
            return res.status(404).json({ 
                errorCode: 3, 
                message: 'Không tìm thấy schedule.' 
            });
        }

        const schedule = scheduleData[0];

        // Lấy danh sách pickup points với trảng thái từ schedule_pickup_status
        const [pickupPoints] = await pool.query(
            `SELECT 
                pp.Id AS pickupPointId,
                pp.PointOrder,
                pp.Latitude,
                pp.Longitude,
                pp.DiaChi AS address,
                COALESCE(sps.TinhTrangDon, 'Chưa đón') AS status,
                sps.ThoiGianDonThucTe AS actualTime,
                sps.GhiChu AS note,
                hs.MaHocSinh AS studentId,
                hs.HoTen AS studentName,
                hs.Lop AS studentClass,
                ph.HoTen AS parentName,
                ph.SoDienThoai AS parentPhone
             FROM pickuppoints pp
             LEFT JOIN schedule_pickup_status sps ON sps.PickupPointId = pp.Id AND sps.ScheduleId = ?
             LEFT JOIN hocsinh hs ON pp.MaHocSinh = hs.MaHocSinh
             LEFT JOIN phuhuynh ph ON hs.MaPhuHuynh = ph.MaPhuHuynh
             WHERE pp.RouteId = ? AND pp.MaHocSinh IS NOT NULL
             ORDER BY pp.PointOrder ASC`,
            [scheduleId, schedule.route_id]
        );

        return res.status(200).json({ 
            errorCode: 0, 
            message: 'OK', 
            data: {
                schedule: {
                    id: schedule.id,
                    status: schedule.status,
                    shift: schedule.shift,
                    routeName: schedule.routeName,
                    routeCode: schedule.routeCode
                },
                pickupPoints
            }
        });
    } catch (e) {
        console.error('Error in getSchedulePickupPoints:', e);
        return res.status(500).json({ 
            errorCode: -1, 
            message: 'Lỗi server.' 
        });
    }
};

export { updateLocation, getLiveLocations, getRouteHistory, getSchedulePickupPoints };