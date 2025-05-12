import React, { useState } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import { toast } from "react-toastify";
import { ModalBody, Col, Spinner } from "reactstrap";
import { Icon, Button, RSelect } from "../../../components/Component";
import { getDateStructured } from "../../../utils/Utils";
import { useForm } from "react-hook-form";
import { ColorOptions } from "../../../components/partials/color-select-menu/ColorMenu";
import { themes } from "./KanbanData";

import {
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "../../../Services/ProjectService";

export const KanbanTaskForm = ({
  toggle,
  editTask,
  list,
  users,
  stuffList,
  labelsSet,
  report_id,
  stuffNames,
  handleDelete,
}) => {
  //service calls
  const [addTask, { isLoading }] = useAddTaskMutation();
  const [updateTask, { isLoading: isUpdating }] = useUpdateTaskMutation();

  const [formData, setFormData] = useState({
    list_id: editTask ? editTask.id : "",
    title: editTask ? editTask.title : "",
    description: editTask ? editTask.desc : "",
    task_deadline: editTask ? new Date(editTask.task_deadline) : new Date(),
    labels: editTask
      ? editTask?.tags?.map((tag) => ({
          value: tag,
          label: labelsSet.find((i) => i._id === tag)?.title,
        }))
      : [],
    members: editTask
      ? editTask?.members?.map((item) => ({
          value: item,
          label: stuffNames?.find((i) => i._id === item)?.username,
        }))
      : [],
  });

  const resetForm = () => {
    setFormData({
      list_id: "",
      title: "",
      description: "",
      task_deadline: new Date(),
      labels: [],
      members: [],
    });
  };

  const boardData =
    list &&
    list?.map(({ _id, title }) => ({
      label: title,
      value: _id,
    }));

  const stuff = users?.map((item) => ({
    label: stuffList?.find((i) => i.id === item)?.username,
    value: item,
  }));

  const labelsData = labelsSet?.map(({ title, _id }) => ({
    value: _id,
    label: title,
  }));

  const submitForm = async () => {
    let data;
    if (editTask) {
      data = {
        list_id: editTask.list_id,
        title: formData.title,
        description: formData.description,
        task_deadline: formData.task_deadline,
        task_id: editTask.id,
        members: formData.members.map(({ value }) => value),
        labels: formData.labels.map(({ value }) => value),
      };

      const report_id = editTask.report_id;

      const res = await updateTask({ data, report_id });

      if (res.data) {
        toast.success("Task updated successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        resetForm();
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
    } else {
      data = {
        list_id: formData.list_id,
        title: formData.title,
        description: formData.description,
        labels: formData.labels.map(({ value }) => value),
        members: formData.members.map(({ value }) => value),
        task_deadline: formData.task_deadline,
      };

      const res = await addTask({ data, report_id });

      if (res.data) {
        toast.success("New task created successfully", {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
        resetForm();
      } else {
        toast.error(res.error, {
          position: "top-right",
          autoClose: true,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: false,
        });
      }
    }

    toggle();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <ModalBody>
      <a
        href="#cancel"
        onClick={(ev) => {
          ev.preventDefault();
          toggle();
        }}
        className="close"
      >
        <Icon name="cross-sm"></Icon>
      </a>
      <div className="p-2">
        <h5 className="title">{editTask ? "Update" : "Add"} Task</h5>
        <div className="mt-4">
          <form className="row gy-4" onSubmit={handleSubmit(submitForm)}>
            <Col sm="6">
              <div className="form-group">
                <label className="form-label">Task Title</label>
                <input
                  type="text"
                  {...register("title", { required: "This field is required" })}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="form-control"
                />
                {errors.title && (
                  <span className="invalid">{errors.title.message}</span>
                )}
              </div>
            </Col>
            {!editTask && (
              <Col sm="6">
                <div className="form-group">
                  <label className="form-label">Select Board</label>
                  <RSelect
                    // defaultValue={
                    //   taskToBoard
                    //     ? boardOptions.find((item) => item.id === taskToBoard.id)
                    //     : boardOptions[0]
                    // }
                    // isDisabled={taskToBoard ? true : false}
                    options={boardData}
                    placeholder="Select a board"
                    onChange={(e) => {
                      setFormData({ ...formData, list_id: e.value });
                    }}
                  />
                </div>
              </Col>
            )}
            <Col className="col-12">
              <div className="form-group">
                <label className="form-label">Task Description</label>
                <textarea
                  {...register("description", {
                    required: "This field is required",
                  })}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="form-control no-resize"
                />
                {errors.description && (
                  <span className="invalid">{errors.description.message}</span>
                )}
              </div>
            </Col>
            <Col sm="6">
              <div className="form-group">
                <label className="form-label">Task Deadline</label>
                <DatePicker
                  selected={formData.task_deadline}
                  onChange={(date) =>
                    setFormData({ ...formData, task_deadline: date })
                  }
                  className="form-control date-picker"
                />
              </div>
            </Col>

            <Col sm="6">
              <div className="form-group">
                <label className="form-label">Task Tags</label>
                <RSelect
                  options={labelsData}
                  isMulti
                  defaultValue={formData.labels}
                  onChange={(e) => setFormData({ ...formData, labels: e })}
                />
              </div>
            </Col>

            {/* {!editTask && ( */}
            <Col sm="6">
              <div className="form-group">
                <label className="form-label">Users Assigned</label>
                <RSelect
                  options={stuff}
                  isMulti
                  value={formData.members}
                  onChange={(e) => setFormData({ ...formData, members: e })}
                />
              </div>
            </Col>
            {/* )} */}
            <Col className="col-12">
              <ul className="d-flex justify-content-between mt-3">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      {isLoading || isUpdating ? (
                        <Spinner size="sm" color="light" />
                      ) : editTask ? (
                        "Update Task"
                      ) : (
                        "Add Task"
                      )}
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={(ev) => {
                        ev.preventDefault();
                        toggle();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </Button>
                  </li>
                </ul>
                {editTask && (
                  <ul>
                    <li>
                      <Button
                        color="danger"
                        size="md"
                        onClick={() => handleDelete()}
                      >
                        Delete Task
                      </Button>
                    </li>
                  </ul>
                )}
              </ul>
            </Col>
          </form>
        </div>
      </div>
    </ModalBody>
  );
};

export const KanbanBoardForm = ({ toggle, data, setData, editBoard }) => {
  const [formData, setFormData] = useState({
    title: editBoard ? editBoard.text : "",
    color: editBoard
      ? themes.find((item) => item.value === editBoard.theme)
      : themes[0],
  });

  const submitForm = (returnVal) => {
    if (editBoard) {
      let defaultVal = {
        ...data,
        columns: {
          ...data.columns,
          [editBoard.id]: {
            id: editBoard.id,
            text: formData.title === "" ? editBoard.text : returnVal.title,
            theme: formData.color.value,
            tasks: editBoard.tasks,
          },
        },
      };
      setData(defaultVal);
    } else {
      let defaultVal = {
        ...data,
        columns: {
          ...data.columns,
          ["column-" + returnVal.title]: {
            id: "column-" + returnVal.title,
            text: returnVal.title,
            theme: formData.color.value,
            tasks: [],
          },
        },
        columnOrder: [...data.columnOrder, `column-${returnVal.title}`],
      };
      setData(defaultVal);
      let container = document.getElementById("kanban-container");
      container.scrollTo(container.offsetWidth, 0);
    }
    toggle();
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  return (
    <ModalBody>
      <a
        href="#cancel"
        onClick={(ev) => {
          ev.preventDefault();
          toggle();
        }}
        className="close"
      >
        <Icon name="cross-sm"></Icon>
      </a>
      <div className="p-2">
        <h5 className="title">{editBoard ? "Update" : "Add"} Board</h5>
        <div className="mt-4">
          <form className="row gy-4" onSubmit={handleSubmit(submitForm)}>
            <Col className="col-12">
              <div className="form-group">
                <label className="form-label">Board Title</label>
                <input
                  type="text"
                  {...register("title", { required: "This field is required" })}
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="form-control"
                />
                {errors.title && (
                  <span className="invalid">{errors.title.message}</span>
                )}
              </div>
            </Col>
            <Col className="col-12">
              <div className="form-group">
                <label className="form-label">Select Color</label>
                <div className="form-control-select">
                  <Select
                    className="react-select-container"
                    classNamePrefix="react-select"
                    formatOptionLabel={ColorOptions}
                    defaultValue={formData.color}
                    options={themes}
                    onChange={(e) => {
                      setFormData({ ...formData, color: e });
                    }}
                  />
                </div>
              </div>
            </Col>
            <Col className="col-12">
              <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                <li>
                  <Button color="primary" size="md" type="submit">
                    {editBoard ? "Update" : "Add"} Board
                  </Button>
                </li>
                <li>
                  <Button
                    onClick={(ev) => {
                      ev.preventDefault();
                      toggle();
                    }}
                    className="link link-light"
                  >
                    Cancel
                  </Button>
                </li>
              </ul>
            </Col>
          </form>
        </div>
      </div>
    </ModalBody>
  );
};
