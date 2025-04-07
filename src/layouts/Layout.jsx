import { Outlet } from "react-router-dom";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import Menu from "../components/Menu/Menu";
import SidePanel from "../components/SidePanel/SidePanel";

import styles from "./Layout.module.css";

const Layout = () => {
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

         <div className={styles["footer-wrapper"]}>
            <Footer className={styles["footer"]} />
         </div>
      </div>
   );
};

export default Layout;
