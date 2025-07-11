import HeaderNavigationBlock from "./HeaderNavigationBlock";
import { useState } from "react";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../store/searchSlice";

import styles from "./Header.module.css";
import SofyxLogo from "../SofyxLogo/SofyxLogo";

//dispatch
const Header = () => {
   const dispatch = useDispatch();

   // Используем forwardRef
   const [isOverlayVisible, setOverlayVisible] = useState(false);

   const searchQuery = useSelector((state) => state.search.query);

   const handleSearchButtonClick = () => {
      setOverlayVisible(false); // Скрываем затемнение
   };

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
            {/* логотип */}
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
                     <SofyxLogo />
                  </Link>
               </div>
            </div>

            {/* поисковик */}
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
                  <div
                     onClick={() => handleSearchButtonClick()}
                     className={styles["searchButton"]}
                  >
                     Найти
                  </div>
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
         </div>
      </div>
   );
};

export default Header;
