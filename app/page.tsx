import { Algolia } from '@/components/products/algolia';
import { ProductTags } from '@/components/products/product-tags';
import { Products } from '@/components/products/products';
import { db } from '@/server/db';

const HomePage = async () => {
  const data = await db.query.productVariants.findMany({
    with: {
      variantImages: true,
      variantTags: true,
      product: true,
    },
    orderBy: (variant, { desc }) => [desc(variant.id)],
  });

  // get unique tags from data
  const tags = data.flatMap((variant) =>
    variant.variantTags.map(({ tag }) => tag)
  );

  const uniqueTags = [...new Set(tags)];

  return (
    <main>
      <Algolia />
      <ProductTags tags={uniqueTags} />
      <Products variants={data} />
    </main>
  );
};

export default HomePage;
