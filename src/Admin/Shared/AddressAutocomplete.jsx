import React, { useState, useEffect, useRef } from 'react';
import { Box, TextField, Paper, Typography } from '@mui/material';

const MAPBOX_TOKEN = 'pk.eyJ1IjoibGlraWpvb25nMSIsImEiOiJjbWg5eXlyN24wMDFlMnJuNmIxY2kxOTc2In0.KDmPuA2vvdV6G28mpeK4KA';

const AddressAutocomplete = ({ 
  value, 
  onChange, 
  onSelectAddress, 
  label = "Địa chỉ",
  placeholder = "VD: 123 Nguyễn Huệ, Quận 1, TP HCM",
  helperText = "💡 Nhập địa chỉ để tự động lấy tọa độ",
  disabled = false,
  multiline = true,
  rows = 2
}) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);
  const containerRef = useRef(null);

  // Search địa chỉ với Mapbox Geocoding API
  const searchAddress = async (query) => {
    if (!query || query.length < 3) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&country=VN&limit=5&language=vi`
      );
      const data = await response.json();
      
      if (data.features && data.features.length > 0) {
        const newSuggestions = data.features.map(feature => ({
          address: feature.place_name,
          latitude: feature.center[1],
          longitude: feature.center[0]
        }));
        setSuggestions(newSuggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (error) {
      console.error('Error searching address:', error);
      setSuggestions([]);
    }
  };

  // Handle address input change với debounce
  const handleAddressChange = (newValue) => {
    onChange(newValue);
    
    // Clear timeout cũ
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }
    
    // Set timeout mới để search sau 500ms
    const timeout = setTimeout(() => {
      searchAddress(newValue);
    }, 500);
    
    setSearchTimeout(timeout);
  };

  // Chọn địa chỉ từ suggestions
  const handleSelectSuggestion = (suggestion) => {
    onChange(suggestion.address);
    setShowSuggestions(false);
    setSuggestions([]);
    
    // Callback để parent component biết đã chọn địa chỉ và nhận tọa độ
    if (onSelectAddress) {
      onSelectAddress(suggestion);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (searchTimeout) clearTimeout(searchTimeout);
    };
  }, [searchTimeout]);

  return (
    <Box ref={containerRef} sx={{ position: 'relative', width: '100%' }}>
      <TextField
        label={label}
        value={value}
        onChange={(e) => handleAddressChange(e.target.value)}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
        fullWidth
        size="small"
        multiline={multiline}
        rows={multiline ? rows : 1}
        placeholder={placeholder}
        helperText={helperText}
        disabled={disabled}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': { borderColor: '#0097a7' },
            '&:hover fieldset': { borderColor: '#00838f' },
            '&.Mui-focused fieldset': { borderColor: '#0097a7' }
          },
          '& .MuiInputBase-input': { color: '#00838f' }
        }}
      />
      
      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <Paper
          sx={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 1000,
            maxHeight: 300,
            overflow: 'auto',
            mt: 0.5,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            border: '1px solid #00838f'
          }}
        >
          {suggestions.map((suggestion, idx) => (
            <Box
              key={idx}
              onClick={() => handleSelectSuggestion(suggestion)}
              sx={{
                p: 1.5,
                cursor: 'pointer',
                borderBottom: idx < suggestions.length - 1 ? '1px solid #eee' : 'none',
                '&:hover': {
                  bgcolor: '#e0f7fa',
                },
                transition: 'background-color 0.2s'
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500, color: '#00838f' }}>
                📍 {suggestion.address}
              </Typography>
              <Typography variant="caption" sx={{ color: '#666', fontSize: '0.75rem', mt: 0.5, display: 'block' }}>
                📌 {suggestion.latitude.toFixed(6)}, {suggestion.longitude.toFixed(6)}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
};

export default AddressAutocomplete;
