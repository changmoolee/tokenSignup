import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8000/user",
    credentials: "include",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getUserlist: builder.query({
      query: () => `/user`,
      transformResponse: (response) => response.data,
    }),
    getUserInfo: builder.mutation({
      query: () => ({
        url: "/userInfo",
        method: "POST",
      }),
      transformResponse: (response) => response.data,
    }),
    tokenLoginUser: builder.mutation({
      query: ({ userId, password }) => ({
        url: "/userTokenLogIn",
        method: "POST",
        body: {
          id: userId,
          password: password,
        },
      }),
    }),
    tokenLogoutUser: builder.mutation({
      query: () => ({
        url: "/userTokenLogOut",
        method: "POST",
        body: {},
      }),
    }),
    registerUser: builder.mutation({
      query: ({ userId, password }) => ({
        url: `/userRegister`,
        method: "POST",
        body: {
          id: userId,
          password: password,
        },
      }),
    }),
    editUser: builder.mutation({
      query: ({ userId, prevPassword, newPassword }) => ({
        url: `/userEdit`,
        method: "PATCH",
        body: {
          id: userId,
          prevPassword: prevPassword,
          newPassword: newPassword,
        },
      }),
    }),
    withdrawUser: builder.mutation({
      query: (userId) => ({
        url: `/userDelete`,
        method: "DELETE",
        body: {
          id: userId,
        },
      }),
    }),
  }),
});

export const {
  useGetUserlistQuery,
  useRegisterUserMutation,
  useWithdrawUserMutation,
  useGetUserInfoMutation,
  useEditUserMutation,
  useTokenLoginUserMutation,
  useTokenLogoutUserMutation,
} = userApi;
