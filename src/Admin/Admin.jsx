import SideBarAdmin from "./SideBarAdmin"
import { FaBars } from "react-icons/fa";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import './Admin.scss'
import HeaderAdmin from "./HeaderAdmin"; // Giả sử bạn import HeaderAdmin
import Snowflakes from './Shared/Snowflakes';

const Admin = (props) => {
    const [collapsed, setCollapsed] = useState(false)
    const handleCollapsed = () => {
        setCollapsed(!collapsed)
    }
    return (
        <div className="admin-container">

            <Snowflakes />

            <div className="admin-header">
                <HeaderAdmin 
                handleCollapsed = {handleCollapsed}
                />
            </div>
            <div className="admin-body-container">
                <div className={`admin-sidebar ${collapsed ? "collapsed" : ""} `}>
                    <SideBarAdmin
                        collapsed={collapsed}
                    />
                </div>

                <div className="admin-content">
                    <div className="admin-main">
                        <Outlet context={{ collapsed: collapsed }} />
                    </div>
                </div>

            </div>
        </div>
    )
}
export default Admin