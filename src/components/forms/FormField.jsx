import React, { forwardRef, useId } from "react";
import { motion } from "framer-motion";

const FormField = forwardRef(
  (
    {
      label,
      error,
      className = "",
      type = "text",
      id,
      register,
      placeholder,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id || generatedId;

    const baseInput =
      "w-full px-4 pt-6 pb-3 rounded-xl border transition-all duration-200 " +
      "bg-slate-900 text-white placeholder-transparent " +
      "border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 outline-none";

    const labelBase =
      "absolute left-4 top-3 text-slate-400 text-sm transition-all duration-200 pointer-events-none";

    return (
      <div className={`relative w-full ${className}`}>
        {/* INPUT */}
        <input
          id={inputId}
          ref={ref}
          type={type}
          placeholder={placeholder || label}
          className={baseInput}
          {...(register ? register : {})}
          {...props}
        />

        {/* FLOATING LABEL */}
        {label && (
          <label
            htmlFor={inputId}
            className={labelBase}
          >
            {label}
          </label>
        )}

        {/* ERROR */}
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-400 mt-2"
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FormField.displayName = "FormField";

export default FormField;