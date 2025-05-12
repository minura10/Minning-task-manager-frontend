import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import constant from "../constant";

export const publicBaseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
});

const baseQueryWithAuthHeaders = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_URL,
  prepareHeaders: async (headers) => {
    const token = await localStorage.getItem(constant.Token);

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const mutex = new Mutex();

export const baseQueryWithReAuth = async (args, api, extraOptions) => {
  await mutex.waitForUnlock();
  let result = await baseQueryWithAuthHeaders(args, api, extraOptions);

  if (result.error && result.error.status === 406) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshResult = await baseQueryWithAuthHeaders(
          {
            url: "/auth/refresh-token/",
            method: "GET",
          },
          api,
          extraOptions
        );

        if (refreshResult.data) {
          localStorage.setItem(constant.Token, refreshResult.data.data.token);
        } else {
          window.location = "/auth-login";
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await baseQueryWithAuthHeaders(args, api, extraOptions);
    }
  }
  return result;
};
