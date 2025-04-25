import React, { createContext, useContext, useState, useEffect } from 'react';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem('projects');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load projects from localStorage:', e);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('projects', JSON.stringify(projects));
    } catch (e) {
      console.error('Failed to save projects to localStorage:', e);
    }
  }, [projects]);

 
  const addProject = (project) => {
    setProjects((prev) => [
      ...prev,
      { ...project, id: Date.now().toString() }
    ]);
  };

  const updateProject = (updated) => {
    setProjects((prev) =>
      prev.map((proj) => {
        if (proj.id === updated.id) {
        
          return {
            ...updated,
            assignedEmployees: Array.isArray(updated.assignedEmployees)
              ? updated.assignedEmployees
              : [updated.assignedEmployees] 
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
