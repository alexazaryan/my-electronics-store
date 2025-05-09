import { getPriceInfo } from "../../hooks/usePriceInfo";
import styles from "./ProductPrice.module.css";

const ProductPrice = ({ product }) => {
   const { hasDiscount, discountedPrice, oldPrice } = getPriceInfo(product);

   return (
      <div className={styles["price-block"]}>
         <div
            className={styles["old-price"]}
            style={{ visibility: hasDiscount ? "visible" : "hidden" }}
         >
            {oldPrice.toLocaleString("uk-UA")} ₴
         </div>

         <span
            className={
               hasDiscount ? styles["discount-price"] : styles["normal-price"]
            }
         >
            {discountedPrice.toLocaleString("uk-UA")} ₴
         </span>
      </div>
   );
};

export default ProductPrice;
