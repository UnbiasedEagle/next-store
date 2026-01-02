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
import { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { InputTags } from './input-tags';
import { VariantImages } from './variant-images';
import { createVariant } from '@/server/actions/variants';
import { toast } from 'sonner';
import { useAction } from 'next-safe-action/hooks';

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
  const createVariantToastRef = useRef<string | number | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const form = useForm<VariantSchemaType>({
    resolver: zodResolver(VariantSchema),
    defaultValues: {
      tags: [],
      variantImages: [],
      color: '#000000',
      editMode: false,
      id: undefined,
      productID,
      productType: 'Enter variant title',
    },
  });

  const { status, execute } = useAction(createVariant, {
    onExecute() {
      createVariantToastRef.current = toast.loading(
        editMode ? 'Editing variant' : 'Creating variant',
        {
          duration: 1,
        }
      );
      setOpen(false);
    },
    onSuccess({ data }) {
      if (data?.error) {
        toast.error(data.error, { id: createVariantToastRef.current });
      }
      if (data?.success) {
        toast.success(data.success, { id: createVariantToastRef.current });
      }
    },
  });

  const onSubmit = (data: VariantSchemaType) => {
    execute(data);
  };

  useEffect(() => {
    if (!open) return;

    if (editMode && variant) {
      const formValues = {
        editMode: true,
        id: variant.id,
        productID: variant.productId,
        productType: variant.productType,
        color: variant.color,
        tags: variant.variantTags.map((tag) => tag.tag),
        variantImages: variant.variantImages.map((img) => ({
          name: img.name,
          size: img.size,
          url: img.imageUrl,
        })),
      };

      form.reset(formValues, { keepDefaultValues: false });
    } else {
      form.reset(
        {
          tags: [],
          variantImages: [],
          color: '#000000',
          editMode: false,
          id: undefined,
          productID,
          productType: 'Enter variant title',
        },
        { keepDefaultValues: false }
      );
    }
  }, [open, editMode, variant, form, productID]);

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
            <VariantImages />
            <div className='flex gap-4 items-center justify-center'>
              {editMode && variant && (
                <Button
                  variant={'destructive'}
                  type='button'
                  //   disabled={variantAction.status === 'executing'}
                  onClick={(e) => {
                    e.preventDefault();
                    // variantAction.execute({ id: variant.id });
                  }}
                >
                  Delete Variant
                </Button>
              )}
              <Button
                disabled={
                  status === 'executing' ||
                  !form.formState.isValid ||
                  !form.formState.isDirty
                }
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
