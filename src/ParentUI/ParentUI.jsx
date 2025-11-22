

import HeaderParent from "./ParentContent/HeaderParent";

import Snowflakes from "../DriverUI/Content/Snowflakes";
import { Outlet } from "react-router-dom";
const ParentUI = () => {

    return (
        <div className="parent-container">
            <Snowflakes />
            <div className="parent-header">
                <HeaderParent />
            </div>
            <div className="parent-body">
                <Outlet />
            </div>
        </div>
    );
};
export default ParentUI;