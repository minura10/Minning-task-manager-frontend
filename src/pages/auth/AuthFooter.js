import React from "react";
import { Row, Col } from "../../components/Component";

const AuthFooter = () => {
  return (
    <div className="nk-footer nk-auth-footer-full">
      <div className="container wide-lg">
        <Row>
          <Col lg="12">
            <p className="text-center text-soft">
              &copy; 2024 ProjectMinning. All Rights Reserved.
            </p>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default AuthFooter;
