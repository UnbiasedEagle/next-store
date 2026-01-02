import { db } from '@/server/db';
import placeholder from '@/public/placeholder_small.jpg';
import { DataTable } from './data-table';
import { columns } from './columns';

const ProductsPage = async () => {
  const products = await db.query.products.findMany({
    with: {
      productVariants: {
        with: {
          variantImages: true,
          variantTags: true,
        },
      },
    },
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  const dataTable = products.map((product) => {
    if (product.productVariants.length === 0) {
      return {
        id: product.id,
        title: product.title,
        price: product.price,
        image: placeholder.src,
        variants: [],
      };
    }
    const image = product.productVariants[0].variantImages[0].imageUrl;
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: product.productVariants,
      image,
    };
  });

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
};

export default ProductsPage;
