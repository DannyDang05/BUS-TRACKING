import {
    FaRedo,
    FaUserCircle,
    FaInfo
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React, { useState, useEffect, useCallback } from 'react';
import './Driver.scss'
import DialogInfo from './DialogInfo';

const HeaderDriver = (props) => {
    const [infoModal,setInfoModal] = useState(false)
    return (
        <div className="header-container">
            <div className="header-right">
                <div className="header-action-item" role="button" title="Refresh" style={{ cursor: 'pointer' }}>
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
                                <MenuItem onClick={() => setInfoModal(true)}>
                                    <FaInfo size="1.2em" className="power-off" /> Thông tin
                                </MenuItem>
                                <MenuItem onClick={() => handleLogout(popupState)}>
                                    <FaPowerOff size="1.2em" className="power-off" /> Đăng xuất
                                </MenuItem>
                            </Menu>

                        </React.Fragment>
                    )}
                </PopupState>
            </div>
            <DialogInfo infoModal={infoModal}/>
        </div>
    );
}
export default HeaderDriver