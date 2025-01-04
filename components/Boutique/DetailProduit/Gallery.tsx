"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";

export default function Gallery({ imageUrl }: { imageUrl: string[] }) {
  const defaultImage = "/logo/telephone_du_monde.png";

  const images = imageUrl && imageUrl.length > 0 ? imageUrl : [defaultImage];

  const [mainImage, setMainImage] = useState(images[0]);

  useEffect(() => {
    if (imageUrl && imageUrl.length > 0) {
      setMainImage(imageUrl[0]);
    } else {
      setMainImage(defaultImage);
    }
  }, [imageUrl]);

  console.log("images", images);

  return (
    <div className="flex flex-col justify-center items-center gap-2 h-[450px] sm:h-full w-full lg:w-[300px]">
      <Image
        src={mainImage}
        alt="smartphone"
        width={800}
        height={800}
        className="w-48 h-80 sm:w-full lg:h-80 object-contain"
      />

      <div className="flex gap-2 justify-center md:justify-normal overflow-auto tailwind-scrollbar-hide">
        {images.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt="smartphone"
            width={200}
            height={200}
            className={`w-12 h-16 lg:w-full lg:h-20 object-cover cursor-pointer filter grayscale transition-all ease-in-out ${
              mainImage === image ? "filter-none" : ""
            }`}
            onClick={() => setMainImage(image)}
          />
        ))}
      </div>
    </div>
  );
}
