import { getBusLocations } from "../service/SocketService.js";

/**
 * GET /api/v1/tracking/memory/location/:busId
 * Lấy vị trí hiện tại của xe từ memory
 */
export const getLocationFromMemory = async (req, res) => {
    try {
        const { busId } = req.params;
        
        if (!busId) {
            return res.status(400).json({ 
                errorCode: 1, 
                message: 'Thiếu busId' 
            });
        }

        const locations = getBusLocations();
        const location = locations.get(Number(busId));
        
        if (!location) {
            return res.status(404).json({ 
                errorCode: 3, 
                message: `Không tìm thấy vị trí của bus ${busId} (xe chưa gửi GPS hoặc không hoạt động)` 
            });
        }
        
        return res.status(200).json({ 
            errorCode: 0, 
            message: 'Lấy vị trí thành công',
            data: location
        });
    } catch (error) {
        console.error('❌ Error in getLocationFromMemory:', error);
        return res.status(500).json({ 
            errorCode: -1, 
            message: 'Lỗi server khi lấy vị trí',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/tracking/memory/active-buses
 * Lấy danh sách tất cả xe đang hoạt động (có trong memory)
 */
export const getActiveBuses = async (req, res) => {
    try {
        const locations = getBusLocations();
        
        if (locations.size === 0) {
            return res.status(200).json({ 
                errorCode: 0, 
                message: 'Không có xe nào đang hoạt động',
                data: []
            });
        }

        // Chuyển Map thành array
        const buses = Array.from(locations.values());

        return res.status(200).json({ 
            errorCode: 0, 
            message: `Tìm thấy ${buses.length} xe đang hoạt động`,
            data: buses
        });
    } catch (error) {
        console.error('❌ Error in getActiveBuses:', error);
        return res.status(500).json({ 
            errorCode: -1, 
            message: 'Lỗi server khi lấy danh sách xe',
            error: error.message
        });
    }
};

/**
 * GET /api/v1/tracking/memory/history/:busId
 * Lấy lịch sử vị trí của xe
 * NOTE: Tính năng history không khả dụng khi dùng in-memory storage
 */
export const getLocationHistory = async (req, res) => {
    return res.status(501).json({ 
        errorCode: 4, 
        message: 'Tính năng lịch sử vị trí chưa được hỗ trợ (chỉ lưu vị trí mới nhất trong memory)'
    });
};
