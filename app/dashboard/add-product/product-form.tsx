'use client';

import { ProductSchemaType } from '@/lib/validations/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { ProductSchema } from '@/lib/validations/product';
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

  const onSubmit = (data: ProductSchemaType) => {
    if (editMode) {
      // Update product
    } else {
      // Create product
    }
    router.push('/dashboard/products');
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
