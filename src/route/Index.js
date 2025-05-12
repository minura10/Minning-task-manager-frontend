import React, { useLayoutEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { UserContextProvider } from "../pages/pre-built/user-manage/UserContext";

import Homepage from "../pages/Homepage";
import ProjectCardPage from "../pages/pre-built/projects/ProjectCard";
import ProjectListPage from "../pages/pre-built/projects/ProjectList";
import UserListCompact from "../pages/pre-built/user-manage/UserListCompact";
import UserProfileRegular from "../pages/pre-built/user-manage/UserProfileRegular";
import Kanban from "../pages/app/kanban/Kanban";
import TaskListPage from "../pages/app/taskList/TaskList";
import RoomsPage from "../pages/pre-built/Rooms/Rooms";
import CategoryPage from "../pages/pre-built/Categories/Category";

import Error404Modern from "../pages/error/404-modern";

import Login from "../pages/auth/Login";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Success from "../pages/auth/Success";

import Layout from "../layout/Index";
import LayoutNoSidebar from "../layout/Index-nosidebar";
import { ProtectedRoute } from "./ProtectedRoutes";

const Router = () => {
  const location = useLocation();
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <Routes>
      <Route
        path={`${process.env.PUBLIC_URL}`}
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Homepage />}></Route>

        <Route path="project-card" element={<ProjectCardPage />}></Route>
        <Route path="project-list" element={<ProjectListPage />}></Route>
        <Route path="rooms" element={<RoomsPage />}></Route>
        <Route path="categories" element={<CategoryPage />}></Route>

        <Route element={<UserContextProvider />}>
          <Route path="user-list-compact" element={<UserListCompact />}></Route>
        </Route>

        <Route>
          <Route
            path="user-profile-regular"
            element={<UserProfileRegular />}
          ></Route>
        </Route>

        <Route path="app-kanban/:projectId" element={<Kanban />}></Route>
        <Route path="task-list/:projectId" element={<TaskListPage />}></Route>
      </Route>
      <Route path={`${process.env.PUBLIC_URL}`} element={<LayoutNoSidebar />}>
        <Route path="auth-success" element={<Success />}></Route>
        <Route path="auth-reset" element={<ForgotPassword />}></Route>
        <Route path="auth-login" element={<Login />}></Route>

        <Route path="*" element={<Error404Modern />}></Route>
      </Route>
    </Routes>
  );
};
export default Router;
