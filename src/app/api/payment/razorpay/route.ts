import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request: Request) {
  const body = await request.json();
  const { amount } = body;

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId === "rzp_test_placeholder") {
    return NextResponse.json({
      demo: true,
      orderId: `demo_order_${Date.now()}`,
      amount: amount * 100,
      currency: "INR",
      message: "Demo mode: Add real Razorpay keys to enable payments",
    });
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const order = await razorpay.orders.create({
    amount: amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
}
