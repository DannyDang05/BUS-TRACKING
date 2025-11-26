

import HeaderParent from "./ParentContent/HeaderParent";
import Snowflakes from "../DriverUI/Content/Snowflakes";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { getParentInformation } from "../service/apiService";
const ParentUI = () => {
    const [userInfor, setUserInfor] = useState({});
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const fetch = async () => {
            setLoading(true);
            try {
                const parentId = localStorage.getItem('parent_profile');
                const res = await getParentInformation(parentId);
                // apiService interceptor returns `response.data` shape, which our backend wraps as { errorCode, message, data }
                const user = res?.data || [];
                setUserInfor(user);
            } catch (err) {
                console.error('Lấy danh sách lỗi', err);
            } finally {
                setLoading(false);
            }
        };
        fetch();
    }, []);
    return (
        <div className="parent-container">
            <Snowflakes />
            <div className="parent-header">
                <HeaderParent props={userInfor} />
            </div>
            <div className="parent-body">
                <Outlet />
            </div>
        </div>
    );
};
export default ParentUI;