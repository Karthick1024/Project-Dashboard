import React, { useState } from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  projectId: yup.string().required('Select a project'),
  title: yup.string().required('Task title is required'),
  description: yup.string().required('Description is required'),
  employeeIds: yup.array().min(1, 'Select at least one employee'),
  eta: yup.string().required('ETA is required'),
  imageFile: yup
    .mixed()
    .required('Reference image is required')
    .test(
      'fileType',
      'Only image files are allowed',
      (value) =>
        value &&
        ['image/png', 'image/jpeg', 'image/gif'].includes(value[0].type)
    )
});

const Tasks = () => {
  const [showForm, setShowForm] = useState(false);
  const { tasks, addTask, updateTask, deleteTask } = useTask();
  const { projects } = useProject();
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
    watch
  } = useForm({ resolver: yupResolver(schema) });

  const selectedProjectId = watch('projectId');
  const selectedProject = projects.find((p) => p.id === selectedProjectId);

  const onSubmit = (data) => {
    const file = data.imageFile[0];
    const preview = URL.createObjectURL(file);

    const assignedEmployees = selectedProject?.assignedEmployees?.filter((emp) =>
      data.employeeIds.includes(emp.id)
    );

    if (!assignedEmployees?.length) {
      return alert('No valid employees selected for this project');
    }

    const task = {
      id: isEdit ? editId : Date.now().toString(),
      project: selectedProject,
      title: data.title,
      description: data.description,
      employees: assignedEmployees,
      eta: data.eta,
      imageFile: file,
      imageUrl: preview,
      status: isEdit
        ? tasks.find((t) => t.id === editId).status
        : 'todo'
    };

    if (isEdit) {
      updateTask(task);
    } else {
      addTask(task);
    }

    reset();
    setIsEdit(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (t) => {
    setValue('projectId', t.project.id);
    setValue('title', t.title);
    setValue('description', t.description);
    setValue('employeeIds', t.employees.map((e) => e.id));
    setValue('eta', t.eta);
    setIsEdit(true);
    setEditId(t.id);
    setShowForm(true);
  };

  return (
    <div className="container mt-4" data-aos="flip-left"
      data-aos-easing="ease-out-cubic"
      data-aos-duration="2000">
      <h3>Task Management</h3>

      <button
        className="btn btn-primary mb-3"
        onClick={() => {
          reset();
          setIsEdit(false);
          setShowForm((v) => !v);
        }}
      >
        {showForm ? 'Cancel' : isEdit ? 'Edit Task' : 'Add Task'}
      </button>

      {showForm && (
        <form className="card p-3 mb-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label>Project</label>
              <select className="form-select" {...register('projectId')}>
                <option value="">Select project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
              <p className="text-danger">{errors.projectId?.message}</p>
            </div>


            <div className="col-md-6 mb-3">
              <label>Task Title</label>
              <input className="form-control" {...register('title')} />
              <p className="text-danger">{errors.title?.message}</p>
            </div>


            <div className="col-12 mb-3">
              <label>Description</label>
              <textarea className="form-control" {...register('description')} />
              <p className="text-danger">{errors.description?.message}</p>
            </div>


            <div className="col-md-6 mb-3">
              <label>Assign Employees</label>
              <Controller
                name="employeeIds"
                control={control}
                defaultValue={[]}
                render={({ field }) => {
                  const { value, onChange } = field;

                  const handleCheckboxChange = (e) => {
                    const checked = e.target.checked;
                    const val = e.target.value;

                    if (checked) {
                      onChange([...value, val]);
                    } else {
                      onChange(value.filter((v) => v !== val));
                    }
                  };

                  return (
                    <>
                      {selectedProject?.assignedEmployees?.map((emp) => (
                        <div className="form-check" key={emp.id}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`employee-${emp.id}`}
                            value={emp.id}
                            checked={value.includes(emp.id)}
                            onChange={handleCheckboxChange}
                          />
                          <label className="form-check-label" htmlFor={`employee-${emp.id}`}>
                            {emp.name}
                          </label>
                        </div>
                      ))}
                    </>
                  );
                }}
              />
              <p className="text-danger">{errors.employeeIds?.message}</p>
            </div>


            <div className="col-md-3 mb-3">
              <label>ETA</label>
              <input type="date" className="form-control" {...register('eta')} min={selectedProject?.startDate} 
                max={selectedProject?.endDate} />
              <p className="text-danger">{errors.eta?.message}</p>
            </div>


            <div className="col-md-3 mb-3">
              <label>Reference Image (file)</label>
              <input type="file" className="form-control" {...register('imageFile')} />
              <p className="text-danger">{errors.imageFile?.message}</p>
            </div>
          </div>

          <button type="submit" className="btn btn-success">
            {isEdit ? 'Update' : 'Add'} Task
          </button>
        </form>
      )}


      <div className="row">
        {tasks.map((t) => (
          <div className="col-md-4 mb-3" key={t.id}>
            <div className="card h-100">
              <img src={t.imageUrl} alt={t.title} className="card-img-top" />
              <div className="card-body">
                <h5>{t.title}</h5>
                <p>{t.description}</p>
                <p className="text-muted small">Project: {t.project.title}</p>
                <p className="text-muted small">
                  Assigned to: {t.employees.map((e) => e.name).join(', ')}
                </p>
                <p className="text-muted small">ETA: {t.eta}</p>
                <button
                  className="btn btn-info btn-sm me-2"
                  onClick={() => handleEdit(t)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(t.id)}
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

export default Tasks;