import { Link, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "@/app/api";
import DynamicForm from "@/components/forms/DynamicForm";
import type { FormFieldConfig } from "@/components/forms/DynamicForm";
import { registerSchema, type RegisterFormData } from "@/schemas/auth.schema";
import { ROUTES } from "@/utils/constants";
import { Mail, Lock, User } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const [register, { isLoading, error: apiError }] = useRegisterMutation();

  const fields: FormFieldConfig[] = [
    {
      name: "name",
      type: "text",
      placeholder: "Name",
      icon: <User className="w-5 h-5" />,
    },
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
    {
      name: "confirmPassword",
      type: "password",
      placeholder: "Confirm Password",
      icon: <Lock className="w-5 h-5" />,
      showPasswordToggle: true,
    },
  ];

  const handleSubmit = async (data: RegisterFormData) => {
    try {
      // Validate password match before sending
      if (data.password !== data.confirmPassword) {
        throw new Error("Passwords do not match");
      }
      
      // Send all fields including confirmPassword to backend
      const response = await register({
        name: data.name,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      }).unwrap();
      
      // Backend returns { message: "User registered successfully" }
      if (response.message) {
        navigate(ROUTES.LOGIN);
      }
    } catch (err: any) {
      throw err;
    }
  };

  const errorMessage = apiError
    ? ("data" in apiError && apiError.data
        ? (apiError.data as any)?.message
        : "Registration failed. Please try again.")
    : undefined;

  const footerContent = (
    <div className="text-center text-sm text-gray-600">
      Already have an account?{" "}
      <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
        Sign in
      </Link>
    </div>
  );

  return (
    <DynamicForm
      title="Create Account"
      fields={fields}
      schema={registerSchema}
      onSubmit={handleSubmit}
      submitLabel="Sign Up"
      isLoading={isLoading}
      footerContent={footerContent}
      error={errorMessage}
      rightPanel={{
        title: "Hello Friends!",
        description: "Enter your personal details and start your journey with us!",
        buttonLabel: "Sign In",
        buttonLink: ROUTES.LOGIN,
      }}
    />
  );
}
