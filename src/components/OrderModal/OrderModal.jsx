import React, { useState, useEffect, useRef } from "react";
import CustomButton from "../CustomButton/CustomButton";
import styles from "./OrderModal.module.css";

const OrderModal = ({ isOpen, onClose, onSubmit, user }) => {
   const [isSubmitted, setIsSubmitted] = useState(false); // форма отправлена?
   const [name, setName] = useState(""); // имя
   const [phone, setPhone] = useState("+380"); // телефон сразу с +380
   const [email, setEmail] = useState(""); // почта
   const [city, setCity] = useState(""); // город
   const [deliveryMethod, setDeliveryMethod] = useState(""); // способ доставки
   const [comment, setComment] = useState(""); // комментарий
   const [errors, setErrors] = useState({}); // ошибки

   const modalRef = useRef(null); // ссылка на модалку

   // refs для автофокуса на ошибке
   const nameRef = useRef(null);
   const phoneRef = useRef(null);
   const emailRef = useRef(null);
   const cityRef = useRef(null);
   const deliveryMethodRef = useRef(null);

   // автозаполнение формы
   useEffect(() => {
      if (isOpen && user) {
         setIsSubmitted(false);
         setName(user.displayName || ""); // если есть имя
         setPhone(user.phoneNumber || "+380"); // если есть телефон
         setEmail(user.email || ""); // если есть email
      }
   }, [isOpen, user]);

   // при каждом новом открытии сбрасываем флаг отправки
   useEffect(() => {
      if (isOpen) {
         setIsSubmitted(false);
      }
   }, [isOpen]);

   // отправка формы
   const handleSubmit = async (e) => {
      e.preventDefault();

      const newErrors = {}; // новые ошибки
      if (!name.trim()) newErrors.name = "Имя обязательно";
      if (!phone.trim() || phone.length < 13)
         newErrors.phone = "Введите полный номер телефона";
      if (!email.trim()) newErrors.email = "Email обязателен";
      if (!city.trim()) newErrors.city = "Город обязателен";
      if (!deliveryMethod.trim())
         newErrors.deliveryMethod = "Выберите способ доставки";

      setErrors(newErrors); // записываем ошибки

      if (Object.keys(newErrors).length > 0) {
         if (newErrors.name) nameRef.current.focus();
         else if (newErrors.phone) phoneRef.current.focus();
         else if (newErrors.email) emailRef.current.focus();
         else if (newErrors.city) cityRef.current.focus();
         else if (newErrors.deliveryMethod) deliveryMethodRef.current.focus();
         return;
      }

      const success = await onSubmit({
         name,
         phone,
         email,
         city,
         deliveryMethod,
         paymentMethod: "Оплата при получении", // фиксированное значение
         comment,
      });

      if (success) {
         setIsSubmitted(true);
         setName("");
         setPhone("+380");
         setEmail("");
         setCity("");
         setDeliveryMethod("");
         setComment("");
         setErrors({});
      }
   };

   if (!isOpen) return null; // если модалка закрыта, ничего не рендерим

   return (
      <div className={styles.overlay} onClick={onClose}>
         {" "}
         {/* фон */}
         <div
            className={`${styles["order-modal"]} ${styles["visible"]}`}
            onClick={(e) => e.stopPropagation()} // остановить клик внутри
            ref={modalRef}
         >
            <CustomButton
               className={styles["favorite-list__custom-button-close"]}
               onClick={onClose}
            >
               ✖ закрыть
            </CustomButton>

            <div className={styles["order-modal__wrap"]}>
               {isSubmitted ? (
                  <div className={styles["success-message"]}>
                     <h3>Заказ отправлен!</h3>
                     <p>
                        Спасибо за ваш заказ. Мы свяжемся с вами в ближайшее
                        время.
                     </p>
                  </div>
               ) : (
                  <>
                     <h3>Оформление заказа</h3>
                     <form onSubmit={handleSubmit} className={styles.form}>
                        <input
                           ref={nameRef}
                           type="text"
                           placeholder="Ваше имя"
                           value={name}
                           onChange={(e) => setName(e.target.value)}
                           className={errors.name ? styles.error : ""}
                        />
                        {errors.name && (
                           <p className={styles["error-message"]}>
                              {errors.name}
                           </p>
                        )}

                        <input
                           ref={phoneRef}
                           type="tel"
                           placeholder="Телефон"
                           value={phone}
                           onChange={(e) => {
                              let value = e.target.value;
                              if (!value.startsWith("+380")) value = "+380";
                              const digits = value.replace(/\D/g, "").slice(3);
                              const limitedDigits = digits.slice(0, 9);
                              setPhone("+380" + limitedDigits);
                           }}
                           className={errors.phone ? styles.error : ""}
                        />
                        {errors.phone && (
                           <p className={styles["error-message"]}>
                              {errors.phone}
                           </p>
                        )}

                        <input
                           ref={emailRef}
                           type="email"
                           placeholder="Email"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           className={errors.email ? styles.error : ""}
                        />
                        {errors.email && (
                           <p className={styles["error-message"]}>
                              {errors.email}
                           </p>
                        )}

                        <input
                           ref={cityRef}
                           type="text"
                           placeholder="Город"
                           value={city}
                           onChange={(e) => setCity(e.target.value)}
                           className={errors.city ? styles.error : ""}
                        />
                        {errors.city && (
                           <p className={styles["error-message"]}>
                              {errors.city}
                           </p>
                        )}

                        <select
                           ref={deliveryMethodRef}
                           value={deliveryMethod}
                           onChange={(e) => setDeliveryMethod(e.target.value)}
                           className={errors.deliveryMethod ? styles.error : ""}
                        >
                           <option value="">Выберите способ доставки</option>
                           <option value="Курьер">Курьер</option>
                           <option value="Самовывоз">Самовывоз</option>
                           <option value="Почта">Почта</option>
                        </select>
                        {errors.deliveryMethod && (
                           <p className={styles["error-message"]}>
                              {errors.deliveryMethod}
                           </p>
                        )}

                        <textarea
                           className={styles.textarea}
                           placeholder="Оставить комментарий"
                           value={comment}
                           onChange={(e) => setComment(e.target.value)}
                           rows={4}
                           maxLength={50}
                        />

                        <div className={styles["order-modal__bottom"]}>
                           <button
                              className={styles["button-send-order"]}
                              type="submit"
                           >
                              Отправить заказ
                           </button>
                        </div>
                     </form>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default OrderModal;
