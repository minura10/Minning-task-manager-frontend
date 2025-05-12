import { createApi } from "@reduxjs/toolkit/query/react";
import { publicBaseQuery } from "./baseQueries";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: publicBaseQuery,
  endpoints: (build) => ({
    signIn: build.mutation({
      query: (data) => ({
        url: "auth/login/",
        method: "POST",
        body: data,
      }),
    }),
    adminSignup: build.mutation({
      query: (data) => ({
        url: "auth/company/register",
        method: "POST",
        body: data,
      }),
    }),
    forgotPassword: build.mutation({
      query: (data) => ({
        url: "auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: build.mutation({
      query: (data, token) => ({
        url: `auth/reset-password/${token}`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useAdminSignupMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
