import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import FormField from "./FormField";
import { Link } from "react-router-dom";
import type { ReactNode } from "react";

export interface FormFieldConfig {
  name: string;
  label?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  icon?: ReactNode;
  showPasswordToggle?: boolean;
}

interface DynamicFormProps {
  title: string;
  description?: string;
  fields: FormFieldConfig[];
  schema: z.ZodSchema<any>;
  onSubmit: (data: any) => Promise<void> | void;
  submitLabel?: string;
  isLoading?: boolean;
  footerContent?: React.ReactNode;
  error?: string;
  defaultValues?: Record<string, any>;
  rightPanel?: {
    title: string;
    description: string;
    buttonLabel: string;
    buttonLink: string;
  };
  extraContent?: ReactNode;
}

export default function DynamicForm({
  title,
  description,
  fields,
  schema,
  onSubmit,
  submitLabel = "Submit",
  isLoading = false,
  footerContent,
  error,
  defaultValues,
  rightPanel,
  extraContent,
}: DynamicFormProps) {
  const form = useForm({
    // @ts-expect-error - zod v4 type compatibility issue with zodResolver
    resolver: zodResolver(schema),
    defaultValues: defaultValues || {},
  });

  const handleSubmit = async (data: any) => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error("Form submission error:", err);
    }
  };

  const content = (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-2 sm:space-y-2.5 w-full">
        {error && (
          <div className="p-2 text-xs sm:text-sm text-red-600 bg-red-50 rounded-md border border-red-200 mb-1.5">
            {error}
          </div>
        )}
        <div className="space-y-2 sm:space-y-2.5">
          {fields.map((field) => (
            <FormField
              key={field.name}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              disabled={field.disabled}
              icon={field.icon}
              showPasswordToggle={field.showPasswordToggle}
            />
          ))}
        </div>
        {extraContent}
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium py-2 rounded-md transition-all mt-2 sm:mt-3 text-sm sm:text-base"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : submitLabel}
        </Button>
        {footerContent && (
          <div className="text-center text-xs sm:text-sm mt-2 sm:mt-3">{footerContent}</div>
        )}
      </form>
    </FormProvider>
  );

  if (rightPanel) {
    return (
      <div className="h-screen flex items-center justify-center bg-teal-500 p-3 sm:p-4 overflow-hidden">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95vh] max-h-[550px]">
          {/* Left Panel - Form */}
          <div className="w-full md:w-1/2 p-4 sm:p-5 md:p-6 flex flex-col h-full overflow-y-auto">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-blue-600 mb-2 md:mb-3 flex-shrink-0">
              {title}
            </h2>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 mb-2 md:mb-3 flex-shrink-0">{description}</p>
            )}
            <div className="flex-1 flex flex-col justify-center min-h-0">
              {content}
            </div>
          </div>

          {/* Right Panel - Welcome */}
          <div className="hidden md:flex md:w-1/2 bg-gradient-to-r from-orange-400 to-red-500 p-6 md:p-8 justify-center items-center text-white flex-col h-full">
            <h1 className="text-2xl md:text-3xl font-bold mb-3">
              {rightPanel.title}
            </h1>
            <p className="text-base md:text-lg mb-6 text-center">
              {rightPanel.description}
            </p>
            <Button
              asChild
              variant="outline"
              className="border-2 border-white text-white hover:bg-white/10 px-6 py-2 rounded-md font-medium text-sm"
            >
              <Link to={rightPanel.buttonLink}>{rightPanel.buttonLabel}</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-2">{title}</h2>
        {description && (
          <p className="text-gray-600 text-center mb-6">{description}</p>
        )}
        {content}
      </div>
    </div>
  );
}

