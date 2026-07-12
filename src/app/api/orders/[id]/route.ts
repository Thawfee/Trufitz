import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  const order = await prisma.order.findFirst({
    where: { OR: [{ id }, { orderNumber: id }] },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  if (session?.user) {
    const userId = (session.user as { id: string }).id;
    const role = (session.user as { role: string }).role;
    if (role !== "admin" && order.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.json(order);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role;

  if (role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const order = await prisma.order.update({
    where: { id },
    data: {
      status: body.status,
      paymentStatus: body.paymentStatus,
      trackingNumber: body.trackingNumber,
    },
    include: { items: { include: { product: true } } },
  });

  return NextResponse.json(order);
}
