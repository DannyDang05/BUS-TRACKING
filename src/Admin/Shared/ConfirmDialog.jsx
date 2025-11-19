import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

const ConfirmDialog = ({ open, title = 'Xác nhận', message = 'Bạn có chắc không?', onClose }) => {
  const handleClose = (result) => {
    if (onClose) onClose(result);
  };

  return (
    <Dialog open={!!open} onClose={() => handleClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)', color: 'white' }}>{title}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => handleClose(false)} sx={{ color: '#00838f' }}>Hủy</Button>
        <Button onClick={() => handleClose(true)} variant="contained" sx={{ background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', color: 'white' }}>Xóa</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
