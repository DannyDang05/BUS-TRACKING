import { TextField, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSave, FaSleigh } from "react-icons/fa";
const UpdateRouteModal = () => {
    const [name, setName] = useState("")
    const [phone, setPhone] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassWord] = useState("")
    const [licenseNumber, setLicenseNumber] = useState("")
    const [licenseClass, setLicenseClass] = useState("")

    const isValid = () => {
        if (name.trim() === "") {
            return false;
        }
        if (phone.trim() === "") {
            return false;
        } else if (!/^\+?(\d{9,12})$/.test(phone.trim())) {
            return false;
        }
        if (email.trim() === "") {
            return false;
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            return false;
        }
        if (password === "") {
            return false;
        } else if (password.length < 8) {
            return false;
        }
        if (confirmPassword ===""){
            return false;
        }else if (confirmPassword != password){
            return false;
        }
        if (licenseNumber.trim() === "") {
            return false;
        }

        if (licenseClass.trim() === "") {
            return false
        }
    return true;

    }
    
    return (
        <Box
            component="form"
            className="create-container"
            autoComplete="off"
        >

            {/* Mỗi TextField là một hàng */}
            <h2>Identity</h2>
            <TextField
                required
                sx={{ width: '50%' }}
                id="name"
                name="name"
                label="Full Name"
                variant="outlined"
                onChange={(event)=>setName(event.target.value)}

            />
            
            <TextField
                required
                sx={{ width: '50%' }}
                id="phone"
                name="phone"
                label="Phone Number"
                variant="outlined"
                onChange={(event)=>setPhone(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="email"
                name="email"
                label="Email"
                type="email"
                variant="outlined"
                onChange={(event)=>setEmail(event.target.value)}
            />
            <h2>Password</h2>
            <div className='password-container'>
            <TextField
                required
                sx={{ width: '20%' }}
                id="password"
                name="password"
                label="Password"
                type="password"
                variant="outlined"
                onChange={(event)=>setPassword(event.target.value)}
            />
            <TextField
                required
                sx={{ width: '20%' }}
                id="confirm password"
                name="confirm password"
                label="Confirm Password"
                type="password"
                variant="outlined"
                onChange={(event)=>setConfirmPassWord(event.target.value)}
            />
            </div>
            <h2>License</h2>
            <TextField
                required
                sx={{ width: '50%' }}
                id="license_number"
                name="license_number"
                label="License Number"
                variant="outlined"
                onChange={(event)=>setLicenseNumber(event.target.value)}
            />

            <TextField
                required
                sx={{ width: '50%' }}
                id="vehicle_permit"
                name="vehicle_permit"
                label="Licence Class"
                variant="outlined"
                onChange={(event)=>setLicenseClass(event.target.value)}
            />
            <div className='save-button-container'>
                <Button variant="outlined" disabled={!isValid()} className='save-button'>
                    <FaSave size={"1.5em"} style={{ marginRight: "5px" }} /> Save
                </Button>

            </div>
        </Box>
    );
}

export default UpdateRouteModal;