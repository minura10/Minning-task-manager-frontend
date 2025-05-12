import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import constant from "../constant";

export const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem(constant.Token);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("auth-login");
    }
  }, [token]);

  if (token) {
    return children;
  }
};
