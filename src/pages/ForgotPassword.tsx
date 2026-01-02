import { useState } from "react";
import { Link } from "react-router-dom";
import { useForgotPasswordMutation } from "@/app/api";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormFieldConfig } from "@/components/forms/DynamicForm";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/schemas/auth.schema";
import { ROUTES } from "@/utils/constants";

export default function ForgotPassword() {
  const [forgotPassword, { isLoading, error: apiError }] = useForgotPasswordMutation();
  const [message, setMessage] = useState("");

  const fields: FormFieldConfig[] = [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "your@example.com",
    },
  ];

  const handleEmailSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword(data).unwrap();
      setMessage(response.message || "Reset link has been sent to your email.");
    } catch (err: any) {
      console.error(err);
    }
  };

  const errorMessage = apiError
    ? ("data" in apiError && apiError.data
        ? (apiError.data as any)?.message
        : "Failed to send reset link")
    : undefined;

  const footerContent = (
    <Link to={ROUTES.LOGIN} className="text-primary hover:underline">
      Back to login
    </Link>
  );

  return (
    <>
      <DynamicForm
        title="Forgot Password"
        description="Enter your email address and we'll send you a reset link"
        fields={fields}
        schema={forgotPasswordSchema}
        onSubmit={handleEmailSubmit}
        submitLabel="Send Reset Link"
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
