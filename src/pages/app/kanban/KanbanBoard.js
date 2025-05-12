import React from "react";
import { toast } from "react-toastify";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { KanbanColumn } from "./KanbanPartials";
import { useMoveTaskMutation } from "../../../Services/ProjectService";

const KanbanBoard = ({ columns, reportId }) => {
  const [moveTask, { isLoading }] = useMoveTaskMutation();
  const handleOnDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    // dropped outside the list
    if (!destination) {
      return;
    }
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const foreign = columns.columns[destination.droppableId];

    const report_id = reportId;

    const data = {
      list_id: source.droppableId,
      updated_list_id: foreign.id,
      task_id: draggableId,
    };

    const res = await moveTask({ data, report_id });

    if (res.data) {
    } else {
      toast.error("Something went wrong, please try again later!", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
    }
  };

  return (
    <DragDropContext onDragEnd={handleOnDragEnd}>
      <Droppable droppableId="all-columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            className="kanban-container"
            id="kanban-container"
            style={{ width: `${columns?.columnOrder.length * 320}px` }}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {columns?.columnOrder.map((columnId, index) => {
              const column = columns.columns[columnId];
              return (
                <KanbanColumn
                  data={columns}
                  column={column}
                  key={index}
                  index={index}
                />
              );
            })}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default KanbanBoard;
