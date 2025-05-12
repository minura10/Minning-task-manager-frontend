import React, { useState } from "react";
import Logo from "../../images/logo.png";
import LogoDark from "../../images/logo-dark.png";
import Head from "../../layout/head/Head";
import AuthFooter from "./AuthFooter";
import {
  Block,
  BlockContent,
  BlockDes,
  BlockHead,
  BlockTitle,
  Button,
  Icon,
  PreviewCard,
} from "../../components/Component";
import { Form, Spinner, Alert } from "reactstrap";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

//services
import { useSignInMutation } from "../../Services/AuthService";
import constant from "../../constant";

const Login = () => {
  const [passState, setPassState] = useState(false);
  const [errorVal, setError] = useState("");

  //service function
  const [signIn, { isLoading }] = useSignInMutation();

  const onFormSubmit = async (formData) => {
    const res = await signIn(formData);

    console.log("rees", res);

    if (res.data) {
      localStorage.setItem(constant.Token, res.data?.data.token);
      setTimeout(() => {
        window.history.pushState(
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`,
          "auth-login",
          `${process.env.PUBLIC_URL ? process.env.PUBLIC_URL : "/"}`
        );
        window.location.reload();
      }, 1000);
    } else {
      setTimeout(() => {
        setError(res.error.data.message);
      }, 1000);
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  return (
    <>
      <Head title="Login" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            <img
              className="logo-light logo-img logo-img-lg"
              src={Logo}
              alt="logo"
            />
          </Link>
        </div>

        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h4">Sign-In</BlockTitle>
              <BlockDes>
                <p>Access ProjectMinning using your email and passcode.</p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          {errorVal && (
            <div className="mb-3">
              <Alert color="danger" className="alert-icon">
                <Icon name="alert-circle" /> {errorVal}
              </Alert>
            </div>
          )}
          <Form className="is-alter" onSubmit={handleSubmit(onFormSubmit)}>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Email or Username
                </label>
              </div>
              <div className="form-control-wrap">
                <input
                  type="text"
                  id="default-01"
                  {...register("email", { required: "This field is required" })}
                  placeholder="Enter your email address"
                  className="form-control-lg form-control"
                />
                {errors.email && (
                  <span className="invalid">{errors.email.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="password">
                  Password
                </label>
                <Link
                  className="link link-primary link-sm"
                  to={`${process.env.PUBLIC_URL}/auth-reset`}
                >
                  Forgot Code?
                </Link>
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
                  <Icon name="eye" className="passcode-icon icon-show"></Icon>

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
                  placeholder="Enter your password"
                  className={`form-control-lg form-control ${
                    passState ? "is-hidden" : "is-shown"
                  }`}
                />
                {errors.password && (
                  <span className="invalid">{errors.password.message}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <Button
                size="lg"
                className="btn-block"
                type="submit"
                color="primary"
              >
                {isLoading ? <Spinner size="sm" color="light" /> : "Sign in"}
              </Button>
            </div>
          </Form>
          {/* <div className="form-note-s2 text-center pt-4">
            New on our platform?{" "}
            <Link to={`${process.env.PUBLIC_URL}/auth-register`}>
              Create an account
            </Link>
          </div> */}
        </PreviewCard>
      </Block>
      <AuthFooter />
    </>
  );
};
export default Login;
