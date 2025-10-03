import { prisma } from '@/lib/prisma';

export default async function AdminOrderDetail({ params }: { params: { id: string } }) {
  const orderId = Number(params.id);
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { messages: { orderBy: { createdAt: 'asc' } } },
  });
  if (!order) return <div>Not found</div>;

  const statuses = [
    'NEW',
    'REVIEWING',
    'QUOTED',
    'APPROVED',
    'IN_PRODUCTION',
    'COMPLETED',
    'CANCELLED',
  ] as const;

  async function updateStatus(formData: FormData) {
    'use server';
    const status = String(formData.get('status')) as (typeof statuses)[number];
    await prisma.order.update({ where: { id: order.id }, data: { status } });
  }

  async function addAdminMessage(formData: FormData) {
    'use server';
    const content = String(formData.get('content') || '').trim();
    if (!content) return;
    await prisma.message.create({ data: { content, sender: 'ADMIN', orderId: order.id } });
  }

  async function setQuote(formData: FormData) {
    'use server';
    const cents = Math.round(Number(formData.get('quote') || '0') * 100);
    await prisma.order.update({ where: { id: order.id }, data: { priceQuoteCents: cents } });
  }

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Order {order.publicId}</h1>
        <p className="text-sm text-gray-600">{order.customerName} • {order.customerEmail}</p>
      </div>

      <form action={updateStatus} className="flex items-center gap-2">
        <label className="text-sm">Status</label>
        <select name="status" defaultValue={order.status} className="border rounded px-2 py-1">
          {statuses.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
        </select>
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded">Update</button>
      </form>

      <form action={setQuote} className="flex items-center gap-2">
        <label className="text-sm">Quote ($)</label>
        <input name="quote" type="number" step="0.01" defaultValue={order.priceQuoteCents ? (order.priceQuoteCents/100).toFixed(2) : ''} className="border rounded px-2 py-1" />
        <button className="px-3 py-1.5 bg-blue-600 text-white rounded">Save</button>
      </form>

      <div>
        <h2 className="font-semibold mb-2">Messages</h2>
        <div className="space-y-3 mb-3">
          {order.messages.map((m) => (
            <div key={m.id} className="rounded border p-3 bg-white">
              <div className="text-xs text-gray-500 mb-1">{m.createdAt.toLocaleString()} – {m.sender}</div>
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
            </div>
          ))}
        </div>
        <form action={addAdminMessage} className="max-w-xl">
          <textarea name="content" className="w-full border rounded px-3 py-2" rows={3} placeholder="Write a message to the customer" />
          <button className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded">Send</button>
        </form>
      </div>
    </div>
  );
}
