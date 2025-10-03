import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({ content: z.string().min(1) });

export async function POST(req: Request, { params }: { params: { publicId: string } }) {
  try {
    const json = await req.json();
    const { content } = schema.parse(json);

    const order = await prisma.order.findUnique({ where: { publicId: params.publicId } });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.message.create({ data: { orderId: order.id, sender: 'CUSTOMER', content } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
