import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [totalProducts, totalOrders, orders, lowStock, categories, customers, coupons] =
    await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.order.findMany({
        include: { items: true, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { stock: { lte: 10 } },
        orderBy: { stock: "asc" },
        take: 10,
      }),
      prisma.category.findMany({
        include: { _count: { select: { products: true } } },
      }),
      prisma.user.count({ where: { role: "customer" } }),
      prisma.coupon.findMany({ where: { active: true } }),
    ]);

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "paid" || o.paymentMethod === "cod")
    .reduce((sum, o) => sum + o.total, 0);

  const salesByMonth: Record<string, number> = {};
  orders.forEach((order) => {
    const month = order.createdAt.toISOString().slice(0, 7);
    salesByMonth[month] = (salesByMonth[month] || 0) + order.total;
  });

  return NextResponse.json({
    totalProducts,
    totalOrders,
    totalRevenue,
    totalCustomers: customers,
    recentOrders: orders.slice(0, 10),
    lowStock,
    categories,
    coupons,
    salesByMonth,
  });
}
