import React from 'react';
import { 
    FaBars, 
    FaGlobe, 
    FaMoon, 
    FaCog, 
    FaRedo, 
    FaUserCircle 
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
// 1. Import các component cần thiết
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

// (KHÔNG CẦN useState, useRef, useEffect nữa)

const HeaderAdmin = (props) => {
    const { handleCollapsed } = props;

    // (Tất cả logic state/ref/effect đã được xóa)

    // Hàm logout (nếu cần)
    const handleLogout = (popupState) => {
        console.log("Đang đăng xuất...");
        popupState.close();
        window.location.reload()
    };

    return (
        <div className="header-container">
            <div className="header-left">
                <FaBars className="header-menu-icon" onClick={handleCollapsed} /> 
            </div>

            <div className="header-center">
            </div>

            <div className="header-right">
                {/* ... (Các action item khác) ... */}
                
                <div className="header-action-item">
                    <FaGlobe className="action-icon" />
                    <span className="action-text">ENGLISH</span>
                </div>
                <div className="header-action-item">
                    <FaMoon className="action-icon" />
                </div>
                <div className="header-action-item">
                    <FaCog className="action-icon" />
                </div>
                <div className="header-action-item">
                    <FaRedo className="action-icon" />
                </div>


                {/* 2. Bọc khu vực profile bằng PopupState */}
                <PopupState variant="popover" popupId="user-profile-menu">
                    {(popupState) => (
                        <React.Fragment>
                            
                            {/* 3. ĐÂY LÀ DIV CŨ CỦA BẠN */}
                            {/* Chỉ cần rải bindTrigger vào là nó tự động hoạt động */}
                            <div 
                                className="header-user-profile" 
                                {...bindTrigger(popupState)}
                            >
                                <FaUserCircle className="user-avatar-icon" />
                                <span className="user-name">Jane Doe</span>
                            </div>

                            {/* 4. Dùng <Menu> của MUI và rải bindMenu vào */}
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => handleLogout(popupState)}>
                                    <FaPowerOff size ="1.2em" className="power-off"/> OFF
                                </MenuItem>
                            </Menu>

                        </React.Fragment>
                    )}
                </PopupState>
            </div>
        </div>
    );
}

export default HeaderAdmin;