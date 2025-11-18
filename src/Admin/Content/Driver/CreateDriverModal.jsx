import { TextField, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from "react-icons/fa";
import { createDriver } from '../../../service/apiService';

const CreateDriverModal = ({ onCreated } = {}) => {
    const navigate = useNavigate();
    const [Id, setId] = useState("");
    const [FullName, setFullName] = useState("");
    const [PhoneNumber, setPhoneNumber] = useState("");
    const [MaBangLai, setMaBangLai] = useState("");
    const [loading, setLoading] = useState(false);

    const isValid = () => {
        if (Id.trim() === "") return false;
        if (FullName.trim() === "") return false;
        if (MaBangLai.trim() === "") return false;
        if (PhoneNumber.trim() === "") return false;
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isValid()) return;
        setLoading(true);
        try {
            await createDriver({ Id, FullName, MaBangLai, PhoneNumber });
            setLoading(false);
            if (onCreated) onCreated();
            navigate('/drivers');
        } catch (err) {
            console.error('Tạo tài xế lỗi', err);
            setLoading(false);
        }
    };

    return (
        <Box
            component="form"
            className="create-container"
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <h2>Driver</h2>
            <TextField
                required
                sx={{ width: '50%' }}
                id="driver-id"
                name="driver-id"
                label="Driver Id"
                variant="outlined"
                value={Id}
                onChange={(event) => setId(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="full-name"
                name="full-name"
                label="Full Name"
                variant="outlined"
                value={FullName}
                onChange={(event) => setFullName(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="phone"
                name="phone"
                label="Phone Number"
                variant="outlined"
                value={PhoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="license-number"
                name="license-number"
                label="License Number"
                variant="outlined"
                value={MaBangLai}
                onChange={(event) => setMaBangLai(event.target.value)}
            />

            <div className='save-button-container'>
                <Button type="submit" variant="outlined" disabled={!isValid() || loading} className='save-button'>
                    <FaSave size={"1.2em"} style={{ marginRight: "5px" }} /> {loading ? 'Saving...' : 'Save'}
                </Button>
            </div>

        </Box>
    );
}

export default CreateDriverModal;
