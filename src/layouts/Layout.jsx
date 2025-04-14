import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Menu from "../components/Menu/Menu";
import SidePanel from "../components/SidePanel/SidePanel";
import HeaderNavigationBlock from "../components/Header/HeaderNavigationBlock";
import StickyTopBanner from "../components/StickyTopBanner/StickyTopBanner";

import styles from "./Layout.module.css";
// import ProductCircleSlider from "../components/ProductCircleSlider/ProductCircleSlider";

const Layout = () => {
   const [isSticky, setIsSticky] = useState(false); // фиксировать header

   const [showBottomNav, setShowBottomNav] = useState(true); // показать/скрыть нижнюю навигацию
   const bannerRef = useRef(null);
   const lastScrollY = useRef(0);

   useEffect(() => {
      const handleScroll = () => {
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

         {/* <ProductCircleSlider /> */}

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
            <div className={styles["stickyBottomMobile"]}>
               <HeaderNavigationBlock />
            </div>
         )}

         <div className={styles["footer-wrapper"]}>
            <Footer />
         </div>
      </div>
   );
};

export default Layout;
