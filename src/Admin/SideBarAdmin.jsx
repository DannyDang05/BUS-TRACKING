
import { FaFacebookSquare } from "react-icons/fa";
import { DiReact } from "react-icons/di";
import 'react-pro-sidebar/dist/css/styles.css';
import { Outlet, Link } from "react-router-dom";
import { FaSignOutAlt, FaHome } from 'react-icons/fa'; 
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';

import { FaMapMarkerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart } from 'react-icons/fa';
import { PiStudentBold } from "react-icons/pi";
import { TbUserFilled } from "react-icons/tb";


const SideBarAdmin = (props) => {
    const { image, collapsed, toggled, } = props;
    return (
        <>
            <ProSidebar 
                collapsed={collapsed}
                width={"200px"}
            >
               
                <SidebarContent>
                    <Menu className="mainpage-container">
                        <MenuItem icon={<FaHome color="#808080" size={"24px"}/>}>
                            <Link to="/">Homepage</Link>
                        </MenuItem>
                    </Menu>
                    <Menu className="map-container">
                        <MenuItem icon={<FaMapMarkerAlt color="#808080" size={"24px"} />}>
                            <Link to="/map">Map</Link>
                        </MenuItem>
                    </Menu>
                    <Menu >
                            <MenuItem className="students-container" icon={<PiStudentBold color="#808080" size={"24px"} />}>
                                <Link to="/students">Students</Link>
                            </MenuItem>
                    </Menu>
                    <Menu>
                            <MenuItem className="drivers-container" icon={<TbUserFilled color="#808080" size={"24px"} />}>
                                <Link to="/drivers">Drivers</Link>
                            </MenuItem>
                    </Menu>
                </SidebarContent>

               
            </ProSidebar>
        </>
    )
}
export default SideBarAdmin;