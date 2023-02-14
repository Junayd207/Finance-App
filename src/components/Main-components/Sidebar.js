import React from 'react'
import '../../css/Sidebar.css';
import SidebarOption from "./SidebarOption"

import {auth} from "../../firebase"
import {signOut} from "firebase/auth";

import DashboardIcon from '@mui/icons-material/Dashboard';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import HistoryIcon from '@mui/icons-material/History';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const logout = async () => {
  try {
    await signOut(auth);
  } catch (err) {
    console.error(err);
  }
};

const Sidebar = () => {
  return (
    <main className="sidebar">
        <h1 className="title">My Finance Pal</h1>
        <SidebarOption text="Dashboard" Icon={DashboardIcon} link="/dashboard"/>
        <SidebarOption text="Add Cash" Icon={LocalAtmIcon} link="/addCash"/>
        <SidebarOption text="Investments" Icon={ShowChartIcon} link="/investments"/>
        <SidebarOption text="Forecast" Icon={QueryStatsIcon} link="/forecast"/>
        <SidebarOption text="History" Icon={HistoryIcon} link="/history"/>
        <SidebarOption text="Profile" Icon={AccountBoxIcon} link="/profile"/>
        <SidebarOption text="Settings" Icon={SettingsIcon} link="/settings"/>

        <div className="logout"
            onClick={(e) => {
                logout()
                e.preventDefault();
                window.location.href='/';
            }}
        >
            <h3 className="logout-text">Log out</h3>
            <LogoutIcon sx={{ fontSize: 30, paddingTop:2, paddingBottom:2, paddingRight:1}}/>
        </div>
    </main>
  )
}

export default Sidebar