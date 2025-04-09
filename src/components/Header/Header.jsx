import { BsCartDash } from "react-icons/bs";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { BiSolidHeart } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../store/searchSlice";
import { toggleFavorites, toggleMenu } from "../../store/menuSlice";
import { togglePanel } from "../../store/sidePanelSlice";
import HeaderNavigationBlock from "./HeaderNavigationBlock";

import styles from "./Header.module.css";

//dispatch
const Header = () => {
   // Используем forwardRef
   const [isOverlayVisible, setOverlayVisible] = useState(false);

   const dispatch = useDispatch();
   const favoriteCount = useSelector((state) => state.favorite.items.length);
   const searchQuery = useSelector((state) => state.search.query);
   const isRegistered = useSelector((state) => state.auth.user);

   const handleFocus = () => {
      setOverlayVisible(true); // Показываем затемнение при фокусе на поле
   };

   const handleOverlayClick = () => {
      setOverlayVisible(false); // Скрываем затемнение при клике на фон
   };

   return (
      <div className={styles["header"]}>
         {/* Привязываем ref */}
         <div className={styles["header__wrap"]}>
            <div className={styles["header__left"]}>
               <div
                  className={styles["logo__header"]}
                  onClick={() => {
                     dispatch(setSelectedCategory("Все товары")); // сброс категории
                     dispatch(setSearchQuery("")); // (опционально) сброс поиска
                  }}
               >
                  {/* Ссылка на главную страницу Logo*/}
                  <Link to="/">
                     <svg width="100" height="50" viewBox="0 -10 150 100">
                        <text
                           x="10"
                           y="50"
                           fontSize="30"
                           fontFamily="Arial"
                           fill="black"
                           fontWeight="bold"
                        >
                           S
                        </text>
                        <text
                           x="140"
                           y="50"
                           fontSize="30"
                           fontFamily="Arial"
                           fill="black"
                           fontWeight="bold"
                        >
                           H
                        </text>
                        <text
                           x="35"
                           y="70"
                           fontSize="90"
                           fontFamily="Arial"
                           fill="#6e41e2"
                        >
                           O
                        </text>
                        <text
                           x="110"
                           y="50"
                           fontSize="30"
                           fontFamily="Arial"
                           fill="black"
                           fontWeight="bold"
                        >
                           P
                        </text>
                     </svg>
                  </Link>
               </div>
            </div>

            <div className={styles["header__center"]}>
               <div className={styles["searchContainer"]}>
                  <input
                     type="text"
                     placeholder="Поиск..."
                     className={styles["searchInput"]}
                     onFocus={handleFocus}
                     value={searchQuery}
                     onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                  />
                  <div className={styles["searchButton"]}>Найти</div>
               </div>

               <div
                  className={`${styles.darkOverlay} ${
                     isOverlayVisible ? styles.show : ""
                  }`}
                  onClick={handleOverlayClick}
               />
            </div>

            <div className={styles["hideOnMobile"]}>
               <HeaderNavigationBlock />
            </div>

            {/* <div className={styles["header__right"]}>
               <div
                  className={`${styles["icon"]} ${styles["icon-account"]}`}
                  onClick={() => dispatch(toggleMenu())}
               >
                  <FaRegUser size={24} />
                  <span>Кабинет</span>
               </div>

               <div
                  className={`${styles["icon"]} ${styles["icon-favorites"]}`}
                  onClick={() => {
                     if (!isRegistered) {
                        dispatch(togglePanel()); // Открыть панель, если не зарегистрирован
                     } else {
                        dispatch(toggleFavorites()); // Открыть избранное, если зарегистрирован
                     }
                  }}
               >
                  {favoriteCount ? (
                     <BiSolidHeart
                        style={{
                           fill: "red",
                           stroke: "black",
                           strokeWidth: "2px",
                        }}
                        size={24}
                     />
                  ) : (
                     <FaRegHeart size={24} />
                  )}

                  <span>Избранное</span>
                  <div
                     className={styles["header__favorite-count"]}
                     // onClick={() => dispatch(toggleFavorites())}
                  >
                     {favoriteCount ? favoriteCount : ""}
                  </div>
               </div>

               <div className={`${styles["icon"]} ${styles["icon-cart"]}`}>
                  <BsCartDash size={24} />
                  <span>Корзина</span>
               </div>
            </div> */}
         </div>
      </div>
   );
};

export default Header;
