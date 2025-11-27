import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";
// Import thêm Icon để tăng tính thẩm mỹ
import LocalShippingIcon from '@mui/icons-material/LocalShipping'; 

const DialogInfo = ({ infoModal, setInfoModal}) => {
  const handleClose = () => setInfoModal(false);
  const selectedDriver = {
    Id: "TX-007",
    FullName: "Lê Văn Tám",
    MaBangLai: "DL123456789",
    PhoneNumber: "0987 654 321",
  };
  return (
    <Dialog
      open={infoModal}
      onClose={handleClose}
      aria-labelledby="driver-info-dialog"
      // Thêm maxWidth để dialog không quá rộng
      maxWidth="sm" 
      fullWidth 
    >
      {/* Thêm icon, căn chỉnh giữa và dùng màu Primary cho tiêu đề */}
      <DialogTitle id="driver-info-dialog" sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, // Khoảng cách giữa icon và chữ
        color: 'primary.main' // Dùng màu chủ đạo của theme
      }}>
        <LocalShippingIcon fontSize="medium" />
        Thông tin tài xế
      </DialogTitle>

      <DialogContent dividers>
        {selectedDriver ? (
          <>
            {/* Sử dụng sx prop để thêm Margin-Bottom (mb) tạo khoảng cách giữa các dòng */}
            <Typography variant="body1" sx={{ mb: 1.5 }}>
                {/* Dùng Box để căn chỉnh nhãn (ID, Họ tên) và tạo khoảng cách đẹp hơn */}
                <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: '120px', display: 'inline-block' }}>ID:</Box>
                {selectedDriver.Id}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: '120px', display: 'inline-block' }}>Họ tên:</Box>
                {selectedDriver.FullName}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: '120px', display: 'inline-block' }}>Mã bằng lái:</Box>
                {selectedDriver.MaBangLai}
            </Typography>
            <Typography variant="body1" sx={{ mb: 1.5 }}>
                <Box component="span" sx={{ fontWeight: 'bold', color: 'text.secondary', minWidth: '120px', display: 'inline-block' }}>Số điện thoại:</Box>
                {selectedDriver.PhoneNumber}
            </Typography>
          </>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </DialogContent>

      <DialogActions>
        {/* Dùng variant="outlined" và color="error" để nút Đóng nổi bật hơn */}
        <Button onClick={handleClose} color="error" variant="outlined">
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogInfo;