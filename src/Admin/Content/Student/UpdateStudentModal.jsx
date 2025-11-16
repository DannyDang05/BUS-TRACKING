import { TextField, Box, Button, MenuItem } from '@mui/material';
import { useState } from 'react';
import { FaSave } from "react-icons/fa";

const UpdateStudentModal = () => {
    const [name, setName] = useState("");
    const [grade, setGrade] = useState("");
    const [parentId, setParentId] = useState("");
    const [pickupPoint, setPickupPoint] = useState("");

    const isValid = () => {
        if (name.trim() === "") return false;
        if (grade.trim() === "") return false;
        if (parentId.trim() === "") return false;
        if (pickupPoint.trim() === "") return false;
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
                label="Class"
                variant="outlined"
                onChange={(e) => setGrade(e.target.value)}
            />

            <h2>Parent</h2>
            <TextField
                required
                select
                sx={{ width: '50%' }}
                label="Parent ID"
                value={parentId}
                onChange={(e) => setParentId(e.target.value)}
            >
                <MenuItem value="PH001">PH001</MenuItem>
                <MenuItem value="PH002">PH002</MenuItem>
                <MenuItem value="PH003">PH003</MenuItem>
            </TextField>

            <h2>Pickup Point</h2>
            <TextField
                required
                select
                sx={{ width: '50%' }}
                label="Pickup Point"
                value={pickupPoint}
                onChange={(e) => setPickupPoint(e.target.value)}
            >
                <MenuItem value="DP01">Điểm đón 01</MenuItem>
                <MenuItem value="DP02">Điểm đón 02</MenuItem>
                <MenuItem value="DP03">Điểm đón 03</MenuItem>
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

export default UpdateStudentModal;
