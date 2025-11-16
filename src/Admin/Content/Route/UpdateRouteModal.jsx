import { TextField, Box, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FaSave } from "react-icons/fa";

const UpdateRouteModal = () => {
    const [name, setName] = useState("");
    const [driverID, setDriverID] = useState("");
    const [vehicleID, setVehicleID] = useState("");
    const [status, setStatus] = useState("Active"); // Mặc định Active

    const isValid = () => {
        if (name.trim() === "") return false;
        if (driverID.trim() === "") return false;
        if (vehicleID.trim() === "") return false;
        return true;
    };

    return (
        <Box component="form" className="create-container" autoComplete="off">

            <h2>Route Info</h2>

            <TextField
                required
                sx={{ width: '50%' }}
                label="Route Name"
                variant="outlined"
                onChange={(e) => setName(e.target.value)}
            />

            <h2>Driver</h2>
            <TextField
                required
                select
                sx={{ width: '50%' }}
                label="Driver ID"
                value={driverID}
                onChange={(e) => setDriverID(e.target.value)}
            >
                <MenuItem value="DR001">DR001 - Nguyen Van A</MenuItem>
                <MenuItem value="DR002">DR002 - Tran Thi B</MenuItem>
                <MenuItem value="DR003">DR003 - Le Thi C</MenuItem>
            </TextField>

            <h2>Vehicle</h2>
            <TextField
                required
                select
                sx={{ width: '50%' }}
                label="Vehicle ID"
                value={vehicleID}
                onChange={(e) => setVehicleID(e.target.value)}
            >
                <MenuItem value="VH001">VH001 - Bus 01</MenuItem>
                <MenuItem value="VH002">VH002 - Bus 02</MenuItem>
                <MenuItem value="VH003">VH003 - Bus 03</MenuItem>
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

export default UpdateRouteModal;
