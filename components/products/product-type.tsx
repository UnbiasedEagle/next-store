'use client';

import { VariantsWithImagesTags } from '@/lib/infer-type';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

interface ProductTypeProps {
  variants: VariantsWithImagesTags[];
}

export const ProductType = ({ variants }: ProductTypeProps) => {
  const searchParams = useSearchParams();
  const selectedType = searchParams.get('type') || variants[0].productType;

  return variants.map((variant) => {
    if (variant.productType === selectedType) {
      return (
        <motion.div
          key={variant.id}
          animate={{ y: 0, opacity: 1 }}
          initial={{ opacity: 0, y: 6 }}
          className='text-secondary-foreground font-medium'
        >
          {selectedType}
        </motion.div>
      );
    }
  });
};
