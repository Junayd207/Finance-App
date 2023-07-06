import React from "react"
import { auth } from "../../firebase"
import { signOut } from "firebase/auth"

import DashboardIcon from "@mui/icons-material/Dashboard"
import LocalAtmIcon from "@mui/icons-material/LocalAtm"
import ShowChartIcon from "@mui/icons-material/ShowChart"
import QueryStatsIcon from "@mui/icons-material/QueryStats"
import HistoryIcon from "@mui/icons-material/History"
import PieChartIcon from '@mui/icons-material/PieChart'
import SettingsIcon from "@mui/icons-material/Settings"
import LogoutIcon from "@mui/icons-material/Logout"

import SidebarOption from "./SidebarOption"
import "../../css/Sidebar.css"

const Sidebar = ({collapsed}) => {

    const logout = async () => {
        try {
            await signOut(auth);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <main>
            <div className="sidebar"id="sidebar" style={{width: !collapsed ? "200px" : "50px"}}>
                <h1 className="title">{collapsed ? "MFP" : "My Finance Pal"}</h1>
                <SidebarOption text="Dashboard" Icon={DashboardIcon} link="/dashboard" collapsed={collapsed}/>
                <SidebarOption text="Add Cash" Icon={LocalAtmIcon} link="/addCash" collapsed={collapsed}/>
                <SidebarOption text="Investments" Icon={ShowChartIcon} link="/investments"collapsed={collapsed}/>
                <SidebarOption text="Forecast" Icon={QueryStatsIcon} link="/forecast" collapsed={collapsed}/>
                <SidebarOption text="History" Icon={HistoryIcon} link="/history" collapsed={collapsed}/>
                <SidebarOption text="Analytics" Icon={PieChartIcon} link="/analytics" collapsed={collapsed}/>
                <SidebarOption text="Settings" Icon={SettingsIcon} link="/settings" collapsed={collapsed}/>
                <div
                    className="logout"
                    onClick={(e) => {
                        logout();
                        e.preventDefault();
                        window.location.href = "/";
                    }}
                >
                    <h3 style={{display: !collapsed ? "block" : "none"}} className="logout-text">Log out</h3>
                    <LogoutIcon
                        sx={{
                            fontSize: 30,
                        }}
                    />
                </div>
            </div>
        </main>
    );
};

export default Sidebar;
