import { 
  Button, 
  TextField, 
  InputAdornment, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem,
  Typography,
  Box,
  Card,
  CircularProgress
} from "@mui/material"
import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaRoute } from "react-icons/fa";
import { AutoAwesome } from "@mui/icons-material";
import TableRoute from "./TableRoute";
import AssignDriverModal from "./AssignDriverModal";
import { useLanguage } from '../../Shared/LanguageContext';
import { useNavigate } from "react-router-dom"
import { useState } from "react";
import { toast } from 'react-toastify';

const Routee = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [refreshTrigger, setRefreshTrigger] = useState(0)
    const [assignModalOpen, setAssignModalOpen] = useState(false)
    const [selectedRoute, setSelectedRoute] = useState(null)
    const navigate = useNavigate();
    
    const handleOpenAssignModal = (route) => {
        setSelectedRoute(route);
        setAssignModalOpen(true);
    };

    const handleCloseAssignModal = () => {
        setAssignModalOpen(false);
        setSelectedRoute(null);
    };

    const handleSearch = (something) => {
        setSearch(something)
    }
    const handleFilter = (something) => {
        setFilter(something)
    }
    
    const handleAutoOptimize = async () => {
        setIsOptimizing(true);
        try {
            const token = localStorage.getItem('bus_token'); // FIX: Dùng đúng key
            const response = await fetch('http://localhost:6969/api/v1/routes/auto-optimize', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    saveToDb: true, // FIX: Gửi trong body thay vì query string
                    schoolLocation: { lat: 10.8494, lon: 106.7714 } // Đại học Sài Gòn
                })
            });
            
            const result = await response.json();
            
            if (result && result.errorCode === 0) {
                const routeCount = result.data?.routes?.length || result.data?.totalRoutes || 0;
                toast.success(`✅ Phân tuyến thành công! Đã tạo ${routeCount} tuyến tự động`);
                setRefreshTrigger(prev => prev + 1); // Trigger refresh table
            } else {
                toast.error(result.message || 'Phân tuyến thất bại!');
            }
        } catch (error) {
            console.error('Error optimizing routes:', error);
            toast.error('⚠️ Lỗi khi phân tuyến: ' + error.message);
        } finally {
            setIsOptimizing(false);
        }
    };
    
    const { t } = useLanguage();

    return (
      <Box className="page-body">
            {/* Header with Icon */}
            <Box className="slide-in" sx={{ 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <FaRoute size={32} color="#0097a7" />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#0097a7',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                {t('manage')} {t('routesLabel')}
              </Typography>
            </Box>

            {/* Stats Card */}
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(0, 151, 167, 0.1) 0%, rgba(0, 131, 143, 0.05) 100%)',
              border: '2px solid rgba(0, 151, 167, 0.2)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              boxShadow: '0 4px 15px rgba(0, 151, 167, 0.15)',
              transition: 'all 0.3s ease',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: '0 8px 25px rgba(0, 151, 167, 0.25)'
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Box sx={{ fontSize: '28px' }}>🗺️</Box>
                <Box>
                  <Typography sx={{ color: '#00838f', fontSize: '0.9rem', fontWeight: '500' }}>
                    {t('totalRoutes')}
                  </Typography>
                  <Typography sx={{ color: '#0097a7', fontWeight: 'bold', fontSize: '2rem' }}>
                    6
                  </Typography>
                </Box>
              </Box>
            </Card>

            {/* Search and Filter */}
            <Card sx={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(232, 244, 248, 0.9) 100%)',
              border: '1px solid rgba(0, 151, 167, 0.1)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '24px',
              boxShadow: '0 4px 15px rgba(0, 151, 167, 0.1)'
            }}>
              {/* <Box sx={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
                marginBottom: '16px'
              }}>
                <TextField
                  variant="outlined"
                  placeholder={`🔍 ${t('searchPlaceholder')}`}
                  size="small"
                  value={search}
                  onChange={(e) => handleSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoIosSearch />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ 
                    width: "300px",
                    '& .MuiOutlinedInput-root': {
                      borderColor: '#0097a7',
                      '&:hover fieldset': {
                        borderColor: '#00838f'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#0097a7'
                      }
                    }
                  }}
                />
                <FormControl size="small" sx={{ minWidth: 150 }}>
                  <InputLabel>{t('filterLabel')}</InputLabel>
                  <Select
                    value={filter}
                    label={t('filterLabel')}
                    onChange={(e) => handleFilter(e.target.value)}
                  >
                    <MenuItem value="id">{t('idLabel')}</MenuItem>
                    <MenuItem value="name">{t('nameLabel')}</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Button 
                  onClick={handleAutoOptimize}
                  disabled={isOptimizing}
                  sx={{
                    background: isOptimizing 
                      ? 'linear-gradient(135deg, #ccc 0%, #999 100%)' 
                      : 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '10px 24px',
                    fontWeight: 'bold',
                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    '&:hover': {
                      transform: isOptimizing ? 'none' : 'translateY(-2px)',
                      boxShadow: isOptimizing ? '0 4px 15px rgba(255, 107, 107, 0.3)' : '0 6px 20px rgba(255, 107, 107, 0.4)'
                    },
                    '&:disabled': {
                      color: '#fff',
                      opacity: 0.7
                    }
                  }}
                >
                  {isOptimizing ? (
                    <>
                      <CircularProgress size={20} sx={{ color: '#fff' }} /> 
                      Đang phân tuyến...
                    </>
                  ) : (
                    <>
                      <AutoAwesome /> 
                      Phân Tuyến Tự Động
                    </>
                  )}
                </Button>
              </Box>
            </Card>

            {/* Table */}
            <TableRoute 
              refreshTrigger={refreshTrigger} 
              onAssignDriver={handleOpenAssignModal}
            />

            {/* Assign Driver Modal */}
            <AssignDriverModal
              open={assignModalOpen}
              onClose={handleCloseAssignModal}
              route={selectedRoute}
              onRefresh={() => setRefreshTrigger(prev => prev + 1)}
            />
        </Box>
    )
}

export default Routee