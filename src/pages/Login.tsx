import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "@/app/api";
import { useDispatch } from "react-redux";
import { setAuth } from "@/redux/authSlice";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormFieldConfig } from "@/components/forms/DynamicForm";
import { loginSchema, type LoginFormData } from "@/schemas/auth.schema";
import { ROUTES } from "@/utils/constants";
import { Mail, Lock } from "lucide-react";
import { useFormContext, Controller } from "react-hook-form";

function RememberMeCheckbox() {
  const { control } = useFormContext();

  return (
    <div className="flex items-center justify-between mt-1.5">
      <Controller
        name="rememberMe"
        control={control}
        render={({ field }) => (
          <label className="flex items-center space-x-1.5 cursor-pointer">
            <input
              type="checkbox"
              checked={field.value || false}
              onChange={field.onChange}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-xs sm:text-sm text-gray-600">Remember me</span>
          </label>
        )}
      />
      <Link
        to={ROUTES.FORGOT_PASSWORD}
        className="text-xs sm:text-sm text-blue-600 hover:underline"
      >
        Forgot Password?
      </Link>
    </div>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoading, error: apiError }] = useLoginMutation();

  const fields: FormFieldConfig[] = [
    {
      name: "email",
      type: "email",
      placeholder: "E-Mail",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      name: "password",
      type: "password",
      placeholder: "Password",
      icon: <Lock className="w-5 h-5" />,
      showPasswordToggle: true,
    },
  ];
 
  const handleSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data).unwrap();
      // Backend returns { token: "...", user: {...} } on success
      // Backend returns { message: "..." } on error (via RTK Query error)
      if (response.token && response.user) {
        dispatch(setAuth({ user: response.user, token: response.token }));
        navigate(ROUTES.DASHBOARD);
      }
    } catch (err: any) {
      // RTK Query puts backend error message in err.data.message
      throw err;
    }
  };

  const errorMessage = apiError
    ? ("data" in apiError && apiError.data
        ? (apiError.data as any)?.message
        : "Invalid email or password")
    : undefined;

  const footerContent = (
    <div className="text-center text-sm text-gray-600">
      Don't have an account?{" "}
      <Link to={ROUTES.REGISTER} className="text-blue-600 hover:underline font-medium">
        Sign up
      </Link>
    </div>
  );

  return (
    <DynamicForm
      title="Sign in to Account"
      fields={fields}
      schema={loginSchema}
      onSubmit={handleSubmit}
      submitLabel="Sign In"
      isLoading={isLoading}
      footerContent={footerContent}
      error={errorMessage}
      rightPanel={{
        title: "Hello Friends!",
        description: "Enter your personal details and start your journey with us!",
        buttonLabel: "Sign Up",
        buttonLink: ROUTES.REGISTER,
      }}
      extraContent={<RememberMeCheckbox />}
    />
  );
}
