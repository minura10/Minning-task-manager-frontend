import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import Head from "../../../layout/head/Head";
import Content from "../../../layout/content/Content";
import {
  Block,
  BlockHead,
  BlockBetween,
  BlockHeadContent,
  BlockTitle,
  BlockDes,
  Icon,
  Button,
  Row,
  ProjectCard,
  UserAvatar,
  Col,
  PaginationComponent,
} from "../../../components/Component";
import {
  findUpper,
  capitalizeFirstLetter,
  calculateDaysLeft,
} from "../../../utils/Utils";
import {
  DropdownMenu,
  DropdownToggle,
  UncontrolledDropdown,
  DropdownItem,
  Badge,
} from "reactstrap";
import FormModal from "./FormModal";
import {
  useAddProjectsMutation,
  useGetProjectsQuery,
  useUpdateProjectMutation,
} from "../../../Services/ProjectService";
import {
  useGetNamesQuery,
  useGetUserInfoQuery,
} from "../../../Services/UserService";
import { Link } from "react-router-dom";

const ProjectCardPage = () => {
  //services calls
  const { data: projectInfo, isLoading: isLoadingProjects } =
    useGetProjectsQuery();
  const [addProject, { isLoading }] = useAddProjectsMutation();
  const [updateProject, { isLoading: isUpdating }] = useUpdateProjectMutation();
  const { data: userInfo } = useGetUserInfoQuery();
  const { data: stuffNames } = useGetNamesQuery();

  const [data, setData] = useState(projectInfo);
  const [trans, setTrans] = useState("");

  const [sm, updateSm] = useState(false);
  const [modal, setModal] = useState({
    add: false,
    edit: false,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemPerPage] = useState(8);
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
          labels: item.labels,
        });
        setModal({ edit: true }, { add: false });
      }
    });
  };

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
      <Head title="Project Card"></Head>
      <Content>
        <BlockHead size="sm">
          <BlockBetween>
            <BlockHeadContent>
              <BlockTitle page> Projects</BlockTitle>
              <BlockDes className="text-soft">
                {isLoadingProjects
                  ? "Loading..."
                  : ` You have total ${data?.length} projects`}
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
          <Row className="g-gs">
            {currentItems != undefined &&
              currentItems.map((item, idx) => {
                var days = calculateDaysLeft(item.project_deadline);
                return (
                  <Col sm="6" lg="4" xxl="3" key={idx}>
                    <ProjectCard>
                      <div className="project-head">
                        <a
                          href="#title"
                          onClick={(ev) => {
                            ev.preventDefault();
                          }}
                          className="project-title"
                        >
                          <UserAvatar
                            className="sq"
                            text={findUpper(item.title)}
                          />
                          <div className="project-info">
                            <h6 className="title">{item.title}</h6>
                            <span className="sub-text">{item.client_name}</span>
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
                          </div>
                        </a>
                        <UncontrolledDropdown>
                          <DropdownToggle
                            tag="a"
                            className="dropdown-toggle btn btn-sm btn-icon btn-trigger mt-n1 me-n1"
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
                                  <span>Edit Project</span>
                                </DropdownItem>
                              </li>

                              <li onClick={() => completeProject(item._id)}>
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
                                  to={`${process.env.PUBLIC_URL}/app-kanban/${item._id}`}
                                >
                                  <Icon name="grid-alt"></Icon>
                                  <span>Open Kanban</span>
                                </Link>
                              </li>
                              <li>
                                <Link
                                  to={`${process.env.PUBLIC_URL}/task-list/${item._id}`}
                                >
                                  <Icon name="grid-alt"></Icon>
                                  <span>Open Tasks</span>
                                </Link>
                              </li>
                            </ul>
                          </DropdownMenu>
                        </UncontrolledDropdown>
                      </div>
                      <div className="project-details">
                        {item?.description?.length > 90
                          ? item.description.substring(0, 89) + "... "
                          : item.description}
                      </div>

                      <div className="project-meta">
                        {userInfo.user.role === "admin" && (
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
                        )}
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
                      </div>
                    </ProjectCard>
                  </Col>
                );
              })}
          </Row>
          <div className="mt-3">
            <PaginationComponent
              itemPerPage={itemPerPage}
              totalItems={data?.length}
              paginate={paginate}
              currentPage={currentPage}
            />
          </div>
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
export default ProjectCardPage;
