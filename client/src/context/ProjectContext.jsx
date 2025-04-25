// src/context/ProjectContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  // 1) Initialize from localStorage (lazy initializer)
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
      return [];
    }
  });

  // 2) Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

  // 3) CRUD operations
  const addProject = (project) => {
    setProjects((prev) => [
      ...prev,
      { ...project, id: Date.now().toString() }
    ]);
  };

  // const updateProject = (updated) => {
  //   setProjects((prev) =>
  //     prev.map((proj) => (proj.id === updated.id ? updated : proj))
  //   );
  // };
  const updateProject = (updated) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === updated.id) {
          // Ensure assignedEmployees is always an array
          return {
            ...updated,
            assignedEmployees: Array.isArray(updated.assignedEmployees)
              ? updated.assignedEmployees
              : [updated.assignedEmployees] // Wrap it in an array if it's a single value
          };
        }
        return proj;
      })
    );
  };
  
  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  return (
    <ProjectContext.Provider
      value={{ projects, addProject, updateProject, deleteProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
