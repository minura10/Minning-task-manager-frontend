import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import CsvDownloader from "react-csv-downloader";

import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import { useParams } from "react-router";

import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  DropdownItem,
  Badge,
  Modal,
} from "reactstrap";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  UserAvatar,
  PaginationComponent,
  DataTable,
  DataTableBody,
  DataTableHead,
  DataTableRow,
  DataTableItem,
} from "../../../components/Component";
import {
  findUpper,
  calculateDaysLeft,
  capitalizeFirstLetter,
} from "../../../utils/Utils";
// import FormModal from "./FormModal";

import {
  useDeleteTaskMutation,
  useGetProjectQuery,
  useGetTasksQuery,
} from "../../../Services/ProjectService";
import {
  useGetNamesQuery,
  useGetStaffQuery,
} from "../../../Services/UserService";
import { KanbanTaskForm } from "../kanban/KanbanForms";

export const TaskListPage = () => {
  const { projectId } = useParams();

  const [open, setOpen] = useState(false);
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);
  const [taskModal, setTaskModal] = useState(false);
  const [editTaskModal, setEditTaskModal] = useState(false);

  //services calls

  const { data: taskInfo } = useGetTasksQuery({
    report_id: projectId,
  });
  const { data: listInfo } = useGetProjectQuery({
    report_id: projectId,
  });
  const { data: usersNames } = useGetNamesQuery();
  const { data: stuffList } = useGetStaffQuery();
  const [deleteTask, { isLoading }] = useDeleteTaskMutation();

  const [data, setData] = useState(taskInfo);
  const [taskData, setTaskData] = useState([]);
  const [trans, setTrans] = useState("");

  const [editForm, setEditForm] = useState({
    id: "",
    list_id: "",
    title: "",
    desc: "",
    task_deadline: new Date(),
    tags: [],
    members: [],
  });

  useEffect(() => {
    if (taskInfo != undefined) {
      setData(taskInfo);
      setTaskData(taskInfo?.tasks);
    }
  }, [taskInfo]);

  useEffect(() => {
    let filteredData;
    if (trans === "To do") {
      filteredData = taskInfo.tasks.filter((item) => item.title === "To do");
    } else if (trans === "In progress") {
      filteredData = taskInfo.tasks.filter(
        (item) => item.title === "In progress"
      );
    } else if (trans === "In review") {
      filteredData = taskInfo.tasks.filter(
        (item) => item.title === "In review"
      );
    } else if (trans === "Completed") {
      filteredData = taskInfo.tasks.filter(
        (item) => item.title === "Completed"
      );
    } else {
      filteredData = taskInfo?.tasks;
    }
    setTaskData(filteredData);
  }, [trans]);

  const toggleOpen = () => {
    setOpen(!open);
  };

  const toggleTaskModal = () => {
    setTaskModal(!taskModal);
  };

  const toggleEditTaskModal = () => {
    setEditTaskModal(!editTaskModal);
  };

  const deleteTaskHandler = async (id, task_id, report_id) => {
    try {
      const data = {
        task_id: task_id,
        list_id: id,
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

  const onEditClick = (id) => {
    // Ensure taskData is an array
    if (Array.isArray(taskData)) {
      taskData.forEach((item) => {
        if (item.taskId === id) {
          setEditForm({
            id: item.taskId,
            list_id: item._id,
            title: item.task_title,
            desc: item.description,
            members: item.members,
            task_deadline: item.deadline,
            tags: item.labels,
            report_id: projectId,
          });
          toggleEditTaskModal();
        }
      });
    } else {
      console.error("taskData is not an array");
    }
  };
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = taskData?.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const datas = taskData?.map(
    ({ title, task_title, description, members, deadline, labels }) => ({
      Title: task_title,
      Description: description,
      Team: members.map(
        (item) => usersNames?.find((i) => i._id === item)?.username
      ),
      Status: title,
      Deadline: calculateDaysLeft(deadline) + "d Due",
      Tags: labels.map(
        (item) => data.labels?.find((i) => i._id === item)?.title
      ),
    })
  );

  return (
    <>
      <Head title="Task List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page>Tasks</BlockTitle>
              <BlockDes className="text-soft">
                You have total {taskInfo !== undefined && taskData?.length}{" "}
                Tasks
              </BlockDes>
            </BlockHeadContent>
            <BlockHeadContent>
              <div className="toggle-wrap nk-block-tools-toggle">
                <Button
                  className={`btn-icon btn-trigger toggle-expand me-n1 ${
                    sm ? "active" : ""
                  }`}
                  onClick={() => updateSm(!sm)}
                >
                  <Icon name="menu-alt-r"></Icon>
                </Button>
                <div
                  className="toggle-expand-content"
                  style={{ display: sm ? "block" : "none" }}
                >
                  <ul className="nk-block-tools g-3">
                    <li>
                      <CsvDownloader
                        filename="myCsv"
                        extension=".csv"
                        datas={datas}
                      >
                        <a
                          href="#export"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="btn btn-white btn-outline-light"
                        >
                          <Icon name="download-cloud"></Icon>
                          <span>Export</span>
                        </a>
                      </CsvDownloader>
                    </li>
                    <li>
                      <UncontrolledDropdown>
                        <DropdownToggle
                          tag="a"
                          className="dropdown-toggle btn btn-white btn-dim btn-outline-light"
                        >
                          <Icon
                            name="filter-alt"
                            className="d-none d-sm-inline"
                          ></Icon>
                          <span>Filtered By</span>
                          <Icon name="chevron-right" className="dd-indc"></Icon>
                        </DropdownToggle>
                        <DropdownMenu end>
                          <ul className="link-list-opt no-bdr">
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("");
                                }}
                              >
                                <span>All</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("To do");
                                }}
                              >
                                <span>To do</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("In progress");
                                }}
                              >
                                <span>In progress</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("In review");
                                }}
                              >
                                <span>In review</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("Completed");
                                }}
                              >
                                <span>Completed</span>
                              </DropdownItem>
                            </li>
                          </ul>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </li>
                    <li
                      className="nk-block-tools-opt"
                      onClick={() => setModal({ add: true })}
                    >
                      <Button color="primary" onClick={() => toggleTaskModal()}>
                        <Icon name="plus"></Icon>
                        <span>Add Task</span>
                      </Button>
                    </li>
                  </ul>
                </div>
              </div>
            </BlockHeadContent>
          </BlockBetween>
        </BlockHead>
        <Block>
          <DataTable className="card-stretch">
            <DataTableBody>
              <DataTableHead className="nk-tb-item nk-tb-head">
                <DataTableRow>
                  <span className="sub-text">Task Title</span>
                </DataTableRow>
                <DataTableRow size="xxl">
                  <span className="sub-text">Description</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Team</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Deadline</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Tags</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-end">
                  <span className="sub-text">Option</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems != undefined
                ? currentItems.map((item, idx) => {
                    return (
                      <DataTableItem key={idx}>
                        <DataTableRow>
                          <a
                            href="#title"
                            onClick={(ev) => {
                              ev.preventDefault();
                            }}
                            className="project-title"
                          >
                            <UserAvatar
                              className="sq"
                              theme={item.avatarClass}
                              text={findUpper(item.task_title)}
                            />
                            <div className="project-info">
                              <h6 className="title">{item.task_title}</h6>
                            </div>
                          </a>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <span>{item.description}</span>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <Dropdown isOpen={open} toggle={toggleOpen}>
                            <DropdownToggle
                              tag="a"
                              href="#toggle"
                              className="dropdown-toggle"
                              onClick={(ev) => ev.preventDefault()}
                            >
                              {usersNames && (
                                <div className="user-avatar-group">
                                  {item.members.map((item, index) => (
                                    <UserAvatar
                                      key={index}
                                      className="xs"
                                      theme={"success"}
                                      text={
                                        usersNames?.find((i) => i._id === item)
                                          ?.username[0]
                                      }
                                    ></UserAvatar>
                                  ))}
                                </div>
                              )}
                            </DropdownToggle>
                            <DropdownMenu end>
                              {usersNames && (
                                <ul className="link-list-opt no-bdr p-3 g-2">
                                  {item.members.map((item, index) => (
                                    <li key={index}>
                                      <div
                                        className="user-card"
                                        onClick={toggleOpen}
                                      >
                                        <UserAvatar
                                          className="sm"
                                          theme={"success"}
                                          text={findUpper(
                                            usersNames?.find(
                                              (i) => i._id === item
                                            )?.username
                                          )}
                                        ></UserAvatar>
                                        <div className="user-name">
                                          <span className="tb-lead">
                                            {
                                              usersNames?.find(
                                                (i) => i._id === item
                                              )?.username
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
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <span>{item.title}</span>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <ul className="kanban-item-meta-list">
                            <li
                              className={
                                Number(calculateDaysLeft(item.deadline)) < 5
                                  ? "text-danger"
                                  : ""
                              }
                            >
                              <Icon name="calendar"></Icon>
                              <span>
                                {calculateDaysLeft(item.deadline)}d Due
                              </span>
                            </li>
                          </ul>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          {item.labels.map((item) => (
                            <span className="ps-1">
                              <Badge color="info">
                                {
                                  data.labels?.find((i) => i._id === item)
                                    ?.title
                                }
                              </Badge>
                            </span>
                          ))}
                        </DataTableRow>
                        <DataTableRow className="nk-tb-col-tools text-end">
                          <ul className="nk-tb-actions gx-1">
                            <li>
                              <UncontrolledDropdown>
                                <DropdownToggle
                                  tag="a"
                                  className="text-soft dropdown-toggle btn btn-icon btn-trigger"
                                >
                                  <Icon name="more-h"></Icon>
                                </DropdownToggle>
                                <DropdownMenu end>
                                  <ul className="link-list-opt no-bdr">
                                    <li
                                      onClick={() => onEditClick(item.taskId)}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#edit"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="edit"></Icon>
                                        <span>Edit</span>
                                      </DropdownItem>
                                    </li>
                                    <li>
                                      <DropdownItem
                                        tag="a"
                                        href="#item"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                          deleteTaskHandler(
                                            item._id,
                                            item.taskId,
                                            projectId
                                          );
                                        }}
                                      >
                                        <Icon name="trash"></Icon>
                                        <span>Delete Task</span>
                                      </DropdownItem>
                                    </li>
                                  </ul>
                                </DropdownMenu>
                              </UncontrolledDropdown>
                            </li>
                          </ul>
                        </DataTableRow>
                      </DataTableItem>
                    );
                  })
                : null}
            </DataTableBody>
            <div className="card-inner">
              {taskInfo != undefined && taskData?.length > 0 ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={taskData?.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No tasks found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <Modal size="lg" isOpen={taskModal} toggle={toggleTaskModal}>
          <KanbanTaskForm
            toggle={toggleTaskModal}
            list={listInfo?.lists}
            users={data?.assigned_users}
            stuffList={stuffList}
            labelsSet={data?.labels}
            report_id={projectId}
          />
        </Modal>
        <Modal size="lg" isOpen={editTaskModal} toggle={toggleEditTaskModal}>
          <KanbanTaskForm
            toggle={toggleEditTaskModal}
            list={listInfo?.lists}
            users={data?.assigned_users}
            stuffList={stuffList}
            labelsSet={data?.labels}
            editTask={editForm}
            stuffNames={usersNames}
          />
        </Modal>
      </Content>
      <ToastContainer />
    </>
  );
};

export default TaskListPage;
