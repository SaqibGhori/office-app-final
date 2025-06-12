import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../index.css';

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMenuActive, setIsMenuActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const isMobile = windowWidth < 1024;

  const navItems = [
    {
      path: "/",
      icon: "dashboard",
      label: "Main Dashboard",
    },
    {
      path: "/fileview",
      icon: "insert_chart",
      label: "Phase 1",
    },
    // {
    //   path: "/settings",
    //   icon: "settings",
    //   label: "Settings",
    // },
  ];

  // const secondaryNavItems = [
  //   { icon: 'account_circle', label: 'Profile' },
  //   { icon: 'logout', label: 'Logout' }
  // ];

  const sidebarClasses = [
    'sidebar',
    isCollapsed && !isMobile ? 'collapsed' : '',
    isMenuActive && isMobile ? 'menu-active' : ''
  ].filter(Boolean).join(' ');

  const sidebarStyle = isMobile ? {
    height: isMenuActive ? 'auto' : '56px'
  } : {};

  return (
    <aside className={sidebarClasses} style={sidebarStyle}>
      {/* Sidebar header */}
      <header className="sidebar-header">
        {/* <a href="#" className="header-logo">
          <img src="logo.png" alt="Logo" />
        </a> */}
        {!isMobile && (
          <button className="toggler sidebar-toggler" onClick={toggleCollapse}>
            <span className="material-symbols-rounded">chevron_left</span>
          </button>
        )}
        {isMobile && (
          <button className="toggler menu-toggler" onClick={toggleMenu}>
            <span className="material-symbols-rounded">
              {isMenuActive ? 'close' : 'menu'}
            </span>
          </button>
        )}
      </header>
      
      <nav className="sidebar-nav">
       <nav className="sidebar-nav">
        <ul className="nav-list primary-nav">
          {navItems.map((item) => (
            <li 
              key={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <Link to={item.path} className="nav-link">
                <span className="nav-icon material-symbols-rounded">
                  {item.icon}
                </span>
                <span className="nav-label">{item.label}</span>
              </Link>
              {isCollapsed && (
                <span className="nav-tooltip">{item.label}</span>
              )}
            </li>
          ))}
        </ul>
      </nav>
      </nav>
    </aside>
  );
};

export default Sidebar;