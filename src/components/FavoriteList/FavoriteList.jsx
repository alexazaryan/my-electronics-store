import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, forwardRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
   fetchFavorites,
   toggleFavorite,
   updateFavoriteQuantity,
} from "../../store/favoriteSlice";
import CustomButton from "../CustomButton/CustomButton";
import { toggleFavorites, toggleOrderModal } from "../../store/menuSlice";
import { BsTrash, BsPlus, BsDash } from "react-icons/bs";
import OrderModal from "../OrderModal/OrderModal";
// import { clearFavoritesInFirebase } from "../../utils/clearFavorites"; // импорт очистки

import { saveOrder } from "../../utils/saveOrder";

import { clearFavorites } from "../../store/favoriteSlice";
import { fetchUserOrders } from "../../store/orderHistorySlice";

import styles from "./FavoriteList.module.css";
import { clearFavoritesInRealtime } from "../../utils/clearFavorites";

const FavoriteList = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const [emptyError, setEmptyError] = useState(false); // проверка есть ли товар для заказа

   const user = useSelector((state) => state.auth.user);
   const products = useSelector((state) => state.products.items);
   const favoriteItems = useSelector((state) => state.favorite.items);
   const isOrderModalOpen = useSelector((state) => state.menu.isOrderModalOpen); // модельно окно заказов

   //  отправки заказа
   const handleOrderSubmit = async (formData) => {
      if (!user || !user.uid) {
         alert("Вы не авторизованы");
         return false;
      }

      const totalPrice = favoriteProducts.reduce(
         (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
         0
      );

      const order = {
         ...formData,
         products: favoriteProducts.map((item) => ({
            id: item.id,
            name: item.name,
            image: item.images?.[0] || item.imageUrl?.split(",")[0] || "",
            quantity: item.quantity || 1,
            price: item.price || 0,
         })),
         total: totalPrice,
      };

      try {
         await saveOrder(user.uid, order); // сохраняем заказ
         // await clearFavoritesInFirebase(user.uid); // ⬅️ удаляем избранное в Firebase
         await clearFavoritesInRealtime(user.uid);

         console.log("Избранное в Firebase очищено");
         dispatch(clearFavorites()); // очищаем избранное в Redux
         dispatch(fetchUserOrders(user.uid)); // загружаем заказы пользователя

         return true;
      } catch (err) {
         console.error("Ошибка Firestore:", err);
         return false;
      }
   };

   useEffect(() => {
      if (user) {
         dispatch(fetchFavorites());
      }
   }, [user, dispatch]);

   useEffect(() => {
      if (!products.length || !favoriteItems.length) return;

      const validIds = new Set(products.map((p) => p.id));

      favoriteItems.forEach((fav) => {
         if (!validIds.has(fav.productId)) {
            dispatch(toggleFavorite(fav.productId));
         }
      });
   }, [products, favoriteItems, dispatch]);

   const favoriteProducts = useMemo(() => {
      return favoriteItems
         .map((fav) => {
            const product = products.find((p) => p.id === fav.productId);
            return product ? { ...product, quantity: fav.quantity } : null;
         })
         .filter(Boolean);
   }, [products, favoriteItems]);

   const handleQuantityChange = (productId, change, e) => {
      e.stopPropagation();
      const product = favoriteProducts.find((item) => item.id === productId);
      if (!product) return;

      const newQuantity = (product.quantity || 1) + change;
      if (newQuantity <= 0) return;
      dispatch(updateFavoriteQuantity({ productId, quantity: newQuantity }));
   };

   const handleDelete = (productId, e) => {
      e.stopPropagation();
      dispatch(toggleFavorite(productId));
   };

   const handleProductClick = (productId) => {
      navigate(`/product/${productId}`);
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
         <CustomButton
            className={styles["favorite-list__custom-button-close"]}
            onClick={() => dispatch(toggleFavorites(false))}
         >
            ✖ закрыть
         </CustomButton>
         <div className={styles["favorite-list__wrap"]}>
            <strong>Избранное</strong>
            {favoriteProducts.length === 0 ? (
               emptyError && (
                  <p className={styles.emptyErrorMessage}>
                     Список пуст! Добавьте товары для оформления заказа.
                  </p>
               )
            ) : (
               <ul className={styles["favorite-list__card-wrap"]}>
                  {favoriteProducts.map((product) => (
                     <li
                        key={product.id}
                        className={styles["favorite-item__cards"]}
                     >
                        <div className={styles["favorite-item__card"]}>
                           <img
                              className={styles["favorite-item__img"]}
                              src={
                                 product.images?.[0] ||
                                 product.imageUrl?.split(",")[0] ||
                                 "/logo.png"
                              }
                              alt={product.name}
                              onClick={() => {
                                 handleProductClick(product.id);
                                 dispatch(toggleFavorites(false));
                              }}
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

                        {/* +/- */}
                        <div className={styles["favorite__quantity-controls"]}>
                           <div className={styles["favorite__quantity-box"]}>
                              <BsDash
                                 className={styles["favorite__icon"]}
                                 onClick={(e) =>
                                    handleQuantityChange(product.id, -1, e)
                                 }
                              />
                              <div className={styles["favorite__things"]}>
                                 {product.quantity || 1}
                              </div>
                              <BsPlus
                                 className={styles["favorite__icon"]}
                                 onClick={(e) =>
                                    handleQuantityChange(product.id, 1, e)
                                 }
                              />
                           </div>

                           <BsTrash
                              className={styles["favorite__delete"]}
                              onClick={(e) => handleDelete(product.id, e)}
                           />
                        </div>
                     </li>
                  ))}
               </ul>
            )}
            {/* оплата */}{" "}
            <div>
               <div className={styles["favorite-list__total"]}>
                  <div className={styles["favorite-list__total_wrap"]}>
                     <strong>К оплате без доставки:</strong>
                     <strong>{total.toLocaleString("uk-UA")} ₴</strong>
                  </div>
                  <CustomButton
                     className={styles["pay-button"]}
                     onClick={() => {
                        if (favoriteProducts.length === 0) {
                           setEmptyError(true); // Показываем ошибку
                           return;
                        }
                        setEmptyError(false); // Если всё ок, убираем ошибку
                        dispatch(toggleOrderModal(true));
                     }}
                  >
                     Оформить заказ
                  </CustomButton>
               </div>
            </div>
         </div>

         {/* подключение модалки */}
         <OrderModal
            isOpen={isOrderModalOpen}
            onClose={() => dispatch(toggleOrderModal(false))}
            onSubmit={handleOrderSubmit}
            user={user}
         />
      </div>
   );
});

export default FavoriteList;
