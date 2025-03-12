// src/components/Navbar.jsx
import { FaBell, FaUserCircle, FaEllipsisV, FaBars } from 'react-icons/fa';
import { useState } from 'react';

const Navbar = ({ toggleSidebar }) => {
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        alert('Logged out successfully!');
    };

    return (
        <nav className="navbar navbar-light bg-light px-3 fixed-top d-flex justify-content-between align-items-center">
            {/* Sidebar Toggle Button */}
            <button className="btn btn-outline-dark" type="button" onClick={toggleSidebar}>
                <FaBars size={15} />
            </button>

            <div>
                <FaBell size={24} className="me-3" />
                <FaUserCircle size={28} className="me-3" />
                <div className="position-relative d-inline-block">
                    <FaEllipsisV
                        size={24}
                        style={{ cursor: 'pointer' }}
                        onClick={() => setMenuOpen(!menuOpen)}
                    />
                    {menuOpen && (
                        <div className="dropdown-menu show position-absolute end-0 mt-2">
                            <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
