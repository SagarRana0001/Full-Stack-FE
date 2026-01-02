import { useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "@/app/api";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormFieldConfig } from "@/components/forms/DynamicForm";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/schemas/auth.schema";
import { ROUTES } from "@/utils/constants";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const token = searchParams.get("token") || "";
  const [resetPassword, { isLoading, error: apiError }] = useResetPasswordMutation();
  const [message, setMessage] = useState("");

  const fields: FormFieldConfig[] = [
    {
      name: "newPassword",
      label: "New Password",
      type: "password",
      placeholder: "••••••••",
      showPasswordToggle: true,
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      placeholder: "••••••••",
      showPasswordToggle: true,
    },
  ];

  const handleSubmit = async (data: ResetPasswordFormData) => {
    if (!email || !token) {
      throw new Error("Invalid reset link. Please request a new reset link.");
    }

    try {
      const response = await resetPassword({
        email,
        token,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword,
      }).unwrap();

      if (response.message) {
        setMessage("Password reset successful! Redirecting to login...");
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 2000);
      }
    } catch (err: any) {
      console.error(err);
    }
  };

  const errorMessage = apiError
    ? ("data" in apiError && apiError.data
        ? (apiError.data as any)?.message
        : "Failed to reset password")
    : undefined;

  const footerContent = (
    <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
      Back to login
    </Link>
  );

  if (!email || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="text-center">
          <p className="text-lg mb-4">Invalid reset link. Please request a new reset link.</p>
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary hover:underline">
            Go to Forgot Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <DynamicForm
        title="Reset Password"
        description="Enter your new password below"
        fields={fields}
        schema={resetPasswordSchema}
        onSubmit={handleSubmit}
        submitLabel="Reset Password"
        isLoading={isLoading}
        footerContent={footerContent}
        error={errorMessage}
      />
      {message && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 p-4 text-sm text-green-600 bg-green-50 rounded-md border border-green-200 max-w-md">
          {message}
        </div>
      )}
    </>
  );
}
