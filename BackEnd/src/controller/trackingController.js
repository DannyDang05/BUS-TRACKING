import { pool } from "../config/connectDB.js";
import { broadcastLocation } from "../services/webSocketService.js";

// POST /api/v1/tracking/update-location
const updateLocation = async (req, res) => {
  // Giả sử API này được gọi bởi app của tài xế
  // Trong thực tế, app của tài xế cũng cần xác thực (ví dụ: gửi JWT của tài xế)
  const { busId, latitude, longitude } = req.body;

  if (!busId || latitude === undefined || longitude === undefined) {
    return res.status(400).json({ errorCode: 1, message: 'Thiếu thông tin (busId, lat, lng).' });
  }

  const timestamp = new Date();

  try {
    // 1. Lưu vị trí vào DB (cho lịch sử)
    await pool.query(
      'INSERT INTO BusLocations (busId, latitude, longitude, timestamp) VALUES (?, ?, ?, ?)',
      [busId, latitude, longitude, timestamp]
    );

    // 2. Gửi (Broadcast) vị trí mới cho Admin Map qua WebSocket
    const locationData = {
        busId: busId,
        lat: latitude,
        lng: longitude,
        timestamp: timestamp
    };
    broadcastLocation(locationData);

    return res.status(200).json({ errorCode: 0, message: 'Cập nhật vị trí thành công.' });

  } catch (e) {
    console.log(e);
    // Có thể lỗi do busId không tồn tại (lỗi khóa ngoại)
    return res.status(500).json({ errorCode: -1, message: 'Lỗi server khi cập nhật vị trí.' });
  }
};

// GET /api/v1/tracking/live
const getLiveLocations = async (req, res) => {
    // API này lấy vị trí MỚI NHẤT của TẤT CẢ các xe
    // Rất hữu ích khi admin mới tải trang Map
    try {
        const [rows] = await pool.query(
            `SELECT t1.*
            FROM BusLocations t1
            INNER JOIN (
                SELECT busId, MAX(timestamp) AS max_timestamp
                FROM BusLocations
                GROUP BY busId
            ) t2 ON t1.busId = t2.busId AND t1.timestamp = t2.max_timestamp`
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

    // Nếu không có 'from' và 'to', mặc định lấy 1 giờ gần nhất
    const toTimestamp = to ? new Date(to) : new Date();
    const fromTimestamp = from ? new Date(from) : new Date(toTimestamp.getTime() - (60 * 60 * 1000)); // 1 giờ trước

    try {
        const [rows] = await pool.query(
            `SELECT latitude, longitude, timestamp 
            FROM BusLocations 
            WHERE busId = ? AND timestamp BETWEEN ? AND ?
            ORDER BY timestamp ASC`, // Sắp xếp theo thứ tự thời gian để vẽ
            [busId, fromTimestamp, toTimestamp]
        );

        if (rows.length === 0) {
            return res.status(404).json({ errorCode: 4, message: 'Không tìm thấy lịch sử lộ trình cho xe này trong khoảng thời gian đã chọn.' });
        }

        return res.status(200).json({
            errorCode: 0,
            message: 'OK',
            data: rows // Mảng các tọa độ [ {lat, lng}, {lat, lng}, ... ]
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};

export { updateLocation, getLiveLocations ,getRouteHistory};