// компонент футера со всеми контактами и соцсетями

import { PiTelegramLogoDuotone } from "react-icons/pi";
import { BsInstagram, BsWhatsapp } from "react-icons/bs";
import styles from "./Footer.module.css";

const Footer = () => {
   return (
      <div className={styles["footer-wrap"]}>
         <div className={styles["footer"]}>
            <div className={styles["footer-content"]}>
               {/* Блок "О нас" */}
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>О нас</h3>
                  <p className={styles["footer-text"]}>
                     TechZone – магазин электроники и аксессуаров. Доставляем по
                     всей Украине. Надёжно, быстро и с заботой.
                  </p>
               </div>

               {/* Блок контактов */}
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>Контакты</h3>
                  <p className={styles["footer-text"]}>
                     Email: info@techzone.com.ua
                  </p>
                  <p className={styles["footer-text"]}>
                     Телефон: +38 (098) 123 45 67 (Пн–Пт 9:00–18:00)
                  </p>
                  <p className={styles["footer-text"]}>
                     Адрес: г. Киев, ул. Электриков, 10
                  </p>
               </div>

               {/* Блок соцсетей */}
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>Мы в соцсетях</h3>
                  <div className={styles["footer-icons"]}>
                     <a
                        href="https://t.me/techzone_support"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["footer-icon"]}
                     >
                        <PiTelegramLogoDuotone />
                     </a>
                     <a
                        href="https://www.instagram.com/techzone_ua"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["footer-icon"]}
                     >
                        <BsInstagram />
                     </a>
                     <a
                        href="https://wa.me/380981234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles["footer-icon"]}
                     >
                        <BsWhatsapp />
                     </a>
                  </div>
               </div>
            </div>

            {/* Низ футера */}
            <div className={styles["footer-bottom"]}>
               <p className={styles["footer-text"]}>
                  © 2025 TechZone. Все права защищены.
               </p>
            </div>
         </div>
      </div>
   );
};

export default Footer;
