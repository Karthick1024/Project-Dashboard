import React, { useState, useEffect } from 'react';
import { useTask } from '../context/TaskContext';
import { useProject } from '../context/ProjectContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from '../components/TaskCard';

const statusMap = {
  todo: 'Need to Do',
  inprogress: 'In Progress',
  needtest: 'Need for Test',
  completed: 'Completed',
  reopen: 'Re-open'
};

const Dashboard = () => {
  const { tasks, updateTask } = useTask();
  const { projects } = useProject();
  const [filterProject, setFilterProject] = useState('');
  const [columns, setColumns] = useState(
    Object.fromEntries(
      Object.entries(statusMap).map(([key, name]) => [key, { name, items: [] }])
    )
  );
  useEffect(() => {
    console.log('all tasks:', tasks);
    // ... rest of your column-rebuild logic
  }, [tasks, filterProject]);
  
  useEffect(() => {
    const filtered = filterProject
      ? tasks.filter((t) => t.project.id === filterProject)
      : tasks;

    const newCols = Object.fromEntries(
      Object.entries(statusMap).map(([key, name]) => [
        key,
        { name, items: filtered.filter((t) => t.status === key) }
      ])
    );
    setColumns(newCols);
  }, [tasks, filterProject]);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];
    const sourceItems = Array.from(sourceCol.items);
    const [moved] = sourceItems.splice(source.index, 1);

    // update task status
    const updated = { ...moved, status: destination.droppableId };
    updateTask(updated);

    const destItems = Array.from(destCol.items);
    destItems.splice(destination.index, 0, updated);

    setColumns({
      ...columns,
      [source.droppableId]: { ...sourceCol, items: sourceItems },
      [destination.droppableId]: { ...destCol, items: destItems }
    });
  };

  return (
    <div className="container-fluid mt-4" >
      <h3>Dashboard</h3>

      {/* Project Filter */}
      <div className="row mb-3" >
        <div className="col-md-4" >
          <select
            className="form-select"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="">— All Projects —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {Object.entries(columns).map(([colId, { name, items }]) => (
            <div className="col-sm-6 col-md-4 col-lg-2 mb-3" key={colId}>
              <div className="bg-light border p-2 rounded h-100 d-flex flex-column">
                <h6 className="text-center">{name}</h6>

                <Droppable droppableId={colId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="flex-grow-1 overflow-auto"
                      style={{ minHeight: '100px' }}
                    >
                      {items.map((task, idx) => (
                        <Draggable
                          key={task.id}
                          draggableId={task.id}
                          index={idx}
                        >
                          {(prov) => (
                            <div
                              ref={prov.innerRef}
                              {...prov.draggableProps}
                              {...prov.dragHandleProps}
                            >
                              <TaskCard task={task} />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Dashboard;
