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
import { FaPlus, FaRoute } from "react-icons/fa";
import TableRoute from "./TableRoute";
import { useNavigate } from "react-router-dom"
import { useState } from "react";

const Routee = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const navigate = useNavigate();
    
    const handleCreate = () => {
        navigate("/routes/create-route")
    }
    const handleSearch = (something) => {
        setSearch(something)
    }
    const handleFilter = (something) => {
        setFilter(something)
    }
    
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
                Quản Lý Tuyến Đường
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
                    Tổng Tuyến Đường
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
                  placeholder="🔍 Tìm kiếm tuyến đường..."
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
                  <InputLabel>Bộ Lọc</InputLabel>
                  <Select
                    value={filter}
                    label="Bộ Lọc"
                    onChange={(e) => handleFilter(e.target.value)}
                  >
                    <MenuItem value="id">ID</MenuItem>
                    <MenuItem value="name">Tên</MenuItem>
                  </Select>
                </FormControl>
              </Box> */}

              {/* Create Button */}
              <Box>
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
                  <FaPlus /> Thêm Tuyến Đường
                </Button>
              </Box>
            </Card>

            {/* Table */}
            <TableRoute />

            
        </Box>
    )
}

export default Routee