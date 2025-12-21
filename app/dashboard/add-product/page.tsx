import { auth } from '@/server/auth';
import { redirect } from 'next/navigation';
import { ProductForm } from './product-form';

const AddProductPage = async () => {
  const session = await auth();
  if (session?.user?.role !== 'admin') {
    redirect('/dashboard/settings');
  }

  return <ProductForm />;
};

export default AddProductPage;
