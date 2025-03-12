// src/components/Sidebar.jsx
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaPlus, FaHistory, FaChartBar } from 'react-icons/fa';

const AppSidebar = ({ isOpen }) => {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <Sidebar
      collapsed={!isOpen}
      onBackdropClick={() => console.log('Backdrop Clicked')}
      breakPoint="md"
      className="pt-5" // Push sidebar below fixed navbar
    >
      <Menu iconShape="circle">
        <MenuItem icon={<FaTachometerAlt />} onClick={() => handleNavigation('/')}>
          Dashboard
        </MenuItem>



        <MenuItem icon={<FaChartBar />} onClick={() => handleNavigation('/expense')}>
          Expenses
        </MenuItem>
        <MenuItem icon={<FaHistory />} onClick={() => handleNavigation('/history')}>
          Expense History
        </MenuItem>

        <MenuItem icon={<FaChartBar />} onClick={() => handleNavigation('/reports')}>
          Reports
        </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default AppSidebar;
