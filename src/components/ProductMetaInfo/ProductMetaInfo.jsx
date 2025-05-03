import RatingStars from "./RatingStars";
import styles from "./ProductMetaInfo.module.css";

const ProductMetaInfo = ({ rating, ordersCount }) => {
   if (rating == null && !ordersCount) return null;

   return (
      <div className={styles.metaInfo}>
         {rating != null && (
            <>
               <RatingStars rating={rating} />
               <span className={styles.ratingText}>
                  {rating.toFixed(1)} / 5
               </span>
            </>
         )}

         {ordersCount > 0 && (
            <span className={styles.ordersCount}>
               Продано: {ordersCount} шт.
            </span>
         )}
      </div>
   );
};

export default ProductMetaInfo;
