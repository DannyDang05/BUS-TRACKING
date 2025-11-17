import { TextField, Box, Button, CircularProgress, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSave } from "react-icons/fa";
// BƯỚC 1: IMPORT CÁC HOOKS VÀ API CẦN THIẾT
import { useNavigate, useParams } from 'react-router-dom';
import { getDriverById, updateDriver } from '../../services/apiService'; // Import 2 hàm API

const UpdateDriverModal = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Lấy 'id' từ URL (ví dụ: /drivers/update-driver/TX001)

    // BƯỚC 2: CẬP NHẬT STATE (Tương tự Create, nhưng không cần 'Id')
    const [FullName, setFullName] = useState("");
    const [MaBangLai, setMaBangLai] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");

    // Thêm state cho việc tải dữ liệu
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // BƯỚC 3: LẤY DỮ LIỆU TÀI XẾ KHI COMPONENT ĐƯỢC TẢI
    useEffect(() => {
        const fetchDriverData = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await getDriverById(id); // Gọi API lấy chi tiết
                
                if (response && response.errorCode === 0) {
                    // Điền dữ liệu vào state
                    const driver = response.data;
                    setFullName(driver.FullName);
                    setMaBangLai(driver.MaBangLai);
                    setPhoneNumber(driver.PhoneNumber);
                } else {
                    setError(response.message || "Không tìm thấy tài xế.");
                }
            } catch (err) {
                setError("Lỗi khi tải dữ liệu: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverData();
    }, [id]); // Phụ thuộc vào 'id', nếu id thay đổi, fetch lại

    // BƯỚC 4: CẬP NHẬT HÀM VALIDATION
    const isValid = () => {
        if (FullName.trim() === "") return false;
        if (MaBangLai.trim() === "") return false;
        if (PhoneNumber.trim() === "") return false;
        return true;
    };

    // BƯỚC 5: CẬP NHẬT HÀM SUBMIT
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!isValid()) {
            return;
        }

        const driverData = {
            FullName,
            MaBangLai,
            PhoneNumber
        };

        try {
            // Gọi API cập nhật
            const response = await updateDriver(id, driverData); 
            
            if (response && response.errorCode === 0) {
                console.log("Cập nhật tài xế thành công:", response.message);
                navigate("/drivers"); // Quay lại trang danh sách
            } else {
                alert(`Lỗi: ${response.message}`);
            }
        } catch (error) {
            console.error("Lỗi hệ thống:", error);
            alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
        }
    };

    // Xử lý hiển thị khi đang tải hoặc lỗi
    if (loading) {
        return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
    }

    if (error) {
        return <Typography color="error" sx={{ padding: '16px' }}>{error}</Typography>;
    }

    return (
        <Box
            component="form"
            className="create-container"
            autoComplete="off"
            onSubmit={handleSubmit}
        >

            {/* BƯỚC 6: CẬP NHẬT CÁC TRƯỜNG INPUT */}
            <h2>Cập nhật thông tin Tài xế (ID: {id})</h2>
            {/* Không cho phép sửa ID */}
            
            <TextField
                required
                sx={{ width: '50%' }}
                id="FullName"
                name="FullName"
                label="Họ và Tên"
                variant="outlined"
                value={FullName}
                onChange={(event) => setFullName(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="PhoneNumber"
                name="PhoneNumber"
                label="Số Điện Thoại"
                variant="outlined"
                value={PhoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
            />
            
            <h2>Giấy phép</h2>
            <TextField
                required
                sx={{ width: '50%' }}
                id="MaBangLai"
                name="MaBangLai"
                label="Mã Bằng Lái"
                variant="outlined"
                value={MaBangLai}
                onChange={(event) => setMaBangLai(event.target.value)}
            />
            
            {/* Đã xóa các trường email, password, license class */}

            <div className='save-button-container'>
                <Button 
                    type="submit"
                    variant="outlined" 
                    disabled={!isValid()} 
                    className='save-button'
                >
                    <FaSave size={"1.5em"} style={{ marginRight: "5px" }} /> Cập Nhật
                </Button>
            </div>
        </Box>
    );
}

export default UpdateDriverModal;