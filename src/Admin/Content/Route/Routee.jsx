import { Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { IoIosSearch } from "react-icons/io";
import TableRoute from "./TableRoute";
import { useNavigate } from "react-router-dom"
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
const Routee = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const navigate = useNavigate();
    const handleCreate = () => {
        navigate("/Routes/create-Route")
    }
    const handleSearch = (something) => {
        setSearch(something)
    }
    const handleFilter = (something) => {
        setFilter(something)
    }
    return (
        <>
            <div className="total-container">
                <div className="total-box">
                    <div className="title">Total Routes</div>
                    <div className="value">5</div>
                </div>
            </div>
            <div className="body-container">
                <div className="search-bar-container">
                    <TextField
                        variant="outlined"
                        placeholder="Search"
                        size="small"
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <IoIosSearch />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: "300px" }}
                    />
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                        <InputLabel>Filter</InputLabel>
                        <Select
                            value={filter}
                            label="Filter"
                            onChange={(e) => handleFilter(e.target.value)}
                        >
                            <MenuItem value="id">ID</MenuItem>
                            <MenuItem value="name">Name</MenuItem>
                        </Select>
                    </FormControl>

                </div>
                <div className="table-routes">
                    <Button className="create-button" onClick={() => handleCreate()}>
                        <FaPlus className="icon-plus" /> Create
                    </Button>
                    <TableRoute />
                </div>
            </div>

        </>
    )
}
export default Routee