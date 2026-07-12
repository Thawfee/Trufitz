import { PrismaClient } from "@prisma/client";

async function main() {
  const prisma = new PrismaClient();
  try {
    const products = await prisma.product.findMany({
      select: { id: true, slug: true, images: true },
    });

    for (const product of products) {
      console.log(`${product.slug} -> ${product.images}`);
    }
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
