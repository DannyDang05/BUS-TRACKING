

import HeaderDriver from "./Content/HeaderDriver";
import TableRoute from "./Content/TableDriver";
import Snowflakes from "./Content/Snowflakes";
import { Outlet } from "react-router-dom";
const DriverUI = () => {

    return (
        <div className="driver-container">
            <Snowflakes />
            <div className="driver-header">
                <HeaderDriver />
            </div>
            <div className="driver-body">
                <Outlet />
            </div>
        </div>
    );
};
export default DriverUI;