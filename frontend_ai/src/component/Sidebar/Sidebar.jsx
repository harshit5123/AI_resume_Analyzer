import React, { useContext } from 'react'
import styles from './Sidebar.module.css'
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import DashboardIcon from '@mui/icons-material/Dashboard';
import HistoryIcon from '@mui/icons-material/RestorePage';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../utils/AuthContext';
import { useNavigate } from 'react-router-dom';


const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, setIsAuthenticated, userinfo, setUserInfo } = useContext(AuthContext);
  console.log(location);

  const handleLogout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setUserInfo(null);
    navigate('/');
  }
  return (
    <div className={styles.sidebar}>
      <div className={styles.sidebaricon}>
        <DocumentScannerIcon sx={{ fontSize: 54, marginBottom: 2 }} />
        <div className={styles.sidebaricontext}>
          AI Resume
          Analyser
        </div>
      </div>

      {/* This is sidebar options */}
      <div className={styles.sidebarOptions}>

        <Link to="/dashboard" className={styles.sidebarOption + (location.pathname === '/dashboard' ? ' ' + styles.active : '')}>
          <DashboardIcon sx={{ fontSize: 30, marginRight: 2 }} />
          <div className={styles.sidebarOptionName}>DashBoard</div>
        </Link>

        <Link to="/history" className={styles.sidebarOption + (location.pathname === '/history' ? ' ' + styles.active : '')}>
          <HistoryIcon sx={{ fontSize: 30, marginRight: 2 }} />
          <div className={styles.sidebarOptionName}>History</div>
        </Link>


        {
          userinfo?.role === 'admin' && (
            <Link to="/admin" className={styles.sidebarOption + (location.pathname === '/admin' ? ' ' + styles.active : '')}>
              <AdminPanelSettingsIcon sx={{ fontSize: 30, marginRight: 2 }} />
              <div className={styles.sidebarOptionName}>Admin Panel</div>
            </Link>
          )
        }

        <div onClick={handleLogout} className={styles.sidebarOption}>
          <LogoutIcon sx={{ fontSize: 30, marginRight: 2 }} />
          <div className={styles.sidebarOptionName}>Logout</div>
        </div>

      </div>
    </div>
  )
}

export default Sidebar
