import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "../../store/productsSlice";
import { toggleFavorite } from "../../store/favoriteSlice";
import CustomButton from "../CustomButton/CustomButton";
import Spinner from "../Spinner/Spinner";
import { useNavigate } from "react-router-dom";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { togglePanel } from "../../store/sidePanelSlice";
import useScrollMemory from "../../hooks/useScrollMemory";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";
import { BsCartDash, BsCartCheck } from "react-icons/bs";

import styles from "./ProductList.module.css";

const ProductList = () => {
   useScrollMemory();
   const [selectedProduct, setSelectedProduct] = useState(null);
   const [isModalOpen, setIsModalOpen] = useState(false);

   const initialVisibleCount =
      Number(sessionStorage.getItem("visibleCount")) || 36;
   const [visibleCount, setVisibleCount] = useState(initialVisibleCount);

   const searchQuery = useSelector((state) => state.search.query);
   const favorites = useSelector((state) => state.favorite.items);
   const { isAdmin } = useSelector((state) => state.auth);
   const isRegistered = useSelector((state) => !!state.auth.user);
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const user = useSelector((state) => state.auth.user);

   const {
      items: products,
      status,
      error,
   } = useSelector((state) => state.products);
   const selectedCategory = useSelector(
      (state) => state.categories.selectedCategory
   );

   // следим за скролом
   useEffect(() => {
      sessionStorage.setItem("visibleCount", visibleCount.toString());
   }, [visibleCount]);

   useEffect(() => {
      dispatch(fetchProducts());
   }, [dispatch]);

   let filteredProducts = [];

   if (searchQuery.trim()) {
      filteredProducts = products.filter((product) =>
         product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
   } else {
      filteredProducts =
         selectedCategory === "Все товары"
            ? products
            : products.filter(
                 (product) => product.category === selectedCategory
              );
   }

   // 👇 сохраняем скидки один раз на сессию
   const discountMapRef = useRef({});
   products.forEach((p) => {
      if (!(p.id in discountMapRef.current)) {
         discountMapRef.current[p.id] = Math.random() < 0.4;
      }
   });

   const handleDelete = async (productId, imageUrl) => {
      try {
         await dispatch(deleteProduct(productId));
         console.log(`Изображение для удаления: ${imageUrl}`);
      } catch (error) {
         console.error("Ошибка при удалении продукта: ", error);
      }
   };

   // отслеживаем часто просматриваемые карточки
   const trackProductView = (productId) => {
      const userId = user?.id || "anonymous";
      const key = `viewedProducts_${userId}`;
      const viewedItems = JSON.parse(localStorage.getItem(key)) || [];

      // Добавляем ID товара в начало массива и удаляем дубликаты
      const updatedViews = [
         productId,
         ...viewedItems.filter((id) => id !== productId),
      ].slice(0, 50); // Ограничиваем 50 последними просмотрами

      localStorage.setItem(key, JSON.stringify(updatedViews));
   };

   // добавление по 36 карточек
   const handleLoadMore = () => {
      setVisibleCount((prev) => {
         const newCount = prev + 36; // увеличиваем на 36
         return newCount;
      });
   };

   return (
      <div className={styles["product-list__box"]}>
         {isModalOpen && (
            <ConfirmModal
               handleDelete={handleDelete}
               product={selectedProduct}
               setIsModalOpen={setIsModalOpen}
            />
         )}

         {status === "loading" ? (
            <div className={styles["preloader"]}>
               <Spinner />
            </div>
         ) : status === "failed" ? (
            <div>Error: {error}</div>
         ) : filteredProducts.length === 0 ? (
            <div className={styles["product-list__box"]}>
               <p>Товаров нет.</p>
            </div>
         ) : (
            <div>
               <h2>Лучшие предложения</h2>
               <ul className={styles["product-list__ul"]}>
                  {filteredProducts.slice(0, visibleCount).map((product) => {
                     const isFavorite = favorites.some(
                        (fav) => fav.productId === product.id
                     );

                     const name = product.name;
                     const capitalized =
                        name.charAt(0).toUpperCase() + name.slice(1);

                     const hasDiscount = discountMapRef.current[product.id];
                     const fakeOldPrice = Math.floor(product.price * 1.3); // скидки

                     return (
                        <li
                           key={product.id}
                           className={styles["product-list__card"]}
                           onClick={() => {
                              trackProductView(product.id); // трекер частопросматриваемых
                              navigate(`/product/${product.id}`); // переход на товар
                           }}
                        >
                           <div className={styles["product-list__img-wrap"]}>
                              <img
                                 src={
                                    product.images?.[0] ||
                                    product.imageUrl?.split(",")[0] ||
                                    "/logo.png"
                                 }
                                 alt={product.name}
                                 className={styles["product-list__img"]}
                              />
                              {/* иконка избранное */}
                              {/* <div
                              className={styles["product-list__favorite-icon"]}
                              onClick={(e) => {
                                 e.preventDefault();
                                 e.stopPropagation();
                                 if (!isRegistered) {
                                    dispatch(togglePanel());
                                 } else {
                                    dispatch(toggleFavorite(product.id));
                                 }
                              }}
                           >
                              {isFavorite ? (
                                 <BiSolidHeart
                                    style={{
                                       fill: "red",
                                       stroke: "black",
                                       strokeWidth: "1px",
                                    }}
                                 />
                              ) : (
                                 <BiHeart />
                              )}
                           </div> */}
                           </div>

                           <div>
                              <ul
                                 className={styles["product-list__wrap-title"]}
                              >
                                 <li className={styles["product-list__name"]}>
                                    {capitalized}
                                 </li>

                                 <li
                                    className={
                                       styles["product-list__description"]
                                    }
                                 ></li>

                                 {/* скидки */}
                                 <li
                                    className={
                                       hasDiscount
                                          ? styles["old-price"]
                                          : styles["invisible"]
                                    }
                                 >
                                    {fakeOldPrice.toLocaleString("uk-UA")} ₴
                                 </li>

                                 <li className={styles["product-action-row"]}>
                                    <div className={styles["price-block"]}>
                                       <span
                                          className={
                                             hasDiscount
                                                ? styles["discount-price"]
                                                : styles["normal-price"]
                                          }
                                       >
                                          {product.price.toLocaleString(
                                             "uk-UA"
                                          )}{" "}
                                          ₴
                                       </span>

                                       <span
                                          className={
                                             styles["product-list-icon"]
                                          }
                                          onClick={(e) => {
                                             e.preventDefault();
                                             e.stopPropagation();
                                             if (!isRegistered) {
                                                dispatch(togglePanel());
                                             } else {
                                                dispatch(
                                                   toggleFavorite(product.id)
                                                );
                                             }
                                          }}
                                       >
                                          {isFavorite ? (
                                             <BsCartCheck
                                                style={{
                                                   fill: "red",
                                                   stroke: "green",
                                                   strokeWidth: "1px",
                                                }}
                                             />
                                          ) : (
                                             <BsCartDash />
                                          )}
                                       </span>
                                    </div>
                                 </li>

                                 <li
                                    style={{ color: "red" }}
                                    className={
                                       !isAdmin ? styles["hidden-for-user"] : ""
                                    }
                                 >
                                    Дроп&nbsp;
                                    {product.purchase?.toLocaleString(
                                       "uk-UA"
                                    ) || "—"}
                                    &nbsp;₴
                                 </li>
                              </ul>
                           </div>

                           <div className={styles["product-ist__wrap-button"]}>
                              {isAdmin && (
                                 <button
                                    className={
                                       styles["product-ist__delete-button"]
                                    }
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       setIsModalOpen(true);
                                       setSelectedProduct(product);
                                    }}
                                 >
                                    delete
                                 </button>
                              )}
                           </div>
                        </li>
                     );
                  })}
               </ul>
            </div>
         )}

         {status === "succeeded" &&
            selectedCategory === "Все товары" &&
            !searchQuery.trim() && (
               <CustomButton
                  onClick={handleLoadMore}
                  className={styles["product-ist__custom-button--add-product"]}
               >
                  Показать еще
               </CustomButton>
            )}

         <ScrollToTopButton />
      </div>
   );
};

export default ProductList;
