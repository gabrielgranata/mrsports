"use client";

import { useState } from 'react';
import { Input } from '@/components/Input';
import { Textarea } from '@/components/Textarea';
import { z } from 'zod';

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  organization: z.string().optional(),
  color: z.string().optional(),
  totalQuantity: z.coerce.number().int().positive(),
  details: z.string().optional(),
});

export default function NewOrderPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ publicId: string } | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);

    const raw = Object.fromEntries(formData.entries());
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      setSubmitting(false);
      setError('Please fill the form correctly.');
      return;
    }

    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });

    if (!res.ok) {
      setSubmitting(false);
      setError('Failed to submit. Try again.');
      return;
    }

    const data = await res.json();
    setSuccess({ publicId: data.publicId });
    setSubmitting(false);
  }

  if (success) {
    return (
      <div className="max-w-xl">
        <h1 className="text-xl font-semibold mb-2">Thanks!</h1>
        <p className="mb-4">Your order has been created.</p>
        <a className="text-blue-600 underline" href={`/order/${success.publicId}`}>Go to your order</a>
      </div>
    );
  }

  return (
    <form className="max-w-xl" action={onSubmit}>
      <h1 className="text-xl font-semibold mb-4">New Order</h1>
      <Input name="customerName" label="Your name" required />
      <Input name="customerEmail" label="Email" type="email" required />
      <Input name="organization" label="Organization (optional)" />
      <Input name="color" label="Shirt color (optional)" />
      <Input name="totalQuantity" label="Total quantity" type="number" min={1} required />
      <Textarea name="details" label="Details (sizes, notes)" rows={4} />
      <button disabled={submitting} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">
        {submitting ? 'Submitting…' : 'Submit order'}
      </button>
      {error && <p className="text-red-600 mt-2">{error}</p>}
    </form>
  );
}
