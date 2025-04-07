import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, forwardRef } from "react";
import {
   fetchFavorites,
   toggleFavorite,
   updateFavoriteQuantity,
} from "../../store/favoriteSlice"; // Загружаем избранное и обновляем количество
import CustomButton from "../CustomButton/CustomButton";
import { toggleFavorites } from "../../store/menuSlice";
import { BsTrash, BsPlusLg, BsDashLg } from "react-icons/bs";

import styles from "./FavoriteList.module.css";

const FavoriteList = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();
   const user = useSelector((state) => state.auth.user);
   const products = useSelector((state) => state.products.items);
   const favoriteItems = useSelector((state) => state.favorite.items); // Массив объектов { productId, quantity }


   useEffect(() => {
      if (user) {
         dispatch(fetchFavorites()); // Загружаем избранное
      }
   }, [user, dispatch]);

   // Используем useMemo для фильтрации товаров
   const favoriteProducts = useMemo(() => {
      return favoriteItems
         .map((fav) => {
            const product = products.find((p) => p.id === fav.productId);
            return product ? { ...product, quantity: fav.quantity } : null;
         })
         .filter(Boolean);
   }, [products, favoriteItems]);

   // Функция для обновления количества товара в избранном
   const handleQuantityChange = (productId, change) => {
      const product = favoriteProducts.find((item) => item.id === productId);
      if (!product) return;

      const newQuantity = (product.quantity || 1) + change;

      if (newQuantity <= 0) return; // Нельзя сделать количество меньше 1
      dispatch(updateFavoriteQuantity({ productId, quantity: newQuantity })); // обновляем количество
   };

   const total = favoriteProducts.reduce(
      (sum, p) => sum + (p.price || 0) * (p.quantity || 1),
      0
   );

   return (
      <div
         ref={ref}
         className={`${styles["favorite-list"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         {/* закрыть панель */}
         <CustomButton
            className={styles["favorite-list__custom-button-close"]}
            onClick={() => dispatch(toggleFavorites(false))}
         >
            ✖ закрыть
         </CustomButton>

         <div className={styles["favorite-list__wrap"]}>
            <strong>Избранное</strong>
            {favoriteProducts.length === 0 ? (
               <p>Список избранного пуст</p>
            ) : (
               <ul className={styles["favorite-list__card-wrap"]}>
                  {favoriteProducts.map((product) => (
                     <li
                        key={product.id}
                        className={styles["favorite-item__cards"]}
                     >
                        <div className={styles["favorite-item__card"]}>
                           <img
                              src={
                                 product.imageUrl?.split(",")[0] || "/logo.png"
                              }
                              alt={product.name}
                              width={50}
                           />
                           <div>
                              <p>
                                 {product.name.length > 50
                                    ? `${product.name.slice(0, 50)}...`
                                    : product.name}
                              </p>
                              <strong>
                                 {product.price?.toLocaleString("uk-UA")} ₴
                              </strong>
                           </div>
                        </div>

                        <div className={styles["favorite__quantity-controls"]}>
                           <div className={styles["favorite__quantity-box"]}>
                              <BsDashLg
                                 className={styles["favorite__icon"]}
                                 onClick={() =>
                                    handleQuantityChange(product.id, -1)
                                 }
                              />
                              <span>{product.quantity || 1}</span>
                              <BsPlusLg
                                 className={styles["favorite__icon"]}
                                 onClick={() =>
                                    handleQuantityChange(product.id, 1)
                                 }
                              />
                           </div>

                           <BsTrash
                              className={styles["favorite__delete"]}
                              onClick={() =>
                                 dispatch(toggleFavorite(product.id))
                              }
                           />
                        </div>
                     </li>
                  ))}
               </ul>
            )}
            <div className={styles["favorite-list__total"]}>
               <strong>Total:</strong>
               <strong>{total.toLocaleString("uk-UA")} ₴</strong>
            </div>
         </div>
      </div>
   );
});

export default FavoriteList;
