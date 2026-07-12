import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const replacements = {
  "photo-1596755094514-f87e34085b56": "photo-1517841905240-472988babdf9",
  "photo-1618354691373-d851c5c3d990": "photo-1492562080023-ab3db95bfbce",
  "photo-1602810318383-0e0d0c0e0e0e": "photo-1524504388940-b1c1722653e1",
};

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, slug: true, images: true } });
  let updatedCount = 0;

  for (const product of products) {
    let updatedImages = product.images;

    for (const [oldId, newId] of Object.entries(replacements)) {
      updatedImages = updatedImages.replace(new RegExp(oldId, "g"), newId);
    }

    if (updatedImages !== product.images) {
      await prisma.product.update({
        where: { id: product.id },
        data: { images: updatedImages },
      });
      updatedCount += 1;
      console.log(`Updated product ${product.slug}`);
    }
  }

  console.log(`Finished updating ${updatedCount} product(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
