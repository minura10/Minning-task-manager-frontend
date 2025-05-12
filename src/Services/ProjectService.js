import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQueries";

export const projectApi = createApi({
  reducerPath: "projectApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Projects"],
  endpoints: (build) => ({
    getProjects: build.query({
      query: () => ({
        url: "/report/",
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    getProject: build.query({
      query: ({ report_id }) => ({
        url: `/report/${report_id}`,
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    getSummary: build.query({
      query: () => ({
        url: "/report/summary",
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),

    getActiveTasksCount: build.query({
      query: () => ({
        url: `/task/activeTasks`,
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    getTasksHistory: build.query({
      query: () => ({
        url: `/report/history`,
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    getTasks: build.query({
      query: ({ report_id }) => ({
        url: `/task/all/${report_id}`,
        method: "GET",
      }),
      providesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),

    addProjects: build.mutation({
      query: (data) => ({
        url: "/report/new",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      //   transformResponse: (response) => response.data,
    }),
    updateProject: build.mutation({
      query: ({ data, id }) => ({
        url: `/report/edit/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    addTask: build.mutation({
      query: ({ data, report_id }) => ({
        url: `/task/new/${report_id}`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    updateTask: build.mutation({
      query: ({ data, report_id }) => ({
        url: `/task/update/${report_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    deleteTask: build.mutation({
      query: ({ data, report_id }) => ({
        url: `/task/delete/${report_id}`,
        method: "DELETE",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
    moveTask: build.mutation({
      query: ({ data, report_id }) => ({
        url: `/task/move/${report_id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Projects"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetProjectsQuery,
  useAddProjectsMutation,
  useUpdateProjectMutation,
  useAddTaskMutation,
  useGetProjectQuery,
  useDeleteTaskMutation,
  useMoveTaskMutation,
  useUpdateTaskMutation,
  useGetActiveTasksCountQuery,
  useGetSummaryQuery,
  useGetTasksQuery,
  useGetTasksHistoryQuery,
} = projectApi;
