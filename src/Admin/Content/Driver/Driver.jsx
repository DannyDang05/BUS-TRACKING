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
  Card
} from "@mui/material"
import { IoIosSearch } from "react-icons/io";
import { FaPlus, FaHeadset } from "react-icons/fa";
import TableDriver from "./TableDrivers"
import { useLanguage } from '../../Shared/LanguageContext';
import { useNavigate } from "react-router-dom"
import { useState } from "react";

const Driver = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const navigate = useNavigate();
    
    const handleCreate = () => {
        navigate("/drivers/create-driver")
    }
    const handleSearch = (something) => {
        setSearch(something)
    }
    const handleFilter = (something) => {
        setFilter(something)
    }
    
    const { t } = useLanguage();

    return (
      <Box className="page-body">
            {/* Header with Icon */}
            <Box sx={{ 
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              animation: 'slideIn 0.5s ease'
            }}>
              <FaHeadset size={32} color="#0097a7" />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#0097a7',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                {t('manage')} {t('driversLabel')}
              </Typography>
            </Box>

            {/* Table */}
            <TableDriver />

            <style>{`
              @keyframes slideIn {
                from {
                  opacity: 0;
                  transform: translateX(-20px);
                }
                to {
                  opacity: 1;
                  transform: translateX(0);
                }
              }
            `}</style>
        </Box>
    )
}

export default Driver