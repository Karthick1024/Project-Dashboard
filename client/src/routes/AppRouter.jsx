import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';


import Dashboard from '../pages/Dashboard';
import Employees from '../pages/Employees';
import Projects from '../pages/Projects';
import Tasks from '../pages/Tasks';
import Layout from '../layouts/Layout';



const AppRouter = () => {
  return (
    <Routes>
      {/* Redirect root to /dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Nested Dashboard Layout */}
      <Route path="/dashboard" element={<Layout />}>
        <Route index element={<Dashboard />} />
        <Route path="employees" element={<Employees />} />
        <Route path="projects" element={<Projects />} />
        <Route path="tasks" element={<Tasks />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;

