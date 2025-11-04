    import { Button } from "@mui/material"
    import TableDriver from "./TableDrivers"
    import { useNavigate } from "react-router-dom"

    import { FaPlus } from "react-icons/fa";
    const Driver = () =>{
        const navigate = useNavigate();
        const handleCreate = () =>{
            navigate("/drivers/create-driver") 
        }
        return (
            <>
            <div className="table-drivers">
                <Button className="create-button" onClick={()=> handleCreate()}>
                    <FaPlus className="icon-plus"/> Create
                </Button>
                <TableDriver/>
            </div>
                
            </>
        )
    }
    export default Driver