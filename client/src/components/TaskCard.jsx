import React from 'react';

const TaskCard = ({ task }) => {
  
  const taskImageUrl = task.imageUrl || '';  
  
  return (
    <div className="card mb-2">
      <div className="card-body d-flex align-items-center">
        <img
          src={taskImageUrl}  
          alt="task"
          className="rounded-circle me-2"
          width={40}
          height={40}
        />
        <div>
          <h6 className="mb-1">{task.title}</h6>
          <small className="text-muted">
            Assigned to: {task.employees.map((e) => e.name).join(', ')}
          </small>
          <br />
          <small className="text-muted">ETA: {task.eta}</small>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
