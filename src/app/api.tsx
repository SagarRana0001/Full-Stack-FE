// import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
// import toast from "react-hot-toast";
// import { API_ENDPOINTS, API_TAGS, STORAGE_KEYS } from "@/utils/constants";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import toast from "react-hot-toast";
import { API_ENDPOINTS, API_TAGS, STORAGE_KEYS } from "../utils/constants";

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

const baseQueryWithToast: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  if (result.error) {
    const message = (result.error.data as any)?.message || "An error occurred";
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-red-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <span className="text-white font-bold">Error</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-red-400">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-red-200 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  } else if (result.meta?.request.method !== 'GET') {
    // For mutations (POST, PUT, DELETE), show success toast
    const message = (result.data as any)?.message || "Success";
    toast.custom((t) => (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-green-500 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
      >
        <div className="flex-1 w-0 p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5">
              <span className="text-white font-bold">Success</span>
            </div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-white">
                {message}
              </p>
            </div>
          </div>
        </div>
        <div className="flex border-l border-green-400">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-white hover:text-green-200 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Close
          </button>
        </div>
      </div>
    ), { duration: 4000 });
  }

  return result;
};

export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithToast,
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
