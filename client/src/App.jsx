import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AppRouter from './routes/AppRouter';
import { EmployeeProvider } from './context/EmployeeContext';
import { ProjectProvider } from './context/ProjectContext';
import { TaskProvider } from './context/TaskContext';
import AOS from 'aos';
import 'aos/dist/aos.css';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap/dist/js/bootstrap.bundle.min.js';




function App() {
  useEffect(() => {
    AOS.init({
      duration: 1000, 
      once: true, 
    });
  }, []);
  return (
    <EmployeeProvider>
    <ProjectProvider>
      <TaskProvider>
        <Router>
          <AppRouter />
        </Router>
      </TaskProvider>
    </ProjectProvider>
  </EmployeeProvider>
  );
}

export default App;
