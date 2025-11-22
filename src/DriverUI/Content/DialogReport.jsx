
import React from 'react'; // Cần React cho JSX/Component
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Stack,
    Typography,
    IconButton,
    TextField,
    Select,
    FormControl,
    InputLabel,
    MenuItem // Cần cho các lựa chọn trong Select
} from "@mui/material";

// Icons
import CloseIcon from '@mui/icons-material/Close';
const DialogReport = (props) => {

    const {
        openReport,
        setOpenReport,
        issueType,
        setIssueType,
        description,
        setDescription,
        handleCloseReport,
        handleSubmitReport,
        issueTypes,
    } = props;
    return (

        <Dialog
            open={openReport}
            onClose={handleCloseReport}
            maxWidth="sm"
            fullWidth
        >
            {/* Header màu đỏ như trong hình */}
            <DialogTitle sx={{ backgroundColor: 'error.main', color: 'white', py: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6">Gửi báo cáo sự cố</Typography>
                    <IconButton onClick={handleCloseReport} sx={{ color: 'white' }}>
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <DialogContent dividers sx={{ pt: 2 }}>

                {/* Chọn loại sự cố */}
                <FormControl fullWidth margin="normal" size="small">
                    <InputLabel>Chọn loại sự cố</InputLabel>
                    <Select
                        value={issueType}
                        label="Chọn loại sự cố"
                        onChange={(e) => setIssueType(e.target.value)}
                    >
                        {issueTypes.map((type) => (
                            <MenuItem key={type} value={type}>{type}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                {/* Mô tả chi tiết */}
                <TextField
                    margin="normal"
                    label="Mô tả chi tiết"
                    multiline
                    rows={4}
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Nhập mô tả sự cố..."
                />

            </DialogContent>

            <DialogActions sx={{ p: 2, justifyContent: 'center' }}>
                <Stack direction="row" spacing={2}>
                    {/* Nút HỦY (Màu đỏ/Màu xám) */}
                    <Button
                        onClick={handleCloseReport}
                        variant="contained"
                        color="error"
                    >
                        Hủy
                    </Button>
                    {/* Nút GỬI (Màu xanh lá) */}
                    <Button
                        onClick={handleSubmitReport}
                        variant="contained"
                        color="success"
                        disabled={!issueType || !description} // Vô hiệu hóa nếu form chưa đầy đủ
                    >
                        Gửi
                    </Button>
                </Stack>
            </DialogActions>

        </Dialog>

    )
}
export default DialogReport