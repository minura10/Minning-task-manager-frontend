import React, { useState, useEffect } from "react";
import Content from "../../../layout/content/Content";
import { Card } from "reactstrap";
import Head from "../../../layout/head/Head";
import DatePicker from "react-datepicker";
import { Modal, ModalBody } from "reactstrap";
import {
  Block,
  BlockBetween,
  BlockDes,
  BlockHead,
  BlockHeadContent,
  BlockTitle,
  Icon,
  Row,
  Col,
  Button,
  RSelect,
} from "../../../components/Component";
import UserProfileAside from "./UserProfileAside";
import {
  useGetUserInfoQuery,
  useUpdateUserMutation,
} from "../../../Services/UserService";
import { ToastContainer, toast } from "react-toastify";

const UserProfileRegularPage = () => {
  const [sm, updateSm] = useState(false);
  const [mobileView, setMobileView] = useState(false);

  const [modalTab, setModalTab] = useState("1");

  const [modal, setModal] = useState(false);

  //services calls
  const { data: userInfo } = useGetUserInfoQuery();
  const [updateUser, { isLoading }] = useUpdateUserMutation();
  const [formData, setFormData] = useState({
    username: userInfo?.user?.username,
    email: userInfo?.user?.email,
  });

  const onInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitForm = async () => {
    let submitData = {
      ...formData,
    };
    const res = await updateUser(submitData);

    if (res.data) {
      toast.success("User details updated successfully", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      setModal(false);
    } else {
      setModal(false);
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

  // function to change the design view under 990 px
  const viewChange = () => {
    if (window.innerWidth < 990) {
      setMobileView(true);
    } else {
      setMobileView(false);
      updateSm(false);
    }
  };

  useEffect(() => {
    viewChange();
    window.addEventListener("load", viewChange);
    window.addEventListener("resize", viewChange);
    document
      .getElementsByClassName("nk-header")[0]
      .addEventListener("click", function () {
        updateSm(false);
      });
    return () => {
      window.removeEventListener("resize", viewChange);
      window.removeEventListener("load", viewChange);
    };
  }, []);

  return (
    <React.Fragment>
      <Head title="User List - Profile"></Head>
      <Content>
        <Card className="card-bordered">
          <div className="card-aside-wrap">
            <div
              className={`card-aside card-aside-left user-aside toggle-slide toggle-slide-left toggle-break-lg ${
                sm ? "content-active" : ""
              }`}
            >
              <UserProfileAside updateSm={updateSm} sm={sm} data={userInfo} />
            </div>
            <div className="card-inner card-inner-lg">
              {sm && mobileView && (
                <div
                  className="toggle-overlay"
                  onClick={() => updateSm(!sm)}
                ></div>
              )}
              <BlockHead size="lg">
                <BlockBetween>
                  <BlockHeadContent>
                    <BlockTitle tag="h4">Personal Information</BlockTitle>
                    <BlockDes>
                      <p>
                        Basic info, like your name and address, that you use on
                        Nio Platform.
                      </p>
                    </BlockDes>
                  </BlockHeadContent>
                  <BlockHeadContent className="align-self-start d-lg-none">
                    <Button
                      className={`toggle btn btn-icon btn-trigger mt-n1 ${
                        sm ? "active" : ""
                      }`}
                      onClick={() => updateSm(!sm)}
                    >
                      <Icon name="menu-alt-r"></Icon>
                    </Button>
                  </BlockHeadContent>
                </BlockBetween>
              </BlockHead>

              <Block>
                <div className="nk-data data-list">
                  <div className="data-head">
                    <h6 className="overline-title">Basics</h6>
                  </div>
                  <div className="data-item" onClick={() => setModal(true)}>
                    <div className="data-col">
                      <span className="data-label">Full Name</span>
                      <span className="data-value">
                        {userInfo?.user?.username}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more">
                        <Icon name="forward-ios"></Icon>
                      </span>
                    </div>
                  </div>

                  <div className="data-item">
                    <div className="data-col">
                      <span className="data-label">Email</span>
                      <span className="data-value">
                        {userInfo?.user?.email}
                      </span>
                    </div>
                    <div className="data-col data-col-end">
                      <span className="data-more disable">
                        <Icon name="lock-alt"></Icon>
                      </span>
                    </div>
                  </div>
                </div>
              </Block>

              <Modal
                isOpen={modal}
                className="modal-dialog-centered"
                size="lg"
                toggle={() => setModal(false)}
              >
                <a
                  href="#dropdownitem"
                  onClick={(ev) => {
                    ev.preventDefault();
                    setModal(false);
                  }}
                  className="close"
                >
                  <Icon name="cross-sm"></Icon>
                </a>
                <ModalBody>
                  <div className="p-2">
                    <h5 className="title">Update Profile</h5>
                    <ul className="nk-nav nav nav-tabs">
                      <li className="nav-item">
                        <a
                          className={`nav-link ${modalTab === "1" && "active"}`}
                          onClick={(ev) => {
                            ev.preventDefault();
                            setModalTab("1");
                          }}
                          href="#personal"
                        >
                          Personal
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content">
                      <div
                        className={`tab-pane ${
                          modalTab === "1" ? "active" : ""
                        }`}
                        id="personal"
                      >
                        <Row className="gy-4">
                          <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="full-name">
                                Full Name
                              </label>
                              <input
                                type="text"
                                id="full-name"
                                className="form-control"
                                name="username"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.username}
                                placeholder="Enter Full name"
                              />
                            </div>
                          </Col>
                          <Col md="6">
                            <div className="form-group">
                              <label
                                className="form-label"
                                htmlFor="display-name"
                              >
                                Email Address
                              </label>
                              <input
                                type="email"
                                id="email"
                                className="form-control"
                                name="email"
                                disabled
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.email}
                                placeholder="Enter email address"
                              />
                            </div>
                          </Col>
                          {/* <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="phone-no">
                                Phone Number
                              </label>
                              <input
                                type="number"
                                id="phone-no"
                                className="form-control"
                                name="phone"
                                onChange={(e) => onInputChange(e)}
                                defaultValue={formData.phone}
                                placeholder="Phone Number"
                              />
                            </div>
                          </Col> */}
                          {/* <Col md="6">
                            <div className="form-group">
                              <label className="form-label" htmlFor="birth-day">
                                Date of Birth
                              </label>
                              <DatePicker
                                selected={new Date(formData.dob)}
                                className="form-control"
                                onChange={(date) =>
                                  setFormData({
                                    ...formData,
                                    dob: getDateStructured(date),
                                  })
                                }
                                maxDate={new Date()}
                              />
                            </div>
                          </Col> */}
                          {/* <Col size="12">
                            <div className="custom-control custom-switch">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="latest-sale"
                              />
                              <label
                                className="custom-control-label"
                                htmlFor="latest-sale"
                              >
                                Use full name to display{" "}
                              </label>
                            </div>
                          </Col> */}
                          <Col size="12">
                            <ul className="align-center flex-wrap flex-sm-nowrap gx-4 gy-2">
                              <li>
                                <Button
                                  color="primary"
                                  size="lg"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    submitForm();
                                  }}
                                >
                                  Update Profile
                                </Button>
                              </li>
                              <li>
                                <a
                                  href="#dropdownitem"
                                  onClick={(ev) => {
                                    ev.preventDefault();
                                    setModal(false);
                                  }}
                                  className="link link-light"
                                >
                                  Cancel
                                </a>
                              </li>
                            </ul>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </div>
          </div>
        </Card>
      </Content>
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserProfileRegularPage;
