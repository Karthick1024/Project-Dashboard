import React from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { useTaskContext } from "../context/TaskContext";
import TaskCard from "./TaskCard";

const KanbanBoard = () => {
  const { columns, updateColumns } = useTaskContext();

  const onDragEnd = ({ source, destination }) => {
    if (!destination) return;

    const sourceCol = columns[source.droppableId];
    const destCol = columns[destination.droppableId];

    const sourceItems = [...sourceCol.items];
    const [movedItem] = sourceItems.splice(source.index, 1);

    if (source.droppableId === destination.droppableId) {
      sourceItems.splice(destination.index, 0, movedItem);
      updateColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems }
      });
    } else {
      const destItems = [...destCol.items];
      destItems.splice(destination.index, 0, movedItem);
      updateColumns({
        ...columns,
        [source.droppableId]: { ...sourceCol, items: sourceItems },
        [destination.droppableId]: { ...destCol, items: destItems }
      });
    }
  };

  return (
    <div className="container-fluid mt-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="row">
          {Object.entries(columns).map(([colId, colData]) => (
            <div className="col-sm-6 col-md-4 col-lg-2 mb-3" key={colId}>
              <div className="bg-light border p-2 rounded h-100">
                <h6 className="text-center">{colData.name}</h6>
                <Droppable droppableId={colId}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="min-vh-25"
                    >
                      {colData.items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <TaskCard task={item} />
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

export default KanbanBoard;
