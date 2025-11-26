import { pool } from "../config/connectDB.js";

// GET /api/v1/:parentId
// Lấy thông tin phụ huynh từ bảng `phuhuynh`
const getParentInformation = async (req, res) => {
    const parentId = req.params.parentId;
    try {
        const [rows] = await pool.query(
            'SELECT MaPhuHuynh, HoTen, SoDienThoai FROM phuhuynh WHERE MaPhuHuynh = ?',
            [parentId]
        );
        if (rows.length === 0) {
            return res.status(404).json({ errorCode: -1, message: 'Phụ huynh không tồn tại.' });
        }
        return res.status(200).json({
            errorCode: 0,
            message: 'OK',
            data: rows[0],
        });

    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
}
// GET /api/v1/:parentId
// Lấy danh sách học sinh của phụ huynh từ bảng `hocsinh`
const getStudentByParent = async (req, res) => {
    const parentId = req.params.parentId;
    try {
        const [rows] = await pool.query(
            'select hs.MaHocSinh,hs.HoTen,hs.Lop,pp.PointName,pp.DiaChi,pp.TinhTrangDon From hocsinh hs JOIN pickuppoints pp ON pp.MaHocSinh = hs.MaHocSinh WHERE MaPhuHuynh = ?',
            [parentId]
        );
        return res.status(200).json({
            errorCode: 0,
            message: 'OK',
            data: rows,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};
// GET /api/v1/:parentId/notifications
// Lấy thông báo của phụ huynh từ bảng `notifications`
const getNotificationsByParent = async (req, res) => {
    const parentId = req.params.parentId;
    try {
        const [rows] = await pool.query(
            'select Id,LoaiThongBao,NoiDung,ThoiGian,DaDoc from thongbao_phuhuynh WHERE MaPhuHuynh = ? ORDER BY ThoiGian DESC',
            [parentId]
        );
        return res.status(200).json({
            errorCode: 0,
            message: 'OK',
            data: rows,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ errorCode: -1, message: 'Lỗi server.' });
    }
};
export { getStudentByParent, getParentInformation, getNotificationsByParent };