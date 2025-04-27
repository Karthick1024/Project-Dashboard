import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';

const Layout = () => {
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  const handleNavLinkClick = () => setIsNavCollapsed(true);

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div className="container-fluid">
          <NavLink className="navbar-brand" to="/dashboard" onClick={handleNavLinkClick}>
            Dashboard
          </NavLink>

          <button
            className="navbar-toggler"
            type="button"
            onClick={handleNavCollapse}
            aria-controls="navbarNav"
            aria-expanded={!isNavCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`${isNavCollapsed ? 'collapse' : ''} navbar-collapse`} id="navbarNav">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard/employees" onClick={handleNavLinkClick}>
                  Employees
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard/projects" onClick={handleNavLinkClick}>
                  Projects
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink className="nav-link" to="/dashboard/tasks" onClick={handleNavLinkClick}>
                  Tasks
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
