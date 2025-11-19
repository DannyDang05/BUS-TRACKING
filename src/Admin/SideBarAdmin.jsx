
import { FaFacebookSquare } from "react-icons/fa";
import { DiReact } from "react-icons/di";
import 'react-pro-sidebar/dist/css/styles.css';
import { Outlet, Link } from "react-router-dom";
import { FaSignOutAlt, FaHome , FaBusAlt } from 'react-icons/fa'; 
import { FaRoute } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';

import { useLanguage } from './Shared/LanguageContext';

import { FaMapMarkerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import { PiStudentBold } from "react-icons/pi";
import { TbUserFilled } from "react-icons/tb";


const SideBarAdmin = (props) => {
    const { image, collapsed, toggled, } = props;
    const { t } = useLanguage();

    return (
        <>
            <ProSidebar 
                collapsed={collapsed}
                width={"200px"}
            >
               
                <SidebarContent>
                    <Menu className="mainpage-container">
                        <MenuItem icon={<FaHome color="#00838f" size={"24px"}/>}> 
                            <Link to="/">{t('homepage')}</Link>
                        </MenuItem>
                    </Menu>
                    <Menu className="map-container">
                        <MenuItem icon={<FaMapMarkerAlt color="#00838f" size={"24px"} />}>
                            <Link to="/map">{t('map')}</Link>
                        </MenuItem>
                    </Menu>
                    <Menu >
                            <MenuItem className="student-container" icon={<PiStudentBold color="#00838f" size={"24px"} />}>
                                <Link to="/students">{t('student')}</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="driver-container" icon={<TbUserFilled color="#00838f" size={"24px"} />}>
                                <Link to="/drivers">{t('driver')}</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="route-container" icon={<FaRoute color="#00838f" size={"24px"} />}>
                                <Link to="/routes">{t('route')}</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="calendar-container" icon={<FaRegCalendarAlt color="#00838f" size={"24px"} />}>
                                <Link to="/calendars">{t('calendar')}</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="bus-container" icon={<FaBusAlt color="#00838f" size={"24px"} />}>
                                <Link to="/buses">{t('bus')}</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="notification-container" icon={<IoMdNotifications color="#00838f" size={"24px"} />}>
                                <Link to="/notification">{t('notification')}</Link>
                            </MenuItem>
                    </Menu>
                </SidebarContent>

               
            </ProSidebar>
        </>
    )
}
export default SideBarAdmin;