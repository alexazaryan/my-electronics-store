import { BsCartDash } from "react-icons/bs";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { BiSolidHeart, BiCategory } from "react-icons/bi";
import { TfiHome } from "react-icons/tfi";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
   toggleCategoryList,
   toggleFavorites,
   toggleMenu,
} from "../../store/menuSlice";
import { togglePanel } from "../../store/sidePanelSlice";

import styles from "./Header.module.css"; // общий CSS остаётся
import useBodyOverflow from "../../hooks/useBodyOverflow";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { setSearchQuery } from "../../store/searchSlice";

const HeaderNavigationBlock = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();

   const isFavoritesVisible = useSelector(
      (state) => state.menu.isFavoritesVisible // Используем isFavoritesVisible из меню
   );
   const isCategoryListVisible = useSelector(
      (state) => state.menu.isCategoryListVisible
   );

   const isOverlayVisible = useSelector(
      (state) => state.sidePanel.isOverlayVisible
   );
   const favoriteCount = useSelector((state) => state.favorite.items.length);
   const isRegistered = useSelector((state) => state.auth.user);

   useBodyOverflow(
      isFavoritesVisible || isCategoryListVisible || isOverlayVisible
   );

   return (
      <div className={styles["header__right"]}>
         {/* На главную (только для мобилки)*/}
         <div className={styles["home-mobile-only"]}>
            <div
               className={`${styles["icon"]} ${styles["icon-cart"]}`}
               onClick={() => {
                  dispatch(setSelectedCategory("Все товары"));
                  dispatch(setSearchQuery(""));
                  navigate("/");
               }}
            >
               <TfiHome size={24} />
               <span>Главная</span>
            </div>
         </div>

         {/* Кнопка "Кабинет" */}
         <div
            className={`${styles["icon"]} ${styles["icon-account"]}`}
            onClick={() => dispatch(toggleMenu())}
         >
            <FaRegUser size={24} />
            <span>Кабинет</span>
         </div>

         {/* Кнопка "Избранное" */}
         <div
            className={`${styles["icon"]} ${styles["icon-favorites"]}`}
            onClick={() => {
               if (!isRegistered) {
                  dispatch(togglePanel());
               } else {
                  dispatch(toggleFavorites()); // если вошёл — избранное
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
            <div className={styles["header__favorite-count"]}>
               {favoriteCount ? favoriteCount : ""}
            </div>
         </div>

         {/* Кнопка "Корзина" */}
         {/* <div className={`${styles["icon"]} ${styles["icon-cart"]}`}>
            <BsCartDash size={24} />
            <span>Корзина</span>
         </div> */}

         {/* категории */}
         <div
            className={`${styles["icon"]} ${styles["icon-cart"]}`}
            onClick={() => dispatch(toggleCategoryList())}
         >
            <BiCategory size={24} />
            <span>Категории</span>
         </div>

         {/* Затемняющий слой */}
         {/* <div
            className={`${styles.overlay} ${
               isCategoryListVisible || isFavoritesVisible || isOverlayVisible
                  ? styles.visible
                  : ""
            }`}
         ></div> */}
      </div>
   );
};

export default HeaderNavigationBlock;
