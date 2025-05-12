import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import { Icon, Button, Col, RSelect } from "../../../components/Component";
import { teamList, projectStatus } from "./ProjectData";
import { Modal, ModalBody, Form, Spinner, Badge } from "reactstrap";
import { useForm } from "react-hook-form";
import { useGetStaffQuery } from "../../../Services/UserService";

const FormModal = ({
  modal,
  closeModal,
  onSubmit,
  formData,
  setFormData,
  modalType,
  isLoading,
}) => {
  //service calls
  const [input, setInput] = useState({
    title: "",
  });
  const { data: staffList } = useGetStaffQuery();

  useEffect(() => {
    reset(formData);
  }, [formData]);

  const staff = staffList?.map(({ id, username }) => ({
    label: username,
    value: id,
  }));

  const handleLabel = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (formData.labels != undefined) {
        const temp = [...formData.labels];
        temp.push(input);
        setFormData({ ...formData, labels: temp });
        setInput({ title: "" });
      }
    }
  };

  const handleRemove = (idx) => {
    const temp = [...formData.labels];
    temp.splice(idx, 1);
    setFormData({ ...formData, labels: temp });
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <Modal
      isOpen={modal}
      toggle={() => closeModal()}
      className="modal-dialog-centered"
      size="lg"
    >
      <ModalBody>
        <a
          href="#cancel"
          onClick={(ev) => {
            ev.preventDefault();
            closeModal();
          }}
          className="close"
        >
          <Icon name="cross-sm"></Icon>
        </a>
        <div className="p-2">
          <h5 className="title">
            {modalType === "add" && "Add Project"}{" "}
            {modalType === "edit" && "Update Project"}
          </h5>
          <div className="mt-4">
            <Form className="row gy-4" onSubmit={handleSubmit(onSubmit)}>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    {...register("title", {
                      required: "This field is required",
                    })}
                    value={formData.title}
                    placeholder="Enter Title"
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="form-control"
                  />
                  {errors.title && (
                    <span className="invalid">{errors.title.message}</span>
                  )}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Client</label>
                  <input
                    type="text"
                    {...register("client_name", {
                      required: "This field is required",
                    })}
                    value={formData.client_name}
                    placeholder="Enter client name"
                    onChange={(e) =>
                      setFormData({ ...formData, client_name: e.target.value })
                    }
                    className="form-control"
                  />
                  {errors.client_name && (
                    <span className="invalid">
                      {errors.client_name.message}
                    </span>
                  )}
                </div>
              </Col>
              <Col size="12">
                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    {...register("description", {
                      required: "This field is required",
                    })}
                    value={formData.description}
                    placeholder="Your description"
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="form-control-xl form-control no-resize"
                  />
                  {errors.description && (
                    <span className="invalid">
                      {errors.description.message}
                    </span>
                  )}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Project Tags</label>
                  <input
                    type="text"
                    value={input.title}
                    placeholder="Enter Label Name"
                    onChange={(e) =>
                      setInput({ ...input, title: e.target.value.trim() })
                    }
                    onKeyDown={handleLabel}
                    className="form-control"
                  />
                  {errors.title && (
                    <span className="invalid">{errors.title.message}</span>
                  )}

                  <div className="row mt-1">
                    {formData?.labels?.map((item, idx) => (
                      <div className="col-3" key={idx}>
                        <Badge
                          color="primary"
                          onClick={() => handleRemove(idx)}
                        >
                          x {item.title}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Deadline Date</label>
                  <DatePicker
                    selected={formData.project_deadline}
                    className="form-control"
                    onChange={(date) =>
                      setFormData({ ...formData, project_deadline: date })
                    }
                    minDate={new Date()}
                  />
                </div>
              </Col>
              {/* {modalType === "add" && ( */}
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Team Members</label>
                  <RSelect
                    options={staff}
                    value={formData.assigned_users}
                    isMulti
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_users: e })
                    }
                  />
                </div>
              </Col>
              {/* )} */}
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Project Status</label>
                  <RSelect
                    options={projectStatus}
                    value={formData.project_status}
                    onChange={(e) =>
                      setFormData({ ...formData, project_status: e })
                    }
                  />
                </div>
              </Col>

              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      {isLoading ? (
                        <Spinner size="sm" color="light" />
                      ) : modalType === "add" ? (
                        "Add Project"
                      ) : (
                        "Update Project"
                      )}
                    </Button>
                  </li>
                  <li>
                    <Button
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </Button>
                  </li>
                </ul>
              </Col>
            </Form>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );
};
export default FormModal;
