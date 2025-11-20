import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";

const DialogInfo = ({ infoModal, setInfoModal, selectedDriver }) => {
  const handleClose = () => setInfoModal(false);

  return (
    <Dialog
      open={infoModal}
      onClose={handleClose}
      aria-labelledby="driver-info-dialog"
    >
      <DialogTitle id="driver-info-dialog">Thông tin tài xế</DialogTitle>

      <DialogContent dividers>
        {selectedDriver ? (
          <>
            <Typography><strong>ID:</strong> {selectedDriver.Id}</Typography>
            <Typography><strong>Họ tên:</strong> {selectedDriver.FullName}</Typography>
            <Typography><strong>Mã bằng lái:</strong> {selectedDriver.MaBangLai}</Typography>
            <Typography><strong>Số điện thoại:</strong> {selectedDriver.PhoneNumber}</Typography>
          </>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogInfo;
