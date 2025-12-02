
import { TextField, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from "react-icons/fa";
import { createDriver } from '../../../service/apiService';
import { toast } from 'react-toastify';

const CreateDriverModal = () => {
    const navigate = useNavigate();
    const [Id, setId] = useState("");
    const [FullName, setFullName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [MaBangLai, setMaBangLai] = useState("");
    const [loading, setLoading] = useState(false);

    const validatePhoneNumber = (phone) => {
        const phoneRegex = /^09\d{8}$/;
        return phoneRegex.test(phone);
    };

    const isValid = () => {
        if (Id.trim() === "") return false;
        if (FullName.trim() === "") return false;
        if (MaBangLai.trim() === "") return false;
        if (PhoneNumber.trim() === "") return false;
        if (!validatePhoneNumber(PhoneNumber)) return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!PhoneNumber.trim()) {
            toast.error('Vui lòng nhập số điện thoại!');
            return;
        }
        if (!validatePhoneNumber(PhoneNumber)) {
            toast.error('Số điện thoại phải bắt đầu bằng 09 và có đúng 10 số!');
            return;
        }
        if (!isValid()) {
            toast.error('Vui lòng điền đầy đủ thông tin!');
            return;
        }
        setLoading(true);
        try {
            await createDriver({ Id, FullName, MaBangLai, PhoneNumber });
            setLoading(false);
            toast.success('Tạo tài xế thành công!');
            navigate('/drivers');
        } catch (err) {
            console.error('Tạo tài xế lỗi', err);
            setLoading(false);
            toast.error(err?.response?.data?.message || 'Tạo tài xế thất bại!');
        }
    };

    return (
        <Box
            component="form"
            className="create-container"
            autoComplete="off"
            onSubmit={handleSubmit}
            sx={{
              background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 8px 32px rgba(0, 151, 167, 0.2)'
            }}
        >
            <h2 className="section-title">❄️ Driver</h2>
            <TextField
                required
                className="create-textfield"
                id="driver-id"
                name="driver-id"
                label="Driver Id"
                variant="outlined"
                value={Id}
                onChange={(event) => setId(event.target.value)}
            />

            <TextField
                required
                className="create-textfield"
                id="full-name"
                name="full-name"
                label="Full Name"
                variant="outlined"
                value={FullName}
                onChange={(event) => setFullName(event.target.value)}
            />

            <TextField
                required
                className="create-textfield"
                id="phone"
                name="phone"
                label="Phone Number"
                variant="outlined"
                value={PhoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
                error={PhoneNumber && !validatePhoneNumber(PhoneNumber)}
                helperText={PhoneNumber && !validatePhoneNumber(PhoneNumber) ? 'Số điện thoại phải bắt đầu 09 và có 10 số' : 'VD: 0912345678'}
            />

            <TextField
                required
                className="create-textfield"
                id="license-number"
                name="license-number"
                label="License Number"
                variant="outlined"
                value={MaBangLai}
                onChange={(event) => setMaBangLai(event.target.value)}
            />

            <div className='save-button-container'>
                <Button 
                  type="submit" 
                  variant="outlined" 
                  disabled={!isValid() || loading} 
                  className='save-button'
                >
                    <FaSave size={"1.2em"} className="icon-inline" /> Save
                </Button>
            </div>
        </Box>
    );
}

export default CreateDriverModal;
