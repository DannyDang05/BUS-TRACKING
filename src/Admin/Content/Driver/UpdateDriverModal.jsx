import { TextField, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSave } from "react-icons/fa";
import { updateDriver } from '../../../service/apiService';

const UpdateDriverModal = ({ driver, onUpdated }) => {
    const [FullName, setFullName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [MaBangLai, setMaBangLai] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (driver) {
            setFullName(driver.FullName || "");
            setPhoneNumber(driver.PhoneNumber || "");
            setMaBangLai(driver.MaBangLai || "");
        }
    }, [driver]);

    const isValid = () => {
        if (FullName.trim() === "") return false;
        if (MaBangLai.trim() === "") return false;
        if (PhoneNumber.trim() === "") return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid() || !driver) return;
        setLoading(true);
        try {
            await updateDriver(driver.Id, { FullName, MaBangLai, PhoneNumber });
            setLoading(false);
            if (onUpdated) onUpdated();
        } catch (err) {
            console.error('Cập nhật tài xế lỗi', err);
            setLoading(false);
        }
    };

    return (
        <Box component="form" className="create-container" autoComplete="off" onSubmit={handleSubmit}>
            <h2>Update Driver</h2>
            <TextField required sx={{ width: '50%' }} id="full-name" name="full-name" label="Full Name" variant="outlined" value={FullName} onChange={(e)=>setFullName(e.target.value)} />
            <TextField required sx={{ width: '50%' }} id="phone" name="phone" label="Phone Number" variant="outlined" value={PhoneNumber} onChange={(e)=>setPhoneNumber(e.target.value)} />
            <TextField required sx={{ width: '50%' }} id="license-number" name="license-number" label="License Number" variant="outlined" value={MaBangLai} onChange={(e)=>setMaBangLai(e.target.value)} />
            <div className='save-button-container'>
                <Button type="submit" variant="outlined" disabled={!isValid() || loading} className='save-button'>
                    <FaSave size={"1.2em"} style={{ marginRight: "5px" }} /> {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>
        </Box>
    );
}

export default UpdateDriverModal;
