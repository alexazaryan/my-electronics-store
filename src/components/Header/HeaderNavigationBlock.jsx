// HeaderNavigationBlock.jsx
import { BsCartDash } from "react-icons/bs";
import { FaRegHeart, FaRegUser } from "react-icons/fa";
import { BiSolidHeart } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { toggleFavorites, toggleMenu } from "../../store/menuSlice";
import { togglePanel } from "../../store/sidePanelSlice";

import styles from "./Header.module.css"; // общий CSS остаётся

const HeaderNavigationBlock = () => {
   const dispatch = useDispatch();
   const favoriteCount = useSelector((state) => state.favorite.items.length);
   const isRegistered = useSelector((state) => state.auth.user);

   return (
      <div className={styles["header__right"]}>
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
                  dispatch(togglePanel()); // если не вошёл — открыть панель
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
         <div className={`${styles["icon"]} ${styles["icon-cart"]}`}>
            <BsCartDash size={24} />
            <span>Корзина</span>
         </div>
      </div>
   );
};

export default HeaderNavigationBlock;
