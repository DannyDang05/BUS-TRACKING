import { Button, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from "@mui/material"
import { IoIosSearch } from "react-icons/io";
import TableStudent from "./TableStudents";
import { useNavigate } from "react-router-dom"
import { useState } from "react";

import { FaPlus } from "react-icons/fa";
const Student = () => {
    const [search, setSearch] = useState("")
    const [filter, setFilter] = useState("id")
    const navigate = useNavigate();
    const handleCreate = () => {
        navigate("/students/create-student")
    }
    const handleSearch = (something) => {
        setSearch(something)
    }
    const handleFilter = (something) => {
        setFilter(something)
    }
    return (
        <>
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
            <div className="table-students">
                <Button className="create-button" onClick={() => handleCreate()}>
                    <FaPlus className="icon-plus" /> Create
                </Button>
                <TableStudent />
            </div>

        </>
    )
}
export default Student