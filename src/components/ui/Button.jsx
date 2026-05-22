import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  onClick,
  disabled = false,
  loading = false,
  type = 'button',
  className = '',
  leftIcon,
  rightIcon,
  fullWidth = false,
}) => {
  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-green-600 hover:bg-green-700 text-white',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
    ghost: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50',
    dark: 'bg-gray-900 hover:bg-gray-800 text-white',
    light: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white',
  };

  // Size styles
  const sizeStyles = {
    small: 'px-3 py-1.5 text-sm',
    medium: 'px-5 py-2.5 text-sm font-medium',
    large: 'px-6 py-3 text-base font-medium',
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
        fullWidth ? 'w-full' : ''
      } ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading...
        </>
      ) : (
        <>
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;
