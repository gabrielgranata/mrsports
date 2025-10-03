import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function OrderDetail({ params }: { params: { publicId: string } }) {
  const order = await prisma.order.findUnique({
    where: { publicId: params.publicId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!order) {
    return <div>Order not found</div>;
  }
  return (
    <div className="max-w-2xl">
      <h1 className="text-xl font-semibold mb-2">Order #{order.publicId}</h1>
      <p className="text-sm text-gray-600 mb-4">Status: {order.status.replace('_', ' ')}</p>

      <div className="mb-6 space-y-1">
        <p><strong>Name:</strong> {order.customerName}</p>
        <p><strong>Email:</strong> {order.customerEmail}</p>
        {order.organization && <p><strong>Org:</strong> {order.organization}</p>}
        {order.color && <p><strong>Color:</strong> {order.color}</p>}
        <p><strong>Total qty:</strong> {order.totalQuantity}</p>
        {order.priceQuoteCents != null && (
          <p><strong>Quote:</strong> ${(order.priceQuoteCents / 100).toFixed(2)}</p>
        )}
      </div>

      <h2 className="font-semibold mb-2">Messages</h2>
      <div className="space-y-3 mb-4">
        {order.messages.length === 0 && <p className="text-sm text-gray-600">No messages yet.</p>}
        {order.messages.map((m) => (
          <div key={m.id} className="rounded border p-3 bg-white">
            <div className="text-xs text-gray-500 mb-1">
              {m.createdAt.toLocaleString()} – {m.sender}
            </div>
            <div className="whitespace-pre-wrap text-sm">{m.content}</div>
          </div>
        ))}
      </div>

      <form action={async (fd) => {
        'use server';
        const content = String(fd.get('content') || '').trim();
        if (!content) return;
        await prisma.message.create({
          data: {
            content,
            sender: 'CUSTOMER',
            order: { connect: { id: order.id } },
          },
        });
      }} className="max-w-xl">
        <textarea name="content" className="w-full border rounded px-3 py-2" rows={3} placeholder="Write a message to the shop" />
        <button className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded">Send</button>
      </form>

      <div className="mt-6">
        <Link href="/" className="text-blue-600">Back home</Link>
      </div>
    </div>
  );
}
