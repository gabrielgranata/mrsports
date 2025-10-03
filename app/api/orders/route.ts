import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const schema = z.object({
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  organization: z.string().optional(),
  color: z.string().optional(),
  totalQuantity: z.number().int().positive(),
  details: z.string().optional(),
});

function generatePublicId() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let id = '';
  for (let i = 0; i < 8; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return id;
}

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.parse(json);

    const publicId = generatePublicId();

    const order = await prisma.order.create({
      data: {
        publicId,
        customerName: parsed.customerName,
        customerEmail: parsed.customerEmail,
        organization: parsed.organization || null,
        color: parsed.color || null,
        totalQuantity: parsed.totalQuantity,
        details: parsed.details || null,
      },
    });

    return NextResponse.json({ id: order.id, publicId: order.publicId }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}
