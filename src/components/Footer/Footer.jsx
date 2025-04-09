import { PiTelegramLogoDuotone } from "react-icons/pi";
import { BsInstagram } from "react-icons/bs"; 
import { BsWhatsapp } from "react-icons/bs";

import styles from "./Footer.module.css";

const Footer = () => {
   return (
      <div className={styles["footer-wrap"]}>
         <div className={styles["footer"]}>
            <div className={styles["footer-content"]}>
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>О нас</h3>
                  <p className={styles["footer-text"]}>
                     Мы предлагаем лучшие товары по отличным ценам.
                     Подписывайтесь на нас в соцсетях!
                  </p>
               </div>
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>Контакты</h3>
                  <p className={styles["footer-text"]}>
                     Email: support@example.com
                  </p>
                  <p className={styles["footer-text"]}>
                     Телефон: +38 555 555 555
                  </p>
               </div>
               <div className={styles["footer-section"]}>
                  <h3 className={styles["footer-title"]}>Социальные сети</h3>
                  <div className={styles["footer-icons"]}>
                     <a
                        href="https://t.me/your_telegram_link"
                        target="_blank"
                        className={styles["footer-icon"]}
                     >
                        <PiTelegramLogoDuotone
                           className={styles["telegram-icon"]}
                        />
                     </a>
                     <a
                        href="https://www.instagram.com/your_instagram_link"
                        target="_blank"
                        className={styles["footer-icon"]}
                     >
                        <BsInstagram className={styles["instagram-icon"]} />
                     </a>
                     <a
                        href="https://wa.me/your_viber_link"
                        target="_blank"
                        className={styles["footer-icon"]}
                     >
                        <BsWhatsapp className={styles["whatsapp-icon"]} />
                     </a>
                  </div>
               </div>
            </div>
            <div className={styles["footer-bottom"]}>
               <p className={styles["footer-text"]}>
                  © 2025 Все права защищены.
               </p>
            </div>
         </div>
      </div>
   );
};

export default Footer;
