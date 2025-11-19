import React, { useState, useEffect, useCallback } from 'react';
import { 
    FaBars, 
    FaGlobe, 
    FaMoon, 
    FaCog, 
    FaRedo, 
    FaUserCircle 
} from 'react-icons/fa';
import { FaPowerOff } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
// 1. Import các component cần thiết
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { logoutAPI } from '../service/apiService';
import { useLanguage } from './Shared/LanguageContext';

// (KHÔNG CẦN useState, useRef, useEffect nữa)

const HeaderAdmin = (props) => {
    const { handleCollapsed } = props;

    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();
    const [dark, setDark] = useState(localStorage.getItem('site_dark') === '1');
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        // apply theme class to root element
        if (dark) document.documentElement.classList.add('dark-mode'); else document.documentElement.classList.remove('dark-mode');
        localStorage.setItem('site_dark', dark ? '1' : '0');
    }, [dark]);

    const handleToggleLang = () => {
        const newLang = (lang === 'EN' ? 'VI' : 'EN');
        setLang(newLang);
    };
    const handleToggleTheme = () => setDark(d => !d);
    const handleRefresh = () => window.location.reload();
    const handleSettings = () => alert('Settings page not implemented yet');

    const handleLogout = useCallback(async (popupState) => {
        try {
            popupState?.close?.();
            setLoggingOut(true);
            await logoutAPI();
        } catch (err) {
            console.warn('Logout failed', err);
        } finally {
            setLoggingOut(false);
            navigate('/');
            window.location.reload();
        }
    }, [navigate]);

    return (
        <div className="header-container">
            <div className="header-left">
                <FaBars className="header-menu-icon" onClick={handleCollapsed} /> 
            </div>

            <div className="header-center">
            </div>

            <div className="header-right">
                {/* ... (Các action item khác) ... */}
                
                <div className="header-action-item" onClick={handleToggleLang} role="button" title={t('settings')} style={{ cursor: 'pointer' }}>
                    <FaGlobe className="action-icon" />
                    <span className="action-text">{lang === 'EN' ? 'EN' : 'VI'}</span>
                </div>
                <div className="header-action-item" onClick={handleToggleTheme} role="button" title="Toggle theme" style={{ cursor: 'pointer' }}>
                    <FaMoon className="action-icon" />
                </div>
                <div className="header-action-item" onClick={handleSettings} role="button" title={t('settings')} style={{ cursor: 'pointer' }}>
                    <FaCog className="action-icon" />
                </div>
                <div className="header-action-item" onClick={handleRefresh} role="button" title="Refresh" style={{ cursor: 'pointer' }}>
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
                                    <FaPowerOff size ="1.2em" className="power-off"/> {t('logout')}
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