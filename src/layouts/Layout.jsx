import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Menu from "../components/Menu/Menu";
import SidePanel from "../components/SidePanel/SidePanel";
import HeaderNavigationBlock from "../components/Header/HeaderNavigationBlock";
import { useEffect, useState } from "react";

import styles from "./Layout.module.css";

const Layout = () => {
   const [showSticky, setShowSticky] = useState(true); // Показываем по умолчанию

   useEffect(() => {
      const handleScroll = () => {
         const scrollPosition = window.scrollY + window.innerHeight;
         const pageHeight = document.documentElement.scrollHeight;

         // Если осталось ≤10px до низа — скрыть
         if (pageHeight - scrollPosition <= 20) {
            setShowSticky(false);
         } else {
            setShowSticky(true);
         }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   return (
      <div className={styles["container"]}>
         <div className={styles["header-wrapper"]}>
            <Header />
         </div>

         <Menu />
         <SidePanel />
         <main className={styles["main-content"]}>
            <Outlet />
         </main>

         {showSticky && (
            <div className={styles["stickyBottomMobile"]}>
               <HeaderNavigationBlock />
            </div>
         )}

         <div className={styles["footer-wrapper"]}>
            <Footer className={styles["footer"]} />
         </div>
      </div>
   );
};

export default Layout;
