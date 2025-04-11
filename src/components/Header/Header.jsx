import HeaderNavigationBlock from "./HeaderNavigationBlock";
import { useState } from "react";
import { Link } from "react-router-dom";
import { setSelectedCategory } from "../../store/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { setSearchQuery } from "../../store/searchSlice";


import styles from "./Header.module.css";

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
