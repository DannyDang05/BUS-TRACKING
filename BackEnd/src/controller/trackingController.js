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
                COUNT(DISTINCT pp.Id) AS totalStudents,
                SUM(CASE WHEN pp.TinhTrangDon = 'Đã đón' THEN 1 ELSE 0 END) AS pickedUp,
                SUM(CASE WHEN pp.TinhTrangDon = 'Đã trả' THEN 1 ELSE 0 END) AS droppedOff,
                s.status AS scheduleStatus,
                s.start_time AS startTime,
                NOW() AS timestamp
             FROM routes r
             LEFT JOIN vehicles v ON r.VehicleId = v.Id
             LEFT JOIN drivers d ON r.DriverId = d.Id
             LEFT JOIN pickuppoints pp ON r.Id = pp.RouteId
             LEFT JOIN schedules s ON r.Id = s.route_id AND s.date = CURDATE()
             WHERE r.currentLatitude IS NOT NULL 
               AND r.currentLongitude IS NOT NULL
               AND (r.Status = 'Đang chạy' OR s.status = 2)
             GROUP BY r.Id, r.MaTuyen, r.Name, r.Status, r.currentLatitude, r.currentLongitude,
                      r.VehicleId, r.DriverId, v.LicensePlate, v.Model, v.SpeedKmh,
                      d.FullName, d.PhoneNumber, s.status, s.start_time
             ORDER BY r.Name ASC`
        );

        // Map schedule status to readable status
        const formattedData = rows.map(row => ({
            ...row,
            status: row.scheduleStatus === 2 ? 'Đang chạy' : row.routeStatus || 'Không xác định',
            pickedUp: row.pickedUp || 0,
            droppedOff: row.droppedOff || 0,
            totalStudents: row.totalStudents || 0
        }));

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

export { updateLocation, getLiveLocations ,getRouteHistory};