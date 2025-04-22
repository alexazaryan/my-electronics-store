import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Menu from "../components/Menu/Menu";
import SidePanel from "../components/SidePanel/SidePanel";
import HeaderNavigationBlock from "../components/Header/HeaderNavigationBlock";
import StickyTopBanner from "../components/StickyTopBanner/StickyTopBanner";
import StickyBuyButton from "../components/StickyBuyButton/StickyBuyButton";
import { useSelector } from "react-redux";

import { useLocation } from "react-router-dom";

import styles from "./Layout.module.css";

const Layout = () => {
   const isFavoritesVisible = useSelector(
      (state) => state.menu.isFavoritesVisible
   );
   const isCategoryListVisible = useSelector(
      (state) => state.menu.isCategoryListVisible
   );
   const isOverlayVisible = useSelector(
      (state) => state.sidePanel.isOverlayVisible
   );

   const [isSticky, setIsSticky] = useState(false); // фиксировать header
   const [showBottomNav, setShowBottomNav] = useState(true); // показать/скрыть нижнюю навигацию
   const [isBelowThreshold, setIsBelowThreshold] = useState(true); // < 1000px
   const bannerRef = useRef(null);
   const lastScrollY = useRef(0);
   const location = useLocation(); // перход пользователя на детали продукта]
   const [animating, setAnimating] = useState(false);

   const [activeBottomKey, setActiveBottomKey] = useState(
      location.pathname.includes("/product/") && isBelowThreshold
         ? "buy"
         : "nav"
   );

   // следим за сменой пути и скролла, обновляем активный блок
   useEffect(() => {
      const key =
         location.pathname.includes("/product/") && isBelowThreshold
            ? "buy"
            : "nav";

      if (key !== activeBottomKey) {
         setAnimating(true); // начинаем анимацию
         setTimeout(() => {
            setActiveBottomKey(key); // меняем компонент после выхода старого
            setAnimating(false);
         }, 300); // столько же, сколько transition
      }
   }, [location.pathname, isBelowThreshold]);

   useEffect(() => {
      const handleScroll = () => {
         setIsBelowThreshold(window.scrollY <= 1000); //блок купить
         const currentY = window.scrollY;
         const bannerBottom = bannerRef.current?.getBoundingClientRect().bottom;

         // фиксируем header при скролле вниз
         if (currentY > lastScrollY.current && bannerBottom <= 0) {
            setIsSticky(true);
         }

         // убираем фиксацию при скролле вверх
         if (currentY < lastScrollY.current && bannerBottom > 0) {
            setIsSticky(false);
         }

         // скрываем нижнюю навигацию, если дошли до самого низа страницы
         const scrollPosition = window.scrollY + window.innerHeight;
         const pageHeight = document.documentElement.scrollHeight;

         if (scrollPosition >= pageHeight) {
            setShowBottomNav(false);
         } else {
            setShowBottomNav(true);
         }

         lastScrollY.current = currentY;
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className={styles.container}>
         <div ref={bannerRef}>
            <StickyTopBanner />
         </div>

         <div
            className={`${styles["header-wrapper"]} ${
               isSticky ? styles.stickyHeader : ""
            }`}
         >
            <Header />
         </div>

         <Menu />
         <SidePanel />

         <main
            className={`${styles["main-content"]} ${
               isSticky ? styles["withSticky"] : ""
            }`}
         >
            <Outlet />
         </main>

         {showBottomNav && (
            <div
               className={`${styles["stickyBottomMobile"]} ${
                  animating
                     ? styles.stickySlideExitActive
                     : styles.stickySlideEnterActive
               }`}
            >
               <div className={styles.stickyBottomContent}>
                  {activeBottomKey === "buy" ? (
                     <StickyBuyButton />
                  ) : (
                     <HeaderNavigationBlock />
                  )}
               </div>
            </div>
         )}

         <div className={styles["footer-wrapper"]}>
            <Footer />
         </div>

         {/* затемнение екрана */}
         <div
            className={`${styles.overlay} ${
               isFavoritesVisible || isCategoryListVisible || isOverlayVisible
                  ? styles.overlayVisible
                  : ""
            }`}
         />
      </div>
   );
};

export default Layout;
