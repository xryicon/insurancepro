import { forwardRef } from 'react';
import { clsx } from 'clsx';

const FormField = forwardRef(
  (
    {
      label,
      type = 'text',
      error = '',
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={clsx(
            'w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-300',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${props.id}-error` : undefined}
          {...props}
        />
        {error && (
          <p
            id={`${props.id}-error`}
            className="text-sm text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';

export default FormField;
