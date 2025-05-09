// export const getPriceInfo = (product, offset = 0) => {
//    const basePrice = product.price + offset; // +100 если нужно к цен товара
//    const hasDiscount = product.discount > 0;
//    const discountedPrice = hasDiscount
//       ? Math.floor(basePrice * (1 - product.discount / 100))
//       : basePrice;

//    return {
//       hasDiscount,
//       discountedPrice,
//       oldPrice: basePrice,
//    };
// };

export const getPriceInfo = (product, offset = 0) => {
   const markup = product.markup || 0; // % наценки
   const basePrice = (product.price + offset) * (1 + markup / 100); // применяем наценку
   const hasDiscount = product.discount > 0;
   const discountedPrice = hasDiscount
      ? Math.floor(basePrice * (1 - product.discount / 100))
      : Math.floor(basePrice);

   return {
      hasDiscount,
      discountedPrice,
      oldPrice: Math.floor(basePrice),
   };
};
