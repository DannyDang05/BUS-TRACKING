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
    const [infoModal, setInfoModal] = useState(false);
    // Lấy tên user từ localStorage
    let userName = 'Jane Doe';
    try {
      const user = JSON.parse(localStorage.getItem('bus_user'));
      if (user && user.fullName) userName = user.fullName;
      else if (user && user.username) userName = user.username;
    } catch {}
    return (
        <div className="header-container">
            <div className="header-right">
                <div className="header-action-item" role="button" title="Refresh" style={{ cursor: 'pointer' }}>
                    <FaRedo className="action-icon" />
                </div>
                <PopupState variant="popover" popupId="user-profile-menu">
                    {(popupState) => (
                        <React.Fragment>
                            <div
                                className="header-user-profile"
                                {...bindTrigger(popupState)}
                            >
                                <FaUserCircle className="user-avatar-icon" />
                                <span className="user-name">{userName}</span>
                            </div>
                            <Menu {...bindMenu(popupState)}>
                                <MenuItem onClick={() => setInfoModal(true)}>
                                    <FaInfo size="1.2em" className="power-off" /> Thông tin
                                </MenuItem>
                                <MenuItem /* onClick={() => handleLogout(popupState)} */>
                                    <FaPowerOff size="1.2em" className="power-off" /> Đăng xuất
                                </MenuItem>
                            </Menu>
                        </React.Fragment>
                    )}
                </PopupState>
            </div>
            <DialogInfo infoModal={infoModal} setInfoModal={setInfoModal} />
        </div>
    );
};
export default HeaderDriver;