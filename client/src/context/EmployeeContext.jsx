import React, { createContext, useContext, useState, useEffect } from 'react';

const EmployeeContext = createContext();

export const EmployeeProvider = ({ children }) => {
  // storing data in localstorage to available the data even if the page refreshes
  const [employees, setEmployees] = useState(() => {
    try {
      const saved = localStorage.getItem('employees');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error('Failed to load employees from localStorage:', e);
      return [];
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem('employees', JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to save employees to localStorage:', e);
    }
  }, [employees]);


  const addEmployee = (employee) => {
    setEmployees((prev) => [
      ...prev,
      { ...employee, id: Date.now().toString() }
    ]);
  };


  const deleteEmployee = (id) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };


  const updateEmployee = (updatedEmployee) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === updatedEmployee.id ? updatedEmployee : emp
      )
    );
  };

  return (
    <EmployeeContext.Provider value={{ employees, addEmployee, updateEmployee, deleteEmployee }}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployee = () => useContext(EmployeeContext);
