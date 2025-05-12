import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  Progress,
  DropdownItem,
  Badge,
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
import FormModal from "./FormModal";

import {
  useAddProjectsMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../../Services/ProjectService";
import { useGetNamesQuery } from "../../../Services/UserService";
import { Link } from "react-router-dom";

export const ProjectListPage = () => {
  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    edit: false,
    add: false,
  });
  const [formData, setFormData] = useState({
    title: "",
    client_name: "",
    description: "",
    assigned_users: [],
    project_deadline: new Date(),
    project_status: "",
    labels: [],
  });
  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    client_name: "",
    description: "",
    assigned_users: [],
    project_deadline: new Date(),
    project_status: "",
    labels: [],
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(7);

  //services calls
  const { data: projectInfo } = useGetProjectsQuery();
  const [addProject, { isLoading }] = useAddProjectsMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: stuffNames } = useGetNamesQuery();

  const [data, setData] = useState(projectInfo);
  const [trans, setTrans] = useState("");

  useEffect(() => {
    setData(projectInfo);
  }, [projectInfo]);

  useEffect(() => {
    let filteredData;
    if (trans === "open") {
      filteredData = projectInfo.filter(
        (item) => item.project_status === "open"
      );
    } else if (trans === "ongoing") {
      filteredData = projectInfo.filter(
        (item) => item.project_status === "ongoing"
      );
    } else if (trans === "closed") {
      filteredData = projectInfo.filter(
        (item) => item.project_status === "closed"
      );
    } else {
      filteredData = projectInfo;
    }
    setData(filteredData);
  }, [trans]);

  // function to reset the form
  const resetForm = () => {
    setFormData({
      title: "",
      client_name: "",
      description: "",
      assigned_users: [],
      project_deadline: new Date(),
      project_status: "",
      labels: [],
    });
  };

  const closeModal = () => {
    setModal({ add: false });
    resetForm();
  };

  const closeEditModal = () => {
    setModal({ edit: false });
    resetForm();
  };

  // submit function to add a new item
  const onFormSubmit = async (sData) => {
    const {
      title,
      client_name,
      description,
      project_status,
      assigned_users,
      project_deadline,
      labels,
    } = sData;

    let submittedData = {
      title: title,
      client_name: client_name,
      description: description,
      assigned_users: assigned_users.map(({ value }) => value),
      project_deadline: new Date(`${project_deadline}`), // Format ** mm/dd/yyyy
      project_status: project_status.value,
      lists: [],
      labels: labels,
    };

    const res = await addProject(submittedData);

    if (res.data) {
      toast.success("New project created successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });

      resetForm();
      setModal({ add: false });
    } else {
      resetForm();
      setModal({ add: false });
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
  };

  // submit function to update a new item
  const onEditSubmit = async (sData) => {
    const {
      id,
      title,
      client_name,
      description,
      project_status,
      project_deadline,
      assigned_users,
      labels,
    } = sData;

    let data = {
      title: title,
      client_name: client_name,
      description: description,
      project_deadline: new Date(`${project_deadline}`), // Format ** mm/dd/yyyy
      project_status: project_status.value,
      assigned_users: assigned_users.map(({ value }) => value),
      labels: labels,
    };

    const res = await updateProject({ data, id });

    if (res.data) {
      toast.success("Project updated successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      setModal({ edit: false });
      resetForm();
    } else {
      setModal({ edit: false });
      resetForm();
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
  };

  // function that loads the want to editted data
  const onEditClick = (id) => {
    projectInfo.forEach((item) => {
      if (item._id === id) {
        setEditFormData({
          id: id,
          title: item.title,
          client_name: item.client_name,
          description: item.description,
          project_deadline: new Date(item.project_deadline), // Format ** mm/dd/yyyy
          project_status: {
            label: capitalizeFirstLetter(item.project_status),
            value: item.project_status,
          },
          assigned_users: item.assigned_users.map((item) => ({
            value: item,
            label: stuffNames?.find((i) => i._id === item)?.username,
          })),
        });
        setModal({ edit: true }, { add: false });
      }
    });
  };

  // function to change the complete a project property
  const completeProject = async (id) => {
    let data = {
      project_status: "closed",
    };

    const res = await updateProject({ data, id });

    if (res.data) {
      toast.success("Project marked as successfully", {
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
  };

  // Get current list, pagination
  const indexOfLastItem = currentPage * itemPerPage;
  const indexOfFirstItem = indexOfLastItem - itemPerPage;
  const currentItems = data?.slice(indexOfFirstItem, indexOfLastItem);

  // Change Page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <Head title="Project List"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Projects</BlockTitle>
              <BlockDes className="text-soft">
                You have total{" "}
                {projectInfo !== undefined && projectInfo?.length} projects
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
                                  setTrans("open");
                                }}
                              >
                                <span>Open</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("closed");
                                }}
                              >
                                <span>Closed</span>
                              </DropdownItem>
                            </li>
                            <li>
                              <DropdownItem
                                tag="a"
                                onClick={() => {
                                  setTrans("ongoing");
                                }}
                              >
                                <span>OnGoing</span>
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
                      <Button color="primary">
                        <Icon name="plus"></Icon>
                        <span>Add Project</span>
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
                  <span className="sub-text">Project Name</span>
                </DataTableRow>
                <DataTableRow size="xxl">
                  <span className="sub-text">Client</span>
                </DataTableRow>
                <DataTableRow size="lg">
                  <span className="sub-text">Team</span>
                </DataTableRow>
                <DataTableRow size="xxl">
                  <span className="sub-text">Status</span>
                </DataTableRow>
                <DataTableRow size="mb">
                  <span className="sub-text">Deadline</span>
                </DataTableRow>
                <DataTableRow className="nk-tb-col-tools text-end">
                  <span className="sub-text">Option</span>
                </DataTableRow>
              </DataTableHead>
              {currentItems !== undefined
                ? currentItems.map((item) => {
                    var days = calculateDaysLeft(item.project_deadline);
                    return (
                      <DataTableItem key={item.id}>
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
                              text={findUpper(item.title)}
                            />
                            <div className="project-info">
                              <h6 className="title">{item.title}</h6>
                            </div>
                          </a>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <span>{item.client_name}</span>
                        </DataTableRow>

                        <DataTableRow size="lg">
                          <ul className="project-users g-1">
                            {item?.assigned_users
                              ?.slice(0, 2)
                              .map((item, idx) => {
                                return (
                                  <li key={idx}>
                                    <UserAvatar
                                      className="sm"
                                      text={findUpper(
                                        stuffNames?.find((i) => i._id === item)
                                          ?.username
                                      )}
                                      theme="purple"
                                    />
                                  </li>
                                );
                              })}
                            {item?.assigned_users?.length > 2 && (
                              <li>
                                <UserAvatar
                                  theme="light"
                                  className="sm"
                                  text={`+${item?.assigned_users?.length - 2}`}
                                />
                              </li>
                            )}
                          </ul>
                        </DataTableRow>
                        <DataTableRow size="xxl">
                          <Badge
                            className="badge-dim"
                            color={
                              item.project_status === "open"
                                ? "success"
                                : item.project_status === "ongoing"
                                ? "warning"
                                : item.project_status === "closed" && "light"
                            }
                          >
                            <span>
                              {item.project_status === "open"
                                ? "Open"
                                : item.project_status === "ongoing"
                                ? "OnGoing"
                                : "Closed"}
                            </span>
                          </Badge>
                        </DataTableRow>

                        <DataTableRow size="mb">
                          <Badge
                            className="badge-dim"
                            color={
                              days > 10
                                ? "light"
                                : days <= 10 && days >= 2
                                ? "warning"
                                : days === 1
                                ? "danger"
                                : days <= 0 && "success"
                            }
                          >
                            <Icon name="clock"></Icon>
                            <span>
                              {days <= 0
                                ? "Done"
                                : days === 1
                                ? "Due Tomorrow"
                                : days + " Days Left"}
                            </span>
                          </Badge>
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
                                    <li onClick={() => onEditClick(item._id)}>
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

                                    <li
                                      onClick={() => completeProject(item._id)}
                                    >
                                      <DropdownItem
                                        tag="a"
                                        href="#markasdone"
                                        onClick={(ev) => {
                                          ev.preventDefault();
                                        }}
                                      >
                                        <Icon name="check-round-cut"></Icon>
                                        <span>Mark As Done</span>
                                      </DropdownItem>
                                    </li>

                                    <li>
                                      <Link
                                        to={`${process.env.PUBLIC_URL}/task-list/${item._id}`}
                                      >
                                        <Icon name="grid-alt"></Icon>
                                        <span>Open Tasks</span>
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={`${process.env.PUBLIC_URL}/app-kanban/${item._id}`}
                                      >
                                        <Icon name="grid-alt"></Icon>
                                        <span>Open kanban</span>
                                      </Link>
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
              {projectInfo !== undefined ? (
                <PaginationComponent
                  itemPerPage={itemPerPage}
                  totalItems={projectInfo?.length}
                  paginate={paginate}
                  currentPage={currentPage}
                />
              ) : (
                <div className="text-center">
                  <span className="text-silent">No projects found</span>
                </div>
              )}
            </div>
          </DataTable>
        </Block>

        <FormModal
          modal={modal.add}
          modalType="add"
          formData={formData}
          setFormData={setFormData}
          closeModal={closeModal}
          onSubmit={onFormSubmit}
          isLoading={isLoading}
        />
        <FormModal
          modal={modal.edit}
          modalType="edit"
          formData={editFormData}
          setFormData={setEditFormData}
          closeModal={closeEditModal}
          onSubmit={onEditSubmit}
          isLoading={isUpdating}
        />
      </Content>
      <ToastContainer />
    </>
  );
};

export default ProjectListPage;
