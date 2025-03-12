// src/components/Layout.jsx
import { useState } from 'react';
import AppSidebar from './Sidebar';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen((prev) => !prev);
    };

    return (
        <div className="d-flex">
            <AppSidebar isOpen={sidebarOpen} />
            <div className="flex-grow-1" style={{ marginTop: '56px' }}>
                <Navbar toggleSidebar={toggleSidebar} />
                <div className="p-4">
                    <Outlet /> {/* This is where child routes render */}
                </div>
            </div>
        </div>
    );
};

export default Layout;
