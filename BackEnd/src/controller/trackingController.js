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
    // Trả về vị trí hiện tại (currentLatitude/currentLongitude) từ bảng `routes`.
    // Đây là định nghĩa "live" trong schema hiện tại.
    try {
        const [rows] = await pool.query(
            `SELECT Id AS routeId, MaTuyen, Name, DriverId, VehicleId AS busId, Status,
                    currentLatitude AS latitude, currentLongitude AS longitude
             FROM routes
             WHERE currentLatitude IS NOT NULL AND currentLongitude IS NOT NULL`
        );
        return res.status(200).json({ errorCode: 0, message: 'OK', data: rows });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
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