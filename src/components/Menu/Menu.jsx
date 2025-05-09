import { useEffect, useRef } from "react";
import useBodyOverflow from "../../hooks/useBodyOverflow";
import CustomButton from "../CustomButton/CustomButton";
import { useNavigate } from "react-router-dom";
import MenuRegistration from "../MenuRegistration/MenuRegistration";
import NewsSection from "../NewsSection/NewsSection";
import { useSelector, useDispatch } from "react-redux";
import CategoryList from "../CategoryList/CategoryList";
import { PiTelegramLogoDuotone } from "react-icons/pi";
import { LuNewspaper } from "react-icons/lu";
import { BiCategory } from "react-icons/bi";
import OrderHistory from "../OrderHistory/OrderHistory";
import SettingsPanel from "../SettingsPanel/SettingsPanel";
import FavoriteList from "../FavoriteList/FavoriteList";

import { FaRegHeart } from "react-icons/fa";

import {
   closeMenu,
   toggleRegistration,
   toggleNewsSection,
   toggleCategoryList,
   toggleSettingsPanel,
   toggleOrderHistory,
   toggleFavorites,
} from "../../store/menuSlice";

import {
   BsGlobe2,
   BsTencentQq,
   BsHeart,
   BsShop,
   BsBoxSeam,
   BsGear,
} from "react-icons/bs";

import styles from "./Menu.module.css";
import { markAllNewsAsViewed } from "../../store/newsSlice";

const Menu = () => {
   const favoriteCount = useSelector((state) => state.favorite.items.length); //избранное
   const newNewsCount = useSelector((state) => state.news.newNewsCount); //колличество новостей
   const user = useSelector((state) => state.auth.user);
   const isAdmin = useSelector((state) => state.auth.isAdmin);

   const {
      isMenuVisible,
      isRegistrationVisible,
      isNewsSectionVisible,
      isCategoryListVisible,
      isSettingsVisible,
      isOrderHistoryVisible,
      isFavoritesVisible,
   } = useSelector((state) => state.menu);

   const dispatch = useDispatch();
   const navigate = useNavigate();

   const favoritesRef = useRef(null);
   const menuRef = useRef(null);
   const registrationRef = useRef(null);
   const categoryListRef = useRef(null);
   const newsSectionRef = useRef(null);
   const settingsPanelRef = useRef(null);
   const orderHistoryRef = useRef(null);

   useBodyOverflow(isMenuVisible);

   const handleClickOutside = (event) => {
      // Проверка, был ли клик внутри любого из открытых элементов
      if (
         menuRef.current?.contains(event.target) ||
         registrationRef.current?.contains(event.target) ||
         categoryListRef.current?.contains(event.target) ||
         newsSectionRef.current?.contains(event.target) ||
         settingsPanelRef.current?.contains(event.target) ||
         orderHistoryRef.current?.contains(event.target) ||
         favoritesRef.current?.contains(event.target)
      ) {
         return; // Если клик внутри, ничего не делаем
      }

      // Закрываем **только последнее открытое окно**
      // Этот подход работает, но может быть неочевидным для других разработчиков.
      // Если вы хотите, чтобы закрывались все окна одновременно, нужно изменить логику.
      if (isFavoritesVisible) {
         dispatch(toggleFavorites(false));
      } else if (isOrderHistoryVisible) {
         dispatch(toggleOrderHistory(false));
      } else if (isSettingsVisible) {
         dispatch(toggleSettingsPanel(false));
      } else if (isCategoryListVisible) {
         dispatch(toggleCategoryList(false));
      } else if (isNewsSectionVisible) {
         dispatch(toggleNewsSection(false));
      } else if (isRegistrationVisible) {
         dispatch(toggleRegistration(false));
      } else if (isMenuVisible) {
         dispatch(closeMenu());
      }
   };

   useEffect(() => {
      // Добавляем обработчик клика вне элементов
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         // Убираем обработчик при размонтировании компонента
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [
      isMenuVisible,
      isRegistrationVisible,
      isNewsSectionVisible,
      isCategoryListVisible,
      isSettingsVisible,
      isOrderHistoryVisible,
      isFavoritesVisible,
   ]);

   const openTelegram = () => {
      window.open("https://t.me/Student_JS", "_blank");
   };

   return (
      <div className={styles["menu__wrap"]}>
         <div
            ref={menuRef}
            className={`${styles["menu"]} ${
               isMenuVisible ? styles["visible"] : ""
            }`}
         >
            <CustomButton
               className={styles["menu__custom-button-close"]}
               accordion
               onClick={() => dispatch(closeMenu())}
            >
               ✖ закрыть
            </CustomButton>
            <div className={styles["menu__collection"]}>
               {user ? (
                  <p>Привет, {user.name || "как ты"}! 🎉🎉🎉</p>
               ) : (
                  <p>Вы не авторизированы</p>
               )}
               <CustomButton
                  className={styles.customButtonMenu}
                  onClick={() => dispatch(toggleRegistration())}
               >
                  {user ? "Личные данные" : "Войти или зарегистрироваться"}
               </CustomButton>

               {/* выбор языка */}
               <div className={styles["menu-language"]}>
                  <BsGlobe2 className={styles["globe-icon"]} />
                  <div>
                     <p className={styles["language-text"]}>Русский</p>
                  </div>
               </div>

               {/* Панель администратора */}
               {isAdmin && (
                  <div
                     className={styles["admin-panel"]}
                     onClick={() => {
                        navigate("/product-form");
                        dispatch(closeMenu());
                     }}
                  >
                     <BsTencentQq className={styles["admin-icon"]} />
                     <div>
                        <p className={styles["admin-text"]}>
                           Панель администратора
                        </p>
                     </div>
                  </div>
               )}

               {/* категории */}
               <div
                  className={styles["category-panel"]}
                  onClick={() => dispatch(toggleCategoryList())}
               >
                  <BiCategory className={styles["category-icon"]} />
                  <div>
                     <p className={styles["category-text"]}>Категории</p>
                  </div>
               </div>

               {/* Теллеграм */}
               <div className={styles["telegram-panel"]} onClick={openTelegram}>
                  <PiTelegramLogoDuotone className={styles["telegram-icon"]} />
                  <div>
                     <p className={styles["telegram-text"]}>Telegram</p>
                  </div>
               </div>

               {/* избранное */}
               <div
                  className={styles["favorites-panel"]}
                  onClick={() => dispatch(toggleFavorites())}
               >
                  <FaRegHeart className={styles["favorites-icon"]} />
                  <div className={styles["favorites-panel__box"]}>
                     <p className={styles["favorites-text"]}>избранное</p>
                     {favoriteCount > 0 && (
                        <span className={styles["favorites-count"]}>
                           {favoriteCount}
                        </span>
                     )}
                  </div>
               </div>

               {/* Создать свой магазин */}
               <div className={styles["shop-panel"]}>
                  <BsShop className={styles["shop-icon"]} />
                  <div>
                     <p className={styles["shop-text"]}>Создать свой магазин</p>
                  </div>
                  <p className={styles["shop-soon"]}>soon</p>
               </div>

               {/* Мои заказы */}
               <div
                  className={styles["orders-panel"]}
                  onClick={() => dispatch(toggleOrderHistory())}
               >
                  <BsBoxSeam className={styles["orders-icon"]} />
                  <div>
                     <p className={styles["orders-text"]}>Мои заказы</p>
                  </div>
               </div>

               {/* настройки */}
               <div
                  className={styles["settings-panel"]}
                  onClick={() => dispatch(toggleSettingsPanel())}
               >
                  <BsGear className={styles["settings-icon"]} />
                  <div>
                     <p className={styles["settings-text"]}>Настройки</p>
                  </div>
               </div>

               {/* новости */}
               <div
                  className={styles["news-panel"]}
                  onClick={() => {
                     dispatch(toggleNewsSection()); // открыть/закрыть новости
                     dispatch(markAllNewsAsViewed()); // пометить как прочитанные
                  }}
               >
                  <LuNewspaper className={styles["news-icon"]} />
                  <div className={styles["news-text-wrapper"]}>
                     <p className={styles["news-text"]}>Новости</p>

                     {newNewsCount > 0 && (
                        <span className={styles["news-count"]}>
                           {newNewsCount}
                        </span>
                     )}
                  </div>
               </div>
            </div>
         </div>

         {/* регистрация */}
         <MenuRegistration
            isVisible={isRegistrationVisible}
            ref={registrationRef}
         />

         {/* избранное */}
         <FavoriteList isVisible={isFavoritesVisible} ref={favoritesRef} />

         {/* категории */}
         <CategoryList
            isVisible={isCategoryListVisible}
            ref={categoryListRef}
         />

         {/* новости */}
         <NewsSection isVisible={isNewsSectionVisible} ref={newsSectionRef} />

         {/* история заказов */}
         <OrderHistory
            isVisible={isOrderHistoryVisible}
            ref={orderHistoryRef}
         />

         {/* начтройки */}
         <SettingsPanel isVisible={isSettingsVisible} ref={settingsPanelRef} />

         {/* Оверлей */}
         <div
            className={`${styles["overlay"]} ${
               isMenuVisible ||
               isRegistrationVisible ||
               isNewsSectionVisible ||
               isSettingsVisible ||
               isOrderHistoryVisible
                  ? styles["active"]
                  : ""
            }`}
         />
      </div>
   );
};

export default Menu;
