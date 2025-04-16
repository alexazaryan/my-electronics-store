import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../CustomButton/CustomButton";
import { toggleFavorites } from "../../store/menuSlice";
import { toggleFavorite } from "../../store/favoriteSlice";

import styles from "./StickyBuyButton.module.css";

const StickyBuyButton = () => {
   const product = useSelector((state) => state.products.selectedProduct);
   const favorites = useSelector((state) => state.favorite.items);
   const isRegistered = useSelector((state) => !!state.auth.user);
   const isFavoritesVisible = useSelector(
      (state) => state.menu.isFavoritesVisible
   );
   const dispatch = useDispatch();

   if (!product || !product.price) return null;

   const handleClick = () => {
      if (!isRegistered) {
         dispatch({ type: "sidePanel/togglePanel" });
         return;
      }

      const isAlreadyFavorite = favorites.some(
         (fav) => fav.productId === product.id
      );

      if (!isAlreadyFavorite) {
         dispatch(toggleFavorite(product.id));
      }

      dispatch(toggleFavorites());
   };

   return (
      <div
         className={`${styles.wrapper} ${
            isFavoritesVisible ? styles.hidden : styles.visible
         }`}
      >
         <span className={styles.price}>
            {product.price.toLocaleString("uk-UA")} ₴
         </span>
         <CustomButton className={styles.button} onClick={handleClick}>
            Купить
         </CustomButton>
      </div>
   );
};

export default StickyBuyButton;
