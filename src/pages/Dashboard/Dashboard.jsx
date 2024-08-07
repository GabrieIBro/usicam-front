import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Dashboard/Sidebar/Sidebar";
import Topbar from "../../components/Dashboard/Topbar/Topbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../../config/axios";
import "./dashboard.scss";

function Dashboard() {
    
    const navigate = useNavigate();
    const location = useLocation();
    const [load, setLoad] = useState(false);
    const [user, setUser] = useState("");
    const [mode, setMode] = useState(localStorage.getItem("mode") || "light");

    useEffect( () => {
        async function checkLogin() {
            await axiosInstance.get('/checkLogin')
            .then(res => {
                setUser(res.data);
            })
            .catch(err => {
                if(err) {
                    navigate('/login');
                }
            })
            .finally(() => {
                setLoad(true);
            })
            

        }
        checkLogin();

    }, [navigate])

    useEffect(() => {
        if(/\/dashboard[/]*/.test(location.pathname)) {
            navigate('/dashboard/inicio');
        }
    }, [])

    useEffect(() => {
        function modeWatch(e) {
            if(e.key === "mode") {
                setMode(localStorage.getItem("mode"));
            }
        }

        window.addEventListener("storage", modeWatch);

        return () => {
            window.removeEventListener("storage", modeWatch)
        }
    }, [])

    return(
        <div className={(mode === "light") ? "dashboard" : "dashboard-dark"} style={(!load) ? {display: "none"} : {}}>

            <Sidebar/>

            <div className="dashboard__main-container">
                <Topbar username={user}/>
                <div className="dashboard__main-container__content">
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;