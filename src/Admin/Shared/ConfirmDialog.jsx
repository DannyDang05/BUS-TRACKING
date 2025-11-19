import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';
import { useLanguage } from './LanguageContext';

const ConfirmDialog = ({ open, title, message, onClose }) => {
  const { t } = useLanguage();
  const handleClose = (result) => {
    if (onClose) onClose(result);
  };

  const dialogTitle = title || t('confirmTitle');
  const dialogMessage = message || t('confirmDeleteMessage');

  return (
    <Dialog open={!!open} onClose={() => handleClose(false)} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ background: 'linear-gradient(135deg, #0097a7 0%, #00838f 100%)', color: 'white' }}>{dialogTitle}</DialogTitle>
      <DialogContent>
        <Typography sx={{ mt: 1 }}>{dialogMessage}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => handleClose(false)} sx={{ color: '#00838f' }}>{t('cancel')}</Button>
        <Button onClick={() => handleClose(true)} variant="contained" sx={{ background: 'linear-gradient(135deg, #d32f2f 0%, #c62828 100%)', color: 'white' }}>{t('delete')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
