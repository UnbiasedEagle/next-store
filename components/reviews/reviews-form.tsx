'use client';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAction } from 'next-safe-action/hooks';
import { toast } from 'sonner';
import { addReview } from '@/server/actions/reviews/add-review';
import { ReviewSchema, ReviewSchemaType } from '@/lib/validations/reviews';

export const ReviewsForm = () => {
  const router = useRouter();
  const params = useSearchParams();
  const productID = Number(params.get('productID'));

  const form = useForm<ReviewSchemaType>({
    resolver: zodResolver(ReviewSchema),
    defaultValues: {
      rating: 0,
      comment: '',
      productID,
    },
  });

  const { execute, status } = useAction(addReview, {
    onSuccess: ({ data }) => {
      if (data?.error) {
        toast.error(data.error);
        form.reset();
      }
      if (data?.success) {
        toast.success(data.success);
        form.reset();
        router.refresh();
      }
    },
    onError: ({ error }) => {
      toast.error(error?.serverError || 'An error occurred. Please try again.');
    },
  });

  function onSubmit(values: ReviewSchemaType) {
    execute({
      productID,
      rating: values.rating,
      comment: values.comment,
    });
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className='w-full'>
          <Button className='font-medium w-full' variant={'secondary'}>
            Leave a review
          </Button>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <Form {...form}>
          <form className='space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name='comment'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your review</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='How would you describe this product?'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rating'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Leave your Rating</FormLabel>
                  <FormControl>
                    <Input type='hidden' {...field} />
                  </FormControl>
                  <div className='flex gap-1'>
                    {[1, 2, 3, 4, 5].map((value) => {
                      return (
                        <motion.div
                          className='relative cursor-pointer'
                          whileTap={{ scale: 0.8 }}
                          whileHover={{ scale: 1.2 }}
                          key={value}
                        >
                          <Star
                            onClick={() => {
                              field.onChange(value);
                            }}
                            className={cn(
                              'text-primary bg-transparent transition-all duration-300 ease-in-out',
                              (field.value || 0) >= value
                                ? 'fill-primary'
                                : 'fill-muted'
                            )}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              disabled={status === 'executing'}
              className='w-full'
              type='submit'
            >
              {status === 'executing' ? 'Adding Review...' : 'Add Review'}
            </Button>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  );
};
