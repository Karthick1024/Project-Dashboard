import React, { useState, useEffect } from 'react';
import { useProject } from '../context/ProjectContext';
import { useEmployee } from '../context/EmployeeContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  logoFile: yup
    .mixed()
    .test('required', 'Project logo is required', value => value && value.length > 0)
    .test(
      'fileType',
      'Only image files (jpg, png, gif) are allowed',
      value => value && value.length > 0 && ['image/png', 'image/jpeg', 'image/gif'].includes(value[0].type)
    ),
  startDate: yup.string().required('Start date is required'),
  endDate: yup
    .string()
    .required('End date is required')
    .test('is-after', 'End date must be after start date', function (v) {
      return new Date(v) > new Date(this.parent.startDate);
    }),
  assignedEmployees: yup
    .array()
    .of(yup.string())
    .min(1, 'Assign at least one employee')
});

const Projects = () => {
  const { projects, addProject, updateProject, deleteProject } = useProject();
  const { employees } = useEmployee();
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const {
    register, handleSubmit, reset, setValue, control, formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      assignedEmployees: []
    }
  });

  useEffect(() => {
    if (isEdit && editId !== null) {
      const project = projects.find(p => p.id === editId);
      const assignedEmployeeIds = project?.assignedEmployees.map(e => e.id) || [];
      setSelectedEmployees(assignedEmployeeIds);
      setValue('assignedEmployees', assignedEmployeeIds);
    }
  }, [isEdit, editId, projects, setValue]);

  const onSubmit = (data) => {
    const assignedEmployeeIds = selectedEmployees;

    const file = data.logoFile[0];
    const preview = URL.createObjectURL(file);

    const assigned = employees.filter(e => assignedEmployeeIds.includes(e.id));

    const project = {
      id: isEdit ? editId : Date.now().toString(),
      title: data.title,
      description: data.description,
      logoFile: file,
      logoUrl: preview,
      startDate: data.startDate,
      endDate: data.endDate,
      assignedEmployees: assigned
    };

    if (isEdit) updateProject(project);
    else addProject(project);

    reset();
    setIsEdit(false);
    setEditId(null);
    setSelectedEmployees([]);
  };

  const handleEdit = (p) => {
    setValue('title', p.title);
    setValue('description', p.description);
    setValue('startDate', p.startDate);
    setValue('endDate', p.endDate);
    setValue('assignedEmployees', p.assignedEmployees.map(e => e.id));
    setIsEdit(true);
    setEditId(p.id);
  };

  const handleEmployeeChange = (employeeId) => {
    const newSelected = selectedEmployees.includes(employeeId)
      ? selectedEmployees.filter(id => id !== employeeId)
      : [...selectedEmployees, employeeId];

    setSelectedEmployees(newSelected);
    setValue('assignedEmployees', newSelected);
  };

  return (
    <div className="container mt-4" data-aos="zoom-in-left">
      <h3>Project Management</h3>

      <form className="card p-3 mb-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label>Project Title</label>
            <input className="form-control" {...register('title')} />
            <p className="text-danger">{errors.title?.message}</p>
          </div>

          <div className="col-md-6 mb-3">
            <label>Project Logo (file)</label>
            <input type="file" className="form-control" {...register('logoFile')} />
            <p className="text-danger">{errors.logoFile?.message}</p>
          </div>

          <div className="col-12 mb-3">
            <label>Description</label>
            <textarea className="form-control" {...register('description')} />
            <p className="text-danger">{errors.description?.message}</p>
          </div>

          <div className="col-md-6 mb-3">
            <label>Start Date</label>
            <input type="date" className="form-control" {...register('startDate')} />
            <p className="text-danger">{errors.startDate?.message}</p>
          </div>
          <div className="col-md-6 mb-3">
            <label>End Date</label>
            <input type="date" className="form-control" {...register('endDate')} />
            <p className="text-danger">{errors.endDate?.message}</p>
          </div>

          <div className="col-12 mb-3">
            <label>Assign Employee(s)</label>
            <div className="border p-2 rounded" style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {employees.map(e => (
                <div className="form-check" key={e.id}>
                  <input
                    type="checkbox"
                    id={`emp-${e.id}`}
                    value={e.id}
                    checked={selectedEmployees.includes(e.id)}
                    onChange={() => handleEmployeeChange(e.id)}
                    className="form-check-input"
                  />
                  <label htmlFor={`emp-${e.id}`} className="form-check-label">
                    {e.name}
                  </label>
                </div>
              ))}
            </div>
            <p className="text-danger">{errors.assignedEmployees?.message}</p>
          </div>
        </div>

        <button className="btn btn-success">
          {isEdit ? 'Update' : 'Add'} Project
        </button>
      </form>

      <div className="row">
        {projects.map(p => (
          <div className="col-md-4 mb-3" key={p.id}>
            <div className="card">
              <img src={p.logoUrl} className="card-img-top" alt={p.title} />
              <div className="card-body">
                <h5>{p.title}</h5>
                <p>{p.description}</p>
                <p className="text-muted small">
                  {p.startDate} → {p.endDate}
                </p>
                <p className="small mb-1">Assigned To:</p>
                <ul className="small ps-3 mb-3">
                  {p.assignedEmployees.map(e => (
                    <li key={e.id}>{e.name}</li>
                  ))}
                </ul>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(p)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteProject(p.id)}
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

export default Projects;
