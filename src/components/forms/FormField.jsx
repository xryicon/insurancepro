import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

const FormField = ({
  type = 'text',
  name,
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  error = '',
  disabled = false,
  options = [],
  hint = '',
  icon,
  className = '',
  inputClassName = '',
  labelClassName = '',
}) => {
  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          >
            <option value="">{placeholder || 'Select...'}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label || option}
              </option>
            ))}
          </select>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={4}
            className={`w-full p-3 border rounded-lg bg-white resize-none transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );

      case 'tel':
        return (
          <input
            type="tel"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );

      default:
        return (
          <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full p-3 border rounded-lg bg-white transition-all duration-200 ${
              error ? 'border-red-500' : 'border-gray-300'
            } ${inputClassName}`}
          />
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`mb-4 ${className}`}
    >
      <div className="flex items-start justify-between mb-2">
        <label
          htmlFor={name}
          className={`block text-sm font-medium transition-colors duration-200 ${
            error ? 'text-red-500' : 'text-gray-700'
          } ${labelClassName}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {hint && (
          <div
            className="flex items-center text-gray-400 text-xs cursor-help"
            title={hint}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
          </div>
        )}
      </div>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        {renderInput()}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-500 text-xs mt-1"
        >
          {error}
        </motion.p>
      )}
    </motion.div>
  );
};

export default FormField;
