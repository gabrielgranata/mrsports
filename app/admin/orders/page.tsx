import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return (
    <div>
      <h1 className="text-xl font-semibold mb-4">Orders</h1>
      <table className="w-full text-sm bg-white border">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-2 border-r">Public ID</th>
            <th className="text-left p-2 border-r">Customer</th>
            <th className="text-left p-2 border-r">Qty</th>
            <th className="text-left p-2 border-r">Status</th>
            <th className="text-left p-2">Created</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-2 text-blue-700 underline"><Link href={`/admin/orders/${o.id}`}>{o.publicId}</Link></td>
              <td className="p-2">{o.customerName}</td>
              <td className="p-2">{o.totalQuantity}</td>
              <td className="p-2">{o.status}</td>
              <td className="p-2">{o.createdAt.toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
