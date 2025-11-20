

import HeaderDriver from "./HeaderDriver";
import TableRoute from "./TableDriver";
import Snowflakes from "./Snowflakes";

const DriverUI = () => {
    return (
        <div className="driver-container">
            <Snowflakes />
            <div className="driver-header">
                <HeaderDriver />
            </div>
            <div className="driver-table">
                <TableRoute />
            </div>
        </div>
    );
};
export default DriverUI;