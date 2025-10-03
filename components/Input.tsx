import { ComponentProps } from 'react';

type InputProps = ComponentProps<'input'> & { label: string };

export function Input({ label, id, className = '', ...props }: InputProps) {
  const inputId = id ?? `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="block text-sm mb-3" htmlFor={inputId}>
      <span className="block text-gray-700 mb-1">{label}</span>
      <input
        id={inputId}
        className={`w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </label>
  );
}
