import React, { useEffect, useState } from "react";
import { Modal, ModalBody, Form } from "reactstrap";
import { Icon, Col, Button, RSelect } from "../../../components/Component";
import { useForm } from "react-hook-form";

const AddModal = ({
  modal,
  closeModal,
  onSubmit,
  formData,
  setFormData,
  filterStatus,
}) => {
  const [confirmPassState, setConfirmState] = useState(false);
  const [passState, setPassState] = useState(false);

  useEffect(() => {
    reset(formData);
  }, [formData]);

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
          <h5 className="title">Add User</h5>
          <div className="mt-4">
            <Form
              className="row gy-4"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Username</label>
                  <input
                    className="form-control"
                    type="text"
                    {...register("username", {
                      required: "This field is required",
                    })}
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    placeholder="Enter username"
                  />
                  {errors.username && (
                    <span className="invalid">{errors.username.message}</span>
                  )}
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <label className="form-label">Email </label>
                  <input
                    className="form-control"
                    type="email"
                    {...register("email", {
                      required: "This field is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "invalid email address",
                      },
                    })}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                  {errors.email && (
                    <span className="invalid">{errors.email.message}</span>
                  )}
                </div>
              </Col>

              <Col md="6">
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Password
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setPassState(!passState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${
                        passState ? "is-hidden" : "is-shown"
                      }`}
                    >
                      <Icon
                        name="eye"
                        className="passcode-icon icon-show"
                      ></Icon>

                      <Icon
                        name="eye-off"
                        className="passcode-icon icon-hide"
                      ></Icon>
                    </a>
                    <input
                      type={passState ? "text" : "password"}
                      id="password"
                      {...register("password", {
                        required: "This field is required",
                      })}
                      placeholder="Enter your passcode"
                      className={`form-control-lg form-control ${
                        passState ? "is-hidden" : "is-shown"
                      }`}
                    />
                    {errors.password && (
                      <span className="invalid">{errors.password.message}</span>
                    )}
                  </div>
                </div>
              </Col>
              <Col md="6">
                <div className="form-group">
                  <div className="form-label-group">
                    <label className="form-label" htmlFor="password">
                      Confirm Password
                    </label>
                  </div>
                  <div className="form-control-wrap">
                    <a
                      href="#password"
                      onClick={(ev) => {
                        ev.preventDefault();
                        setConfirmState(!confirmPassState);
                      }}
                      className={`form-icon lg form-icon-right passcode-switch ${
                        confirmPassState ? "is-hidden" : "is-shown"
                      }`}
                    >
                      <Icon
                        name="eye"
                        className="passcode-icon icon-show"
                      ></Icon>

                      <Icon
                        name="eye-off"
                        className="passcode-icon icon-hide"
                      ></Icon>
                    </a>
                    <input
                      type={confirmPassState ? "text" : "password"}
                      id="confirm_password"
                      {...register("confirm_password", {
                        required: "This field is required",
                      })}
                      placeholder="Enter your passcode"
                      className={`form-control-lg form-control ${
                        confirmPassState ? "is-hidden" : "is-shown"
                      }`}
                    />
                    {errors.confirm_password && (
                      <span className="invalid">
                        {errors.confirm_password.message}
                      </span>
                    )}
                  </div>
                </div>
              </Col>

              <Col md="12">
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <div className="form-control-wrap">
                    <RSelect
                      options={filterStatus}
                      value={{
                        value: formData.status,
                        label: formData.status === true ? "Active" : "Disabled",
                      }}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.value })
                      }
                    />
                  </div>
                </div>
              </Col>
              <Col size="12">
                <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                  <li>
                    <Button color="primary" size="md" type="submit">
                      Add User
                    </Button>
                  </li>
                  <li>
                    <a
                      href="#cancel"
                      onClick={(ev) => {
                        ev.preventDefault();
                        closeModal();
                      }}
                      className="link link-light"
                    >
                      Cancel
                    </a>
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
export default AddModal;
