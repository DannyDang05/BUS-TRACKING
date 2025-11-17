import { TextField, Box, Button } from '@mui/material';
import { useState } from 'react';
import { FaSave } from "react-icons/fa";
// BƯỚC 1: IMPORT HOOK VÀ API
import { useNavigate } from 'react-router-dom';
import { createDriver } from '../../services/apiService'; // Import hàm API

const CreateDriverModal = () => {
    const navigate = useNavigate();

    // BƯỚC 2: CẬP NHẬT STATE ĐỂ KHỚP VỚI API
    //
    const [Id, setId] = useState("");
    const [FullName, setFullName] = useState("");
    const [MaBangLai, setMaBangLai] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");

    // BƯỚC 3: CẬP NHẬT HÀM VALIDATION
    const isValid = () => {
        if (Id.trim() === "") return false;
        if (FullName.trim() === "") return false;
        if (MaBangLai.trim() === "") return false;
        if (PhoneNumber.trim() === "") return false;
        
        // Thêm các kiểm tra chi tiết hơn nếu muốn (ví dụ: regex cho SĐT)
        
        return true;
    };

    // BƯỚC 4: TẠO HÀM SUBMIT
    const handleSubmit = async (event) => {
        event.preventDefault(); // Ngăn form submit mặc định

        if (!isValid()) {
            // Có thể hiển thị thông báo lỗi ở đây
            return;
        }

        const driverData = {
            Id,
            FullName,
            MaBangLai,
            PhoneNumber
        };

        try {
            const response = await createDriver(driverData);
            if (response && response.errorCode === 0) {
                // Thành công! Quay lại trang danh sách
                console.log("Tạo tài xế thành công:", response.message);
                navigate("/drivers");
            } else {
                // Hiển thị lỗi từ API (ví dụ: Id bị trùng)
                console.error("Lỗi khi tạo tài xế:", response.message);
                // Bạn nên hiển thị lỗi này cho người dùng (ví dụ: dùng react-toastify)
                alert(`Lỗi: ${response.message}`);
            }
        } catch (error) {
            console.error("Lỗi hệ thống:", error);
            alert("Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.");
        }
    };
    
    return (
        <Box
            component="form"
            className="create-container"
            autoComplete="off"
            onSubmit={handleSubmit} // Thêm hàm submit vào form
        >

            <h2>Thông tin Tài xế</h2>
            {/* BƯỚC 5: CẬP NHẬT CÁC TRƯỜNG INPUT */}
            <TextField
                required
                sx={{ width: '50%' }}
                id="Id"
                name="Id"
                label="Mã Tài Xế (ID)"
                variant="outlined"
                value={Id}
                onChange={(event) => setId(event.target.value)}
            />
            
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
                    type="submit" // Đặt type là "submit"
                    variant="outlined" 
                    disabled={!isValid()} 
                    className='save-button'
                >
                    <FaSave size={"1.5em"} style={{ marginRight: "5px" }} /> Save
                </Button>
            </div>
        </Box>
    );
}

export default CreateDriverModal;