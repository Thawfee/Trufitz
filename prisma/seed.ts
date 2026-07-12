import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Oversized T-Shirts",
    slug: "oversized-t-shirts",
    image: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "T-Shirts",
    slug: "t-shirts",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Shirts",
    slug: "shirts",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Pants",
    slug: "pants",
    image: "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  },
];

const colors = [
  { name: "Black", hex: "#0a0a0a" },
  { name: "White", hex: "#f5f5f5" },
  { name: "Grey", hex: "#6b7280" },
  { name: "Navy", hex: "#1e3a5f" },
];

const fabrics = [
  "100% Premium Cotton, 220 GSM",
  "Cotton-Poly Blend, Breathable Knit",
  "Heavyweight French Terry, 280 GSM",
  "Stretch Cotton Twill, Slim Fit",
  "Organic Cotton, Pre-shrunk",
];

const imageSets = [
  [
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1495020689067-958852a7765e?auto=format&fit=crop&w=1200&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1598033129183-a5123f29157b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520975912210-595f7d2327fd?auto=format&fit=crop&w=1200&q=80",
  ],
  [
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=80",
  ],
];

const productNames: Record<string, string[]> = {
  "oversized-t-shirts": [
    "Oversized Essential Tee",
    "Drop Shoulder Box Fit",
    "Heavyweight Oversized Crew",
    "Relaxed Fit Statement Tee",
    "Premium Oversized Cotton",
    "Urban Oversized Graphic",
  ],
  "t-shirts": [
    "Classic Crew Neck Tee",
    "Minimal Logo Tee",
    "Premium Cotton Basic",
    "Slim Fit Essential Tee",
    "Vintage Wash Tee",
    "Signature Fit Tee",
  ],
  shirts: [
    "Oxford Button-Down",
    "Linen Blend Casual Shirt",
    "Slim Fit Formal Shirt",
    "Relaxed Camp Collar",
    "Premium Cotton Shirt",
    "Textured Weave Shirt",
  ],
  pants: [
    "Slim Fit Chinos",
    "Relaxed Cargo Pants",
    "Tailored Dress Pants",
    "Comfort Stretch Joggers",
    "Classic Straight Fit",
    "Premium Tapered Pants",
  ],
};

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

async function main() {
  console.log("Seeding TRUFITZ premium clothing store...");

  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.wishlistItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.address.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const userPassword = await bcrypt.hash("user123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@trufitz.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@trufitz.com",
      password: adminPassword,
      role: "admin",
      phone: "9876543210",
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@trufitz.com" },
    update: {},
    create: {
      name: "Demo User",
      email: "user@trufitz.com",
      password: userPassword,
      role: "customer",
      phone: "9876543211",
    },
  });

  await prisma.address.create({
    data: {
      userId: user.id,
      name: "Demo User",
      phone: "9876543211",
      address: "42 Fashion Street, Bandra West",
      city: "Mumbai",
      state: "Maharashtra",
      pincode: "400050",
      isDefault: true,
    },
  });

  await prisma.coupon.createMany({
    data: [
      { code: "TRUFITZ10", discount: 10, type: "percentage", active: true },
      { code: "WELCOME15", discount: 15, type: "percentage", active: true },
      { code: "FLAT200", discount: 200, type: "flat", active: true },
    ],
  });

  let productIndex = 0;

  for (const cat of categories) {
    const category = await prisma.category.create({ data: cat });
    const names = productNames[cat.slug] || [];

    for (let i = 0; i < names.length; i++) {
      const price = 1299 + i * 400 + productIndex * 50;
      const discount = i % 3 === 0 ? 15 : i % 2 === 0 ? 10 : 0;
      const slug = slugify(`${names[i]}-${productIndex}`);

      const product = await prisma.product.create({
        data: {
          name: names[i],
          slug,
          description: `Premium ${cat.name.toLowerCase()} from TRUFITZ. Designed for the modern man who values quality, comfort, and effortless style. Features a refined fit with attention to every detail.`,
          price,
          discount,
          images: JSON.stringify(imageSets[productIndex % imageSets.length]),
          colors: JSON.stringify(colors.slice(0, 2 + (i % 3))),
          sizes: JSON.stringify(["S", "M", "L", "XL"]),
          fabric: fabrics[productIndex % fabrics.length],
          rating: 4.2 + (i % 8) * 0.1,
          reviewCount: 12 + i * 7,
          stock: 30 + productIndex * 5,
          categoryId: category.id,
          section: i < 2 ? "new-arrivals" : "best-sellers",
          isPremium: i >= 3,
          isLimited: i === 5,
          isSale: discount > 0,
          isTrending: i >= 2 && i <= 4,
          isBestSeller: i === 1 || i === 3,
        },
      });

      await prisma.review.createMany({
        data: [
          {
            productId: product.id,
            userId: user.id,
            rating: 5,
            comment: "Absolutely love the fit and fabric quality. True to size and very comfortable.",
          },
          {
            productId: product.id,
            userId: admin.id,
            rating: 4,
            comment: "Great premium feel. The material is top-notch. Would recommend sizing up for oversized fit.",
          },
        ],
      });

      productIndex++;
    }
  }

  console.log("Seeding complete!");
  console.log("Categories: Oversized T-Shirts, T-Shirts, Shirts, Pants");
  console.log("Admin: admin@trufitz.com / admin123");
  console.log("User: user@trufitz.com / user123");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
