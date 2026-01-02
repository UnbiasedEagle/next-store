'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { VariantsWithImagesTags } from '@/lib/infer-type';
import { VariantSchema, VariantSchemaType } from '@/lib/validations/product';
import { zodResolver } from '@hookform/resolvers/zod';
import { PropsWithChildren, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputTags } from './input-tags';

interface ProductVariantProps {
  productID?: number;
  variant?: VariantsWithImagesTags;
  editMode: boolean;
}

export const ProductVariant = ({
  children,
  productID,
  variant,
  editMode,
}: PropsWithChildren<ProductVariantProps>) => {
  const form = useForm({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: '#000000',
      editMode,
      id: undefined,
      productID,
      productType: 'Enter variant title',
    },
  });
  const [open, setOpen] = useState(false);

  const onSubmit = (data: VariantSchemaType) => {
    console.log(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className='lg:max-w-5xl overflow-y-auto max-h-[860px]'>
        <DialogHeader>
          <DialogTitle>{editMode ? 'Edit' : 'Create'} your variant</DialogTitle>
          <DialogDescription>
            Manage your product variants here. You can add tags, images, and
            more.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='productType'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder='Pick a title for your variant'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='color'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Variant Color</FormLabel>
                  <FormControl>
                    <Input type='color' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='tags'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <InputTags {...field} onChange={(e) => field.onChange(e)} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4 items-center justify-center'>
              <Button
                disabled={!form.formState.isValid || !form.formState.isDirty}
                type='submit'
              >
                {editMode ? 'Update Variant' : 'Create Variant'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
