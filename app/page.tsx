import { Algolia } from "@/components/products/algolia";
import { ProductTags } from "@/components/products/product-tags";
import { Products } from "@/components/products/products";
import { db } from "@/server/db";

const HomePage = async () => {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (variant, { desc }) => [desc(variant.id)],
  });

  return (
    <main>
      <Algolia />
      <ProductTags />
      <Products variants={data} />
    </main>
  );
};

export default HomePage;
