
import React, { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

interface ProductImageGalleryProps {
  images: string[];
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({ images }) => {
  const [activeImage, setActiveImage] = useState(0);
  
  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square bg-gray-100 overflow-hidden rounded-lg">
        <Carousel className="w-full">
          <CarouselContent>
            {images.map((image, i) => (
              <CarouselItem key={i}>
                <div className="flex items-center justify-center p-1 h-full">
                  <img 
                    src={image} 
                    alt={`Product view ${i + 1}`}
                    className="w-full h-full object-contain" 
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2" />
          <CarouselNext className="right-2" />
        </Carousel>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, i) => (
          <button
            key={i}
            className={cn(
              "flex-shrink-0 w-16 h-16 border-2 rounded overflow-hidden",
              activeImage === i 
                ? "border-pink-500" 
                : "border-transparent hover:border-gray-300"
            )}
            onClick={() => setActiveImage(i)}
          >
            <img 
              src={image} 
              alt={`Thumbnail ${i + 1}`}
              className="w-full h-full object-cover" 
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;
