import React, { useState } from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import {
  Badge,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  UncontrolledDropdown,
} from "reactstrap";
import { Icon, UserAvatar } from "../../../components/Component";
import { calculateDaysLeft, findUpper } from "../../../utils/Utils";
import { KanbanTaskForm } from "./KanbanForms";
import {
  useGetNamesQuery,
  useGetStaffQuery,
} from "../../../Services/UserService";
import { useDeleteTaskMutation } from "../../../Services/ProjectService";
import { toast } from "react-toastify";

export const KanbanCard = ({ data, setData, card, index, column }) => {
  const [open, setOpen] = useState(false);
  const [taskModal, setTaskModal] = useState(false);

  const { data: stuffList } = useGetNamesQuery();
  const { data: stuffLists } = useGetStaffQuery();

  const [deleteTask, { isDeleting }] = useDeleteTaskMutation();

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleTaskModal = () => {
    setTaskModal(!taskModal);
  };

  const deleteTaskHandler = async (id, report_id) => {
    try {
      const data = {
        task_id: id,
        list_id: column.id,
      };

      const res = await deleteTask({ data, report_id });
      if (res.data) {
        toast.success("Task deleted successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      } else {
        toast.error(res.error.data.message, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      }
      setOpen(false);
    } catch (error) {
      toast.error('Something went wrong, please try again later!",', {
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

  const {
    id,
    title,
    labels,
    desc,
    members,
    tags,
    task_deadline,
    report_id,
    users,
  } = card;

  return (
    <React.Fragment>
      <Draggable draggableId={id} key={id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className="mt-2"
          >
            <div className="kanban-item">
              <div className="kanban-item-title">
                <h6 className="title">{title}</h6>
                <Dropdown isOpen={open} toggle={toggleOpen}>
                  <DropdownToggle
                    tag="a"
                    href="#toggle"
                    className="dropdown-toggle"
                    onClick={(ev) => ev.preventDefault()}
                  >
                    {stuffList && (
                      <div className="user-avatar-group">
                        {members.map((item, index) => (
                          <UserAvatar
                            key={index}
                            className="xs"
                            theme={"success"}
                            text={
                              stuffList?.find((i) => i._id === item)
                                ?.username[0]
                            }
                          ></UserAvatar>
                        ))}
                      </div>
                    )}
                  </DropdownToggle>
                  <DropdownMenu end>
                    {stuffList && (
                      <ul className="link-list-opt no-bdr p-3 g-2">
                        {members.map((item, index) => (
                          <li key={index}>
                            <div className="user-card" onClick={toggleOpen}>
                              <UserAvatar
                                className="sm"
                                theme={"success"}
                                text={findUpper(
                                  stuffList?.find((i) => i._id === item)
                                    ?.username
                                )}
                              ></UserAvatar>
                              <div className="user-name">
                                <span className="tb-lead">
                                  {
                                    stuffList?.find((i) => i._id === item)
                                      ?.username
                                  }
                                </span>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="kanban-item-text">
                <p>{desc}</p>
              </div>
              <ul className="kanban-item-tags">
                {tags.map((tag, index) => (
                  <li key={index}>
                    <Badge color="info">
                      {labels?.find((i) => i._id === tag)?.title}
                    </Badge>
                  </li>
                ))}
              </ul>
              <div className="kanban-item-meta">
                <ul className="kanban-item-meta-list">
                  <li
                    className={
                      Number(calculateDaysLeft(task_deadline)) < 5
                        ? "text-danger"
                        : ""
                    }
                  >
                    <Icon name="calendar"></Icon>
                    <span>{calculateDaysLeft(task_deadline)}d Due</span>
                  </li>
                </ul>
                <ul className="kanban-item-meta-list">
                  <UncontrolledDropdown>
                    <DropdownToggle
                      tag="a"
                      href="toggle"
                      onClick={(ev) => ev.preventDefault()}
                      className="dropdown-toggle btn btn-xs btn-icon btn-trigger me-n1"
                    >
                      <Icon name="more-v"></Icon>
                    </DropdownToggle>
                    <DropdownMenu end>
                      <ul className="link-list-opt no-bdr">
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#item"
                            onClick={(ev) => {
                              ev.preventDefault();
                              toggleTaskModal();
                            }}
                          >
                            <Icon name="edit"></Icon>
                            <span>Edit Task</span>
                          </DropdownItem>
                        </li>
                        <li>
                          <DropdownItem
                            tag="a"
                            href="#item"
                            onClick={(ev) => {
                              ev.preventDefault();
                              deleteTaskHandler(id, report_id);
                            }}
                          >
                            <Icon name="trash"></Icon>
                            <span>Delete Task</span>
                          </DropdownItem>
                        </li>
                      </ul>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </ul>
              </div>
            </div>
          </div>
        )}
      </Draggable>
      <Modal size="lg" isOpen={taskModal} toggle={toggleTaskModal}>
        <KanbanTaskForm
          toggle={toggleTaskModal}
          setData={setData}
          editTask={card}
          handleDelete={() => deleteTaskHandler(id, report_id)}
          stuffList={stuffLists}
          stuffNames={stuffList}
          labelsSet={labels}
          isDeleting={isDeleting}
          users={users}
        />
      </Modal>
    </React.Fragment>
  );
};

export const KanbanCardList = ({ data, setData, tasks, column }) => {
  return tasks.length > 0 ? (
    tasks.map((task, index) => {
      const card = data.task[task];
      return (
        <KanbanCard
          card={card}
          data={data}
          setData={setData}
          key={card.id}
          index={index}
          column={column}
        />
      );
    })
  ) : (
    <div className="kanban-drag"></div>
  );
};

export const KanbanColumn = ({ data, setData, column, index }) => {
  const [open, setOpen] = useState(false);

  const toggleModal = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <Draggable draggableId={column.id} key={column.id} index={index}>
        {(provided) => (
          <div
            className="kanban-board"
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <div
              className={`kanban-board-header kanban-${column.theme}`}
              {...provided.dragHandleProps}
            >
              <div className="kanban-title-board">
                <div className="kanban-title-content">
                  <h6 className="title">{column.text}</h6>
                  <Badge color="outline-light" pill className="text-dark">
                    {column.tasks.length}
                  </Badge>
                </div>
              </div>
            </div>
            <Droppable droppableId={column.id} type="task">
              {(provided) => (
                <div
                  className="kanban-drag"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  <KanbanCardList
                    data={data}
                    setData={setData}
                    tasks={column.tasks}
                    column={column}
                  />
                  <button className="kanban-add-task mt-2 btn btn-block">
                    <Icon name="plus-sm"></Icon>
                  </button>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
      <Modal size="lg" isOpen={open} toggle={toggleModal}>
        <KanbanTaskForm
          toggle={toggleModal}
          data={data}
          setData={setData}
          taskToBoard={column}
        />
      </Modal>
    </React.Fragment>
  );
};
