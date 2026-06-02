import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      disabled = false,
      loading = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const base =
      'relative inline-flex items-center justify-center font-semibold rounded-2xl transition-all duration-300 focus:outline-none active:scale-[0.97] overflow-hidden';

    const variants = {
      primary:
        // 🔥 VERY OBVIOUS GLOW
        `
        text-white
        bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600
        shadow-[0_0_30px_rgba(59,130,246,0.45)]
        hover:shadow-[0_0_60px_rgba(99,102,241,0.7)]
        hover:brightness-110
        border border-white/10
        `,

      secondary:
        `
        bg-white/5 text-white
        border border-white/20
        hover:bg-white/10
        backdrop-blur
        `,

      outline:
        `
        border border-blue-400 text-blue-300
        hover:bg-blue-500/10
        `,

      ghost:
        `
        text-gray-300
        hover:text-white hover:bg-white/5
        `,
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-sm',
      lg: 'px-9 py-4 text-base',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {/* 🔥 BIG GLOW AURA (always visible, not just hover) */}
        {variant === 'primary' && (
          <>
            <span className="absolute -inset-1 bg-blue-500/30 blur-2xl opacity-70 animate-pulse rounded-2xl" />

            {/* moving shine */}
            <span className="absolute inset-0 overflow-hidden rounded-2xl">
              <span className="absolute top-0 left-[-120%] w-[60%] h-full bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shine_1.8s_infinite]" />
            </span>
          </>
        )}

        {/* CONTENT */}
        {loading ? (
          <span className="flex items-center gap-2 relative z-10">
            <Loader2 className="w-4 h-4 animate-spin" />
            Processing...
          </span>
        ) : (
          <span className="relative z-10">{children}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;