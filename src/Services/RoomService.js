import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "./baseQueries";

export const roomApi = createApi({
  reducerPath: "roomApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Rooms"],
  endpoints: (build) => ({
    getRooms: build.query({
      query: () => ({
        url: "/rooms/",
        method: "GET",
      }),
      providesTags: ["Rooms"],
      transformResponse: (response) => response.data,
    }),
    getCategories: build.query({
      query: () => ({
        url: "/rooms/categories",
        method: "GET",
      }),
      providesTags: ["Rooms"],
      transformResponse: (response) => response.data,
    }),
  }),
});

export const { useGetRoomsQuery, useGetCategoriesQuery } = roomApi;
