import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const order = await prisma.order.findUnique({ where: { id }, include: { messages: true } });
  if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(order);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const id = Number(params.id);
  const body = await req.json();

  const schema = z.object({
    status: z.enum(['NEW','REVIEWING','QUOTED','APPROVED','IN_PRODUCTION','COMPLETED','CANCELLED']).optional(),
    priceQuoteCents: z.number().int().nonnegative().optional(),
    message: z.string().optional(),
  });
  const parsed = schema.parse(body);

  const updates: any = {};
  if (parsed.status) updates.status = parsed.status;
  if (parsed.priceQuoteCents != null) updates.priceQuoteCents = parsed.priceQuoteCents;

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({ where: { id }, data: updates });
    if (parsed.message) {
      await tx.message.create({ data: { orderId: id, sender: 'ADMIN', content: parsed.message } });
    }
    return updated;
  });

  return NextResponse.json(result);
}
