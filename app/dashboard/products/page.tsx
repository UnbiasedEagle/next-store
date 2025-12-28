import { db } from '@/server/db';
import placeholder from '@/public/placeholder_small.jpg';
import { DataTable } from './data-table';
import { columns } from './columns';

const ProductsPage = async () => {
  const products = await db.query.products.findMany({
    orderBy: (products, { desc }) => [desc(products.id)],
  });

  const dataTable = products.map((product) => {
    return {
      id: product.id,
      title: product.title,
      price: product.price,
      variants: [],
      image: placeholder.src,
    };
  });

  return (
    <div>
      <DataTable columns={columns} data={dataTable} />
    </div>
  );
};

export default ProductsPage;
