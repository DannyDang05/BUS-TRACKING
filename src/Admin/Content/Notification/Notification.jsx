import React from 'react';
import { useNavigate } from "react-router-dom";
import { useLanguage } from '../../Shared/LanguageContext';
import TableNotification from './TableNotification';
import './Notification.scss';

const Notification = () => {
    const navigate = useNavigate();
    const { t } = useLanguage();

    const handleClickBtnCreateNotification = () => {
        navigate("/notifications/create-notification")
    }

    return (
        <div className='notification-page'>
            <div className="notification-content">
                <div className="table-notifications-content">
                    <div className="btn-notification">
                        <button onClick={handleClickBtnCreateNotification}>{t('create')} {t('notification')}</button>
                    </div>
                    <div className="table-notifications">
                        <TableNotification />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Notification;
