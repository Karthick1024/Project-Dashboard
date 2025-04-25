import React, { useState } from 'react';
import { useEmployee } from '../context/EmployeeContext';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  name: yup.string().required('Name is required'),
  position: yup.string().required('Position is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  imageFile: yup
    .mixed()
    .required('Profile image is required')
    .test(
      'fileType',
      'Only PNG, JPEG or GIF allowed',
      (value) =>
        value &&
        value[0] &&
        ['image/png', 'image/jpeg', 'image/gif'].includes(value[0].type)
    )
});

const Employees = () => {
  const { employees, addEmployee, updateEmployee, deleteEmployee } = useEmployee();
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({ resolver: yupResolver(schema) });

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  const onSubmit = async (data) => {
    const emailExists = employees.some(
      (emp) => emp.email === data.email && emp.id !== editId
    );

    if (emailExists) {
      alert('Email ID already exists. Please use a different email.');
      return;
    }

    const file = data.imageFile[0];
    const base64Image = await toBase64(file);

    const emp = {
      id: isEdit ? editId : Date.now().toString(),
      name: data.name,
      position: data.position,
      email: data.email,
      imageUrl: base64Image 
    };

    if (isEdit) {
      updateEmployee(emp);
      setIsEdit(false);
      setEditId(null);
    } else {
      addEmployee(emp);
    }

    reset();
    setShowForm(false);
  };

  const handleEdit = (employee) => {
    setValue('name', employee.name);
    setValue('position', employee.position);
    setValue('email', employee.email);
    setIsEdit(true);
    setEditId(employee.id);
    setShowForm(true);
  };

  return (
    <div className="container mt-4" data-aos="zoom-in-down">
      <h3>Employee Management</h3>
      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          reset();
          setIsEdit(false);
          setShowForm((v) => !v);
        }}
      >
        {showForm ? 'Cancel' : isEdit ? 'Edit Employee' : 'Add Employee'}
      </button>

      {showForm && (
        <form className="card p-3 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-3">
            <label>Name</label>
            <input className="form-control" {...register('name')} />
            <p className="text-danger">{errors.name?.message}</p>
          </div>
          <div className="mb-3">
            <label>Position</label>
            <input className="form-control" {...register('position')} />
            <p className="text-danger">{errors.position?.message}</p>
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input className="form-control" {...register('email')} />
            <p className="text-danger">{errors.email?.message}</p>
          </div>
          <div className="mb-3">
            <label>Profile Image (file)</label>
            <input type="file" className="form-control" {...register('imageFile')} />
            <p className="text-danger">{errors.imageFile?.message}</p>
          </div>
          <button type="submit" className="btn btn-success me-2">
            {isEdit ? 'Update' : 'Add'} Employee
          </button>
        </form>
      )}

      <div className="row">
        {employees.map((emp) => (
          <div className="col-md-4 mb-3" key={emp.id}>
            <div className="card p-3 text-center">
              <img
                src={emp.imageUrl}
                alt={emp.name}
                className="card-img-top rounded-circle mx-auto"
                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
              />
              <div className="card-body">
                <h5>{emp.name}</h5>
                <p className="mb-1">{emp.position}</p>
                <p className="text-muted small">{emp.email}</p>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(emp)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteEmployee(emp.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Employees;
