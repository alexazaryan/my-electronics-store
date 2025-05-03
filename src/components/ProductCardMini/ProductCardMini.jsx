import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorite } from "../../store/favoriteSlice";
import { togglePanel } from "../../store/sidePanelSlice";
import ProductMetaInfo from "../ProductMetaInfo/ProductMetaInfo";
import { BsCartDash, BsCartCheck } from "react-icons/bs";
import { FaSave } from "react-icons/fa";

import styles from "./ProductCardMini.module.css";

const ProductCardMini = ({
   item,
   showDelete = false,
   onDelete,
   showSku = false,
   showDropPrice = false,
   showEditableMeta = false,
   onMetaChange,
}) => {
   const dispatch = useDispatch();

   const isAdmin = useSelector((state) => state.auth.isAdmin); // ✅ добавить
   const isRegistered = useSelector((state) => !!state.auth.user);
   const favorites = useSelector((state) => state.favorite.items);
   const isFavorite = favorites.some((fav) => fav.productId === item.id);

   const hasDiscount = item.discount > 0;
   const discountedPrice = hasDiscount
      ? Math.floor(item.price * (1 - item.discount / 100))
      : item.price;

   return (
      <li className={styles.card}>
         {/* переход на детали продукта */}
         <Link to={`/product/${item.id}`} className={styles.link}>
            <div className={styles.imgWrap}>
               <img
                  src={item.images?.[0] || item.imageUrl || "/logo.png"}
                  alt={item.name}
                  className={styles.img}
               />
            </div>
            <p className={styles.name}>{item.name}</p>
         </Link>

         {/* Показывать как звезды (если не редактируемый режим) */}
         {!showEditableMeta && (
            <ProductMetaInfo
               rating={item.rating}
               ordersCount={item.ordersCount}
            />
         )}

         {/* Редактируемый блок для админки */}
         {showEditableMeta && (
            <div className={styles.editableMetaBox}>
               <div className={styles.inputRow}>
                  <label className={styles.label}>
                     Рейтинг:
                     <input
                        className={styles.input}
                        type="number"
                        value={item.rating || 0}
                        min="0"
                        max="5"
                        step="0.1"
                        onChange={(e) =>
                           onMetaChange?.(item.id, {
                              rating: parseFloat(e.target.value),
                           })
                        }
                     />
                  </label>
               </div>
               <div className={styles.inputRow}>
                  <label className={styles.label}>
                     Заказов:
                     <input
                        className={styles.input}
                        type="number"
                        value={item.ordersCount || 0}
                        min="0"
                        onChange={(e) =>
                           onMetaChange?.(item.id, {
                              ordersCount: parseInt(e.target.value),
                           })
                        }
                     />
                  </label>
               </div>
            </div>
         )}

         {/* Цена и скидка */}
         <div className={styles.bottomRow}>
            <div className={styles.priceBox}>
               {/* старая цена, перечёркнутая */}
               {hasDiscount && (
                  <span className={styles.oldPrice}>
                     {item.price.toLocaleString("uk-UA")} ₴
                  </span>
               )}

               {/* новая цена красная */}
               <span
                  className={
                     hasDiscount ? styles.discountPrice : styles.normalPrice
                  }
               >
                  {discountedPrice.toLocaleString("uk-UA")} ₴
               </span>
            </div>

            {/* Избранное */}
            <span
               className={styles.cartIcon}
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  if (!isRegistered) {
                     dispatch(togglePanel());
                  } else {
                     dispatch(toggleFavorite(item.id));
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

         {/* Дроп цена */}
         {showDropPrice && (
            <div style={{ color: "red", marginTop: "4px", minHeight: "20px" }}>
               {item.purchase ? (
                  <>Дроп&nbsp;{item.purchase.toLocaleString("uk-UA")}&nbsp;₴</>
               ) : null}
            </div>
         )}

         {/* Артикул */}
         {showSku && (
            <div className={styles.skuRow}>
               <span className={styles.skuLabel}>Артикул:</span>
               <span className={styles.skuValue}>
                  {item.sku?.trim() || "---"}
               </span>
               {isAdmin && (
                  <FaSave
                     className={styles.saveIcon}
                     onClick={() =>
                        navigator.clipboard.writeText(item.sku?.trim() || "---")
                     }
                     title="Скопировать артикул"
                  />
               )}
            </div>
         )}

         {/* Удаление */}
         {showDelete && (
            <button
               className={styles.deleteButton}
               onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  onDelete?.(item);
               }}
            >
               Удалить
            </button>
         )}
      </li>
   );
};

export default ProductCardMini;
