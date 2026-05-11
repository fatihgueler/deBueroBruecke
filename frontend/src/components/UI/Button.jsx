import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
};

export default function Button({
  variant = 'primary',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) {
  return (
    <button
      type="button"
      className={`${variants[variant] || variants.primary} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
}
