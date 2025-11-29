import React, { useEffect, useState } from "react";
import { 
  Dialog, DialogTitle, DialogContent, DialogActions, Button, 
  Typography, Box, Divider, Stack, Chip, CircularProgress, Avatar 
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import { getChildrenRoutes, getParentInfo } from '../../service/apiService';

const ParentDialogInfo = ({ infoModal, setInfoModal }) => {
  const handleClose = () => setInfoModal(false);
  
  const [parentData, setParentData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Lấy parentId từ localStorage
  const user = JSON.parse(localStorage.getItem('bus_user'));
  const parentId = user?.profileId || null;

  useEffect(() => {
    if (infoModal && parentId) {
      fetchParentData();
    }
  }, [infoModal, parentId]);

  const fetchParentData = async () => {
    try {
      setLoading(true);
      
      // Fetch parent info and children in parallel
      const [parentInfoRes, childrenRes] = await Promise.all([
        getParentInfo(parentId),
        getChildrenRoutes(parentId)
      ]);
      
      const parentInfo = parentInfoRes.data || {};
      const children = childrenRes.data || [];
      
      // Get unique children list
      const uniqueChildren = children.reduce((acc, curr) => {
        if (!acc.find(c => c.MaHocSinh === curr.MaHocSinh)) {
          acc.push(curr);
        }
        return acc;
      }, []);

      setParentData({
        ...parentInfo,
        Children: uniqueChildren
      });
    } catch (err) {
      console.error('❌ Error fetching parent data:', err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog
      open={infoModal}
      onClose={handleClose}
      aria-labelledby="parent-info-dialog"
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f5f9ff 100%)'
        }
      }}
    >
      <DialogTitle 
        id="parent-info-dialog" 
        sx={{ 
          background: 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          py: 2.5
        }}
      >
        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.3)' }}>
          <PersonIcon />
        </Avatar>
        <Typography variant="h6" fontWeight="600">
          Thông tin phụ huynh
        </Typography>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 3 }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : parentData ? (
          <Stack spacing={3}>
            {/* Basic Info */}
            <Box>
              <Typography variant="h6" color="primary" gutterBottom>
                Thông tin cá nhân
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <PersonIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Họ và tên
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {parentData.FullName}
                    </Typography>
                  </Box>
                </Stack>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <PhoneIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Số điện thoại
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {parentData.PhoneNumber}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <EmailIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Tài khoản
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {parentData.Username || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>

                <Stack direction="row" spacing={2} alignItems="center">
                  <HomeIcon color="action" />
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Mã phụ huynh
                    </Typography>
                    <Typography variant="body1" fontWeight="500">
                      {parentData.Id || 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Stack>
            </Box>

            <Divider />

            {/* Children Info */}
            <Box>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <ChildCareIcon color="primary" />
                <Typography variant="h6" color="primary">
                  Danh sách con
                </Typography>
                <Chip 
                  label={`${parentData.Children?.length || 0} con`}
                  size="small"
                  color="primary"
                />
              </Stack>

              {parentData.Children && parentData.Children.length > 0 ? (
                <Stack spacing={2}>
                  {parentData.Children.map((child) => (
                    <Box 
                      key={child.MaHocSinh}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        background: 'white',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                        border: '1px solid #E3F2FD'
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Box>
                          <Typography variant="body1" fontWeight="600" color="primary.dark">
                            {child.StudentName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            Mã HS: {child.MaHocSinh} | Lớp: {child.Class}
                          </Typography>
                        </Box>
                        <Stack direction="row" spacing={1}>
                          {child.RouteName && (
                            <Chip 
                              label={`🚌 ${child.RouteName}`}
                              size="small"
                              color="info"
                              variant="outlined"
                            />
                          )}
                          {child.LicensePlate && (
                            <Chip 
                              label={child.LicensePlate}
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          )}
                          {child.PickupStatus && (
                            <Chip 
                              label={child.PickupStatus}
                              size="small"
                              color={
                                child.PickupStatus === 'Đã đón' ? 'success' : 
                                child.PickupStatus === 'Vắng mặt' ? 'error' : 
                                'warning'
                              }
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  Chưa có thông tin con
                </Typography>
              )}
            </Box>
          </Stack>
        ) : (
          <Typography>Không có dữ liệu</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button 
          onClick={handleClose} 
          variant="contained"
          color="primary"
          sx={{ borderRadius: 2, px: 3 }}
        >
          Đóng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ParentDialogInfo;