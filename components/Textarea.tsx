import { ComponentProps } from 'react';

type TextareaProps = ComponentProps<'textarea'> & { label: string };

export function Textarea({ label, id, className = '', ...props }: TextareaProps) {
  const inputId = id ?? `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;
  return (
    <label className="block text-sm mb-3" htmlFor={inputId}>
      <span className="block text-gray-700 mb-1">{label}</span>
      <textarea
        id={inputId}
        className={`w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    </label>
  );
}
