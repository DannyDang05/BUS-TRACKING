import { TextField, Box, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FaSave } from "react-icons/fa";

const UpdateDriverModal = () => {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [licenseNumber, setLicenseNumber] = useState("");
    const [userID, setUserID] = useState("");

    const isValid = () => {
        if (name.trim() === "") return false;
        if (phone.trim() === "" || !/^\+?(\d{9,12})$/.test(phone.trim())) return false;
        if (licenseNumber.trim() === "") return false;
        if (userID.trim() === "") return false;
        return true;
    };

    return (
        <Box component="form" className="create-container" autoComplete="off">

            <h2>Identity</h2>

            <TextField
                required
                sx={{ width: '50%' }}
                label="Full Name"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                label="Phone Number"
                variant="outlined"
                onChange={(e) => setPhone(e.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                label="License Number"
                variant="outlined"
                onChange={(e) => setLicenseNumber(e.target.value)}
            />

            <h2>User</h2>
            <TextField
                required
                select
                sx={{ width: '50%' }}
                label="User ID"
                value={userID}
                onChange={(e) => setUserID(e.target.value)}
            >
                <MenuItem value="U001">U001 - Nguyen Van A</MenuItem>
                <MenuItem value="U002">U002 - Tran Thi B</MenuItem>
                <MenuItem value="U003">U003 - Le Thi C</MenuItem>
            </TextField>

            <div className='save-button-container'>
                <Button 
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

export default UpdateDriverModal;
