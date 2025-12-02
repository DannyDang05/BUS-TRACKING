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
import { FaPlus, FaGraduationCap } from "react-icons/fa";
import TableStudent from "./TableStudents";
import { useLanguage } from '../../Shared/LanguageContext';
import { useNavigate } from "react-router-dom"
import { useState } from "react";
const Student = (props) => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const [rowSelected,setRowSelected] = useState(false)
    const navigate = useNavigate();
    
    const handleCreate = () => {
        navigate("/students/create-student")
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
              <FaGraduationCap size={32} color="#0097a7" />
              <Typography 
                variant="h5" 
                sx={{ 
                  color: '#0097a7',
                  fontWeight: 'bold',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}
              >
                {t('manage')} {t('studentsLabel')}
              </Typography>
            </Box>

            {/* Create Button */}
            {/* <Box sx={{ marginBottom: '24px' }}>
              <Button 
                onClick={() => handleCreate()}
                sx={{
                  background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)',
                  color: '#fff',
                  borderRadius: '20px',
                  padding: '10px 24px',
                  fontWeight: 'bold',
                  boxShadow: '0 4px 15px rgba(0, 151, 167, 0.3)',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0, 151, 167, 0.4)'
                  }
                }}
              >
                <FaPlus /> {t('addStudent')}
              </Button>
            </Box> */}

            {/* Table */}
            <TableStudent rowSelected={rowSelected} setRowSelected={setRowSelected} />

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
export default Student