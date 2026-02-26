"use client";

import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

type FieldType =
  | "text"
  | "email"
  | "tel"
  | "date"
  | "number"
  | "select"
  | "textarea"
  | "checkbox";

interface FormFieldProps extends Omit<
  InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >,
  "type"
> {
  label: string;
  name: string;
  type?: FieldType;
  error?: string;
  hint?: string;
  children?: ReactNode; // for select options
  maxLength?: number;
  currentLength?: number;
  register?: Record<string, unknown>;
}

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(function FormField(
  {
    label,
    name,
    type = "text",
    error,
    hint,
    children,
    maxLength,
    currentLength,
    register,
    required,
    className,
    ...rest
  },
  ref,
) {
  const id = `field-${name}`;
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  const baseClasses =
    "w-full px-4 py-3 rounded-xl border bg-white font-body text-sm text-dolce-marrom placeholder:text-dolce-marrom/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-dolce-rosa/40 focus:border-dolce-rosa";
  const errorClasses = error ? "border-red-400" : "border-dolce-marrom/20";

  if (type === "checkbox") {
    return (
      <div className={`flex items-start gap-3 ${className || ""}`}>
        <input
          id={id}
          type="checkbox"
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className="mt-1 w-4 h-4 rounded border-dolce-marrom/30 text-dolce-rosa focus:ring-dolce-rosa/40 cursor-pointer"
          ref={ref as React.Ref<HTMLInputElement>}
          {...register}
          {...rest}
        />
        <div className="flex-1">
          <label
            htmlFor={id}
            className="text-xs font-body text-dolce-marrom/70 cursor-pointer leading-relaxed"
          >
            {label}
            {required && <span className="text-red-400 ml-0.5">*</span>}
          </label>
          {error && (
            <p id={errorId} role="alert" className="text-xs text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <label
        htmlFor={id}
        className="block text-sm font-body font-medium text-dolce-marrom mb-1.5"
      >
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={id}
          rows={4}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : "", hint ? hintId : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`${baseClasses} ${errorClasses} resize-none`}
          maxLength={maxLength}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          {...register}
          {...(rest as InputHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : type === "select" ? (
        <select
          id={id}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={`${baseClasses} ${errorClasses} appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%233D2314%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[center_right_1rem]`}
          ref={ref as React.Ref<HTMLSelectElement>}
          {...register}
          {...(rest as InputHTMLAttributes<HTMLSelectElement>)}
        >
          {children}
        </select>
      ) : (
        <input
          id={id}
          type={type}
          aria-invalid={!!error}
          aria-describedby={
            [error ? errorId : "", hint ? hintId : ""]
              .filter(Boolean)
              .join(" ") || undefined
          }
          className={`${baseClasses} ${errorClasses}`}
          ref={ref as React.Ref<HTMLInputElement>}
          {...register}
          {...rest}
        />
      )}

      {/* Counter for textarea */}
      {type === "textarea" && maxLength && currentLength !== undefined && (
        <p className="text-[10px] text-dolce-marrom/40 text-right mt-1">
          {currentLength}/{maxLength}
        </p>
      )}

      {hint && !error && (
        <p id={hintId} className="text-xs text-dolce-marrom/50 mt-1">
          {hint}
        </p>
      )}

      {error && (
        <p id={errorId} role="alert" className="text-xs text-red-500 mt-1">
          {error}
        </p>
      )}
    </div>
  );
});
