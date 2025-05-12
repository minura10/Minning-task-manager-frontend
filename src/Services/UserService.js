import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQueries";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Users"],
  endpoints: (build) => ({
    getUserInfo: build.query({
      query: () => ({
        url: "/user/info",
        method: "GET",
      }),
      providesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
    getStaff: build.query({
      query: () => ({
        url: "/user",
        method: "GET",
      }),
      providesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
    getNames: build.query({
      query: () => ({
        url: "/user/names",
        method: "GET",
      }),
      providesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),

    addStaff: build.mutation({
      query: (data) => ({
        url: "/auth/staff/invite",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
    updateStuff: build.mutation({
      query: ({ data, id }) => ({
        url: `/user/edit/stuff/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
    updateUser: build.mutation({
      query: (data) => ({
        url: `/user/edit`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetUserInfoQuery,
  useGetStaffQuery,
  useAddStaffMutation,
  useUpdateStuffMutation,
  useGetNamesQuery,
  useUpdateUserMutation,
} = userApi;
