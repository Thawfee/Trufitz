import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/utils";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as { id: string }).id;
  const role = (session.user as { role: string }).role;

  const orders = await prisma.order.findMany({
    where: role === "admin" ? {} : { userId },
    include: {
      items: { include: { product: true } },
      user: { select: { name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(orders);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const userId = (session.user as { id: string }).id;

  const order = await prisma.order.create({
    data: {
      orderNumber: generateOrderNumber(),
      userId,
      paymentMethod: body.paymentMethod,
      paymentStatus: body.paymentMethod === "cod" ? "pending" : "pending",
      subtotal: body.subtotal,
      discount: body.discount || 0,
      shipping: body.shipping || 0,
      total: body.total,
      shippingName: body.shippingName,
      shippingPhone: body.shippingPhone,
      shippingAddress: body.shippingAddress,
      shippingCity: body.shippingCity,
      shippingState: body.shippingState,
      shippingPincode: body.shippingPincode,
      razorpayOrderId: body.razorpayOrderId,
      status: body.paymentMethod === "cod" ? "confirmed" : "pending",
      items: {
        create: body.items.map(
          (item: {
            productId: string;
            quantity: number;
            size: string;
            price: number;
          }) => ({
            productId: item.productId,
            quantity: item.quantity,
            size: item.size,
            price: item.price,
          })
        ),
      },
    },
    include: { items: { include: { product: true } } },
  });

  for (const item of body.items) {
    await prisma.product.update({
      where: { id: item.productId },
      data: { stock: { decrement: item.quantity } },
    });
  }

  return NextResponse.json(order);
}
