import { useSelector } from "react-redux";
import { getPriceInfo } from "../../hooks/usePriceInfo";

import styles from "./FinalPrice.module.css";

const FinalPrice = () => {
   const product = useSelector((state) => state.products.selectedProduct);
   if (!product) return null;

   const { discountedPrice } = getPriceInfo(product);

   return (
      <span className={styles.price}>
         {discountedPrice.toLocaleString("uk-UA")} ₴
      </span>
   );
};

export default FinalPrice;
