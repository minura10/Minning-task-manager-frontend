import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";

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
  PreviewCard,
} from "../../components/Component";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "../../Services/AuthService";

const ForgotPassword = () => {
  //service calls
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const [email, setEmail] = useState("");

  const sendResetLink = async (e) => {
    e.preventDefault();
    if (email === "") {
      toast.error("Please enter your valid email.", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });

      return;
    }

    const res = await forgotPassword({ email: email });

    if (res.data) {
      toast.success("Password reset link sended to your mail", {
        position: "top-right",
        autoClose: true,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: false,
      });
      setEmail("");
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

  return (
    <>
      <Head title="Forgot-Password" />
      <Block className="nk-block-middle nk-auth-body  wide-xs">
        <div className="brand-logo pb-4 text-center">
          <Link to={process.env.PUBLIC_URL + "/"} className="logo-link">
            <img
              className="logo-light logo-img logo-img-lg"
              src={Logo}
              alt="logo"
            />
            <img
              className="logo-dark logo-img logo-img-lg"
              src={LogoDark}
              alt="logo-dark"
            />
          </Link>
        </div>
        <PreviewCard className="card-bordered" bodyClass="card-inner-lg">
          <BlockHead>
            <BlockContent>
              <BlockTitle tag="h5">Reset password</BlockTitle>
              <BlockDes>
                <p>
                  If you forgot your password, well, then we’ll email you
                  instructions to reset your password.
                </p>
              </BlockDes>
            </BlockContent>
          </BlockHead>
          <form>
            <div className="form-group">
              <div className="form-label-group">
                <label className="form-label" htmlFor="default-01">
                  Email
                </label>
              </div>
              <input
                type="text"
                value={email}
                className="form-control form-control-lg"
                id="default-01"
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <Button
                color="primary"
                size="lg"
                className="btn-block"
                onClick={sendResetLink}
              >
                Send Reset Link
              </Button>
            </div>
          </form>
          <div className="form-note-s2 text-center pt-4">
            <Link to={`${process.env.PUBLIC_URL}/auth-login`}>
              <strong>Return to login</strong>
            </Link>
          </div>
        </PreviewCard>
      </Block>
      <AuthFooter />
      <ToastContainer />
    </>
  );
};
export default ForgotPassword;
