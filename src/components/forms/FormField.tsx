import { useFormContext, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";
import { useState, type ReactNode } from "react";

interface FormFieldProps {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
}

export default function FormField({
  name,
  label,
  type = "text",
  placeholder,
  className,
  disabled,
  icon,
  showPasswordToggle = false,
}: FormFieldProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPasswordToggle && showPassword ? "text" : type;

  return (
    <div className={cn("space-y-1", className)}>
      {label && <Label htmlFor={name} className="text-xs sm:text-sm">{label}</Label>}
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <>
            <div className="relative">
              {icon && (
                <div className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 z-10">
                  <div className="w-4 h-4 sm:w-5 sm:h-5">{icon}</div>
                </div>
              )}
              <Input
                id={name}
                type={inputType}
                placeholder={placeholder}
                disabled={disabled}
                {...field}
                className={cn(
                  errors[name] && "border-red-500",
                  icon && "pl-9 sm:pl-10",
                  showPasswordToggle && isPasswordType && "pr-9 sm:pr-10",
                  "h-9 sm:h-10 text-sm",
                  className
                )}
              />
              {showPasswordToggle && isPasswordType && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors z-10"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              )}
            </div>
            {errors[name] && (
              <p className="text-xs text-red-600 mt-0.5">
                {errors[name]?.message as string}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}

