'use client';

import { cn } from '@/lib/utils';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface ProductTagsProps {
  tags: string[];
}

export const ProductTags = ({ tags }: ProductTagsProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get('tag');

  const setFilter = (tag: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    const query = params.toString();
    router.push(query ? `?${query}` : '/');
  };

  const allTags = ['', ...tags];

  return (
    <div className='my-10 px-4'>
      <div className='max-w-fit mx-auto overflow-x-auto no-scrollbar pb-2'>
        <div className='flex items-center gap-2 p-1.5 bg-muted/30 backdrop-blur-sm rounded-full border border-border/50 shadow-sm'>
          {allTags.map((tag) => {
            const isActive = (!tag && !currentTag) || currentTag === tag;
            const label = tag || 'All products';

            return (
              <button
                key={tag || 'all'}
                onClick={() => setFilter(tag)}
                className={cn(
                  'relative px-6 py-2 rounded-full text-sm font-medium transition-colors duration-300 whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
                  isActive
                    ? 'text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {isActive && (
                  <motion.div
                    layoutId='active-pill'
                    className='absolute inset-0 bg-primary rounded-full shadow-lg shadow-primary/20 z-0'
                    transition={{
                      type: 'spring',
                      stiffness: 450,
                      damping: 35,
                    }}
                  />
                )}
                <span className='relative z-10 capitalize'>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
