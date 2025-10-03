import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

export const metadata = {
  title: 'T-Shirt Orders',
  description: 'Ordering portal for custom prints',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between">
            <Link href="/" className="font-semibold">T‑Shirt Orders</Link>
            <nav className="space-x-4">
              <Link href="/order/new" className="text-sm text-blue-600">New order</Link>
              <Link href="/admin/orders" className="text-sm text-gray-600">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-5xl p-4">{children}</main>
      </body>
    </html>
  );
}
