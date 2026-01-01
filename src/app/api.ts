import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_ENDPOINTS, API_TAGS, STORAGE_KEYS } from "@/utils/constants";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  prepareHeaders: (headers) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: Object.values(API_TAGS),
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.REGISTER,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    login: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.LOGIN,
        method: "POST",
        body: data,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    verifyOTP: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.VERIFY_OTP,
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.RESET_PASSWORD,
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => API_ENDPOINTS.AUTH.PROFILE,
      providesTags: [API_TAGS.AUTH],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: API_ENDPOINTS.AUTH.PROFILE,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: [API_TAGS.AUTH],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useVerifyOTPMutation,
  useResetPasswordMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
} = api;
