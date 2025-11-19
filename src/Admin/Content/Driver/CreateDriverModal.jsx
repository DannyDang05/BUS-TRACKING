import { TextField, Box, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSave } from "react-icons/fa";
import { createDriver } from '../../../service/apiService';
import { useLanguage } from '../../Shared/LanguageContext';

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

    const { t } = useLanguage();

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
            <h2 className="section-title">❄️ {t('driver')}</h2>
            <TextField
                required
                sx={{ 
                  width: '50%',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0097a7' },
                    '&:hover fieldset': { borderColor: '#00838f' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7' }
                  },
                  '& .MuiInputBase-input': { color: '#00838f' }
                }}
                id="driver-id"
                name="driver-id"
                label={t('MaHocSinh') || 'Driver Id'}
                variant="outlined"
                value={Id}
                onChange={(event) => setId(event.target.value)}
            />

            <TextField
                required
                sx={{ 
                  width: '50%',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0097a7' },
                    '&:hover fieldset': { borderColor: '#00838f' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7' }
                  },
                  '& .MuiInputBase-input': { color: '#00838f' }
                }}
                id="full-name"
                name="full-name"
                label={t('FullName') || 'Full Name'}
                variant="outlined"
                value={FullName}
                onChange={(event) => setFullName(event.target.value)}
            />

            <TextField
                required
                sx={{ 
                  width: '50%',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0097a7' },
                    '&:hover fieldset': { borderColor: '#00838f' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7' }
                  },
                  '& .MuiInputBase-input': { color: '#00838f' }
                }}
                id="phone"
                name="phone"
                label={t('PhoneNumber') || 'Phone Number'}
                variant="outlined"
                value={PhoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value)}
            />

            <TextField
                required
                sx={{ 
                  width: '50%',
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0097a7' },
                    '&:hover fieldset': { borderColor: '#00838f' },
                    '&.Mui-focused fieldset': { borderColor: '#0097a7' }
                  },
                  '& .MuiInputBase-input': { color: '#00838f' }
                }}
                id="license-number"
                name="license-number"
                label={t('MaBangLai') || 'License Number'}
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
                  sx={{
                    borderColor: '#0097a7',
                    color: '#0097a7',
                    background: 'linear-gradient(135deg, #e8f4f8 0%, #d4e8f0 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                      color: 'white',
                      borderColor: '#00838f',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 151, 167, 0.3)'
                    }
                  }}
                >
                    <FaSave size={"1.2em"} className="icon-inline" /> {loading ? t('saving') : t('save')}
                </Button>
            </div>

        </Box>
    );
}

export default CreateDriverModal;
