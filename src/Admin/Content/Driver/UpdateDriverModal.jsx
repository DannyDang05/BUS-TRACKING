import { TextField, Box, Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { FaSave } from "react-icons/fa";
import { updateDriver, getDriverById } from '../../../service/apiService';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../Shared/LanguageContext';

const UpdateDriverModal = ({ driver, onUpdated }) => {
  const [driverState, setDriverState] = useState(driver);
  const [FullName, setFullName] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [MaBangLai, setMaBangLai] = useState("");
  const [loading, setLoading] = useState(false);

  const { id } = useParams();

  useEffect(() => {
    if (driver) {
      setDriverState(driver);
      setFullName(driver.FullName || "");
      setPhoneNumber(driver.PhoneNumber || "");
      setMaBangLai(driver.MaBangLai || "");
      return;
    }

    // if mounted as route element with :id, fetch driver
    const load = async () => {
      if (id) {
        try {
          const res = await getDriverById(id);
          const d = res?.data || res;
          console.log('Fetched driver for update:', d);
          setDriverState(d);
          setFullName(d.FullName || "");
          setPhoneNumber(d.PhoneNumber || "");
          setMaBangLai(d.MaBangLai || "");
        } catch (err) {
          console.error('Failed to load driver', err);
        }
      }
    };
    load();
  }, [driver, id]);
  const isValid = () => {
    if (FullName.trim() === "") return false;
    if (MaBangLai.trim() === "") return false;
    if (PhoneNumber.trim() === "") return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid()) {
      toast.error('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    if (!driverState) {
      toast.error('Không tìm thấy tài xế để cập nhật!');
      return;
    }
    setLoading(true);
    try {
      await updateDriver(driverState.Id, { FullName, MaBangLai, PhoneNumber });
      setLoading(false);
      toast.success('Cập nhật tài xế thành công!');
      if (onUpdated) onUpdated();
    } catch (err) {
      setLoading(false);
      toast.error(err?.response?.data?.message || 'Cập nhật tài xế thất bại!');
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
      <h2 className="section-title">❄️ {t('update')} {t('driver')}</h2>
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
        label="Full Name"
        variant="outlined"
        value={FullName}
        onChange={(e) => setFullName(e.target.value)}
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
        label="Phone Number"
        variant="outlined"
        value={PhoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
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
        label="License Number"
        variant="outlined"
        value={MaBangLai}
        onChange={(e) => setMaBangLai(e.target.value)}
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

export default UpdateDriverModal;
