'use client';

import { VariantsWithImagesTags } from '@/lib/infer-type';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface ProductShowcaseProps {
  variants: VariantsWithImagesTags[];
}

export const ProductShowcase = ({ variants }: ProductShowcaseProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [activeThumbnail, setActiveThumbnail] = useState([0]);
  const searchParams = useSearchParams();
  const selectedColor = searchParams.get('type') || variants[0].productType;

  const updatePreview = (index: number) => {
    api?.scrollTo(index);
  };

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on('slidesInView', (e) => {
      setActiveThumbnail(e.slidesInView());
    });
  }, [api]);

  return (
    <Carousel setApi={setApi} opts={{ loop: true }}>
      <CarouselContent>
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img) => {
              return (
                <CarouselItem key={img.imageUrl}>
                  {img.imageUrl ? (
                    <Image
                      priority
                      className='rounded-md'
                      width={1280}
                      height={720}
                      src={img.imageUrl}
                      alt={img.name}
                    />
                  ) : null}
                </CarouselItem>
              );
            })
        )}
      </CarouselContent>
      <div className='flex overflow-clip py-2 gap-4'>
        {variants.map(
          (variant) =>
            variant.productType === selectedColor &&
            variant.variantImages.map((img, index) => {
              return (
                <div key={img.imageUrl}>
                  {img.imageUrl ? (
                    <Image
                      onClick={() => updatePreview(index)}
                      priority
                      className={cn(
                        index === activeThumbnail[0]
                          ? 'opacity-100'
                          : 'opacity-75',
                        'rounded-md transition-all duration-300 ease-in-out cursor-pointer hover:opacity-75'
                      )}
                      width={72}
                      height={48}
                      src={img.imageUrl}
                      alt={img.name}
                    />
                  ) : null}
                </div>
              );
            })
        )}
      </div>
    </Carousel>
  );
};
