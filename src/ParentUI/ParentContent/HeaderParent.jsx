import {
    FaUserCircle,
    FaInfo
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import React, { useState } from 'react'; // Đã loại bỏ useEffect, useCallback
import './Parent.scss'
import ParentDialogInfo from './ParentDialogInfo';
import { IoNotificationsOutline } from "react-icons/io5";
import { IoIosRefresh } from "react-icons/io";
import ParentNotification from './ParentNotification';

const HeaderParent = (props) => {
    // Chỉ giữ state cho Dialog (sử dụng truyền props)
    const [infoModal, setInfoModal] = useState(false);
    // ĐÃ LOẠI BỎ const [notificationModal, setNotificationModal] = useState(false) vì không cần thiết

    let userName = 'Nguyễn Thị Lan';

    // Hàm giả định cho Refresh
    const handleRefresh = () => {
        // Thực hiện logic làm mới dữ liệu
        console.log("Refreshing data...");
        // window.location.reload(); // Hoặc làm mới dữ liệu cục bộ
    };


    return (
        <div className="parent-container">
            <div className="header-container">
                <div className="header-right">

                    {/* Refresh Button */}
                    <div 
                        className="header-action-item" 
                        role="button" 
                        title="Refresh" 
                        onClick={handleRefresh} // Gắn hàm refresh
                        style={{ cursor: 'pointer' }}
                    >
                        <IoIosRefresh className="action-icon" />
                    </div>

                    {/* KHỐI 1: POPUPSTATE CHO THÔNG BÁO */}
                    <PopupState variant="popover" popupId="notification-menu">
                        {(notificationPopupState) => (
                            <React.Fragment>
                                <div
                                    className="header-action-item"
                                    role="button"
                                    title="Thông báo"
                                    {...bindTrigger(notificationPopupState)} // Gắn trigger
                                    style={{ cursor: 'pointer' }}
                                >
                                    <IoNotificationsOutline className="action-icon" />
                                </div>

                                {/* TRUYỀN POPUPSTATE XUỐNG ĐỂ MỞ MENU */}
                                <ParentNotification popupState={notificationPopupState} />
                            </React.Fragment>
                        )}
                    </PopupState>

                    {/* KHỐI 2: POPUPSTATE CHO PROFILE MENU */}
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
                                    <MenuItem onClick={() => { setInfoModal(true); popupState.close(); }}>
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
            </div>
            {/* Dialog thông tin (Vẫn dùng truyền props truyền thống) */}
            <ParentDialogInfo infoModal={infoModal} setInfoModal={setInfoModal} />
        </div>
    );
};
export default HeaderParent;