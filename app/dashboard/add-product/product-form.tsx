'use client';

import { ProductSchema, ProductSchemaType } from '@/lib/validations/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Tiptap from './tiptap';
import { useAction } from 'next-safe-action/hooks';
import { createProduct } from '@/server/actions/products/create-product';
import { toast } from 'sonner';

export const ProductForm = () => {
  const form = useForm<ProductSchemaType>({
    defaultValues: {
      title: '',
      description: '',
      price: 0,
    },
    mode: 'onChange',
    resolver: zodResolver(ProductSchema),
  });
  const router = useRouter();
  const searchParams = useSearchParams();
  const editMode = searchParams.get('id');

  const { status, execute } = useAction(createProduct, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
      }
      if (data?.success) {
        router.push('/dashboard/products');
        toast.success(data.success);
      }
    },
    onExecute: () => {
      if (editMode) {
        toast.loading('Editing Product');
      }
      if (!editMode) {
        toast.loading('Creating Product');
      }
    },
  });

  const onSubmit = (data: ProductSchemaType) => {
    execute(data);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{editMode ? 'Edit Product' : 'Create Product'}</CardTitle>
        <CardDescription>
          {editMode
            ? 'Make changes to existing product'
            : 'Add a brand new product'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='title'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Title</FormLabel>
                  <FormControl>
                    <Input placeholder='Enter product title' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Tiptap val={field.value} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Price</FormLabel>
                  <FormControl>
                    <div className='flex items-center gap-2'>
                      <DollarSign
                        size={36}
                        className='p-2 bg-muted  rounded-md'
                      />
                      <Input
                        {...field}
                        type='number'
                        placeholder='Your price in USD'
                        step='0.1'
                        min={0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              className='w-full'
              disabled={
                status === 'executing' ||
                !form.formState.isValid ||
                !form.formState.isDirty
              }
              type='submit'
            >
              {editMode ? 'Save Changes' : 'Create Product'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
