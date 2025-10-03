import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="py-12">
      <h1 className="text-2xl font-semibold mb-4">Welcome</h1>
      <p className="mb-6">Place a new T‑Shirt order or check an existing one.</p>
      <div className="space-x-4">
        <Link href="/order/new" className="px-4 py-2 bg-blue-600 text-white rounded">Start an order</Link>
      </div>
    </div>
  );
}
