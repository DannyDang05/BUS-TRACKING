
import HeaderDriver from "./HeaderDriver"
import TableRoute from "./TableDriver"

const DriverUI = () =>{
    return (
        <div className="driver-container">
            <div className="driver-header">
                <HeaderDriver/>
            </div>
            <div className="driver-table">
                <TableRoute/>
            </div>
        </div>
    )
}
export default DriverUI