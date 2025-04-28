import { forwardRef, useEffect, useState } from "react"; // добавили useEffect и useState
import { useDispatch, useSelector } from "react-redux"; // useSelector для получения заказов
import { toggleOrderHistory } from "../../store/menuSlice"; // для закрытия окна
import { fetchUserOrders } from "../../store/orderHistorySlice"; // для загрузки заказов

import styles from "./OrderHistory.module.css"; // твои стили
import CustomButton from "../CustomButton/CustomButton"; // твоя кнопка

const OrderHistory = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();
   const orders = useSelector((state) => state.orderHistory.orders); // получаем заказы
   const user = useSelector((state) => state.auth.user); // получаем пользователя
   const [expandedOrderId, setExpandedOrderId] = useState(null); // раскрытие заказа

   useEffect(() => {
      if (user) {
         dispatch(fetchUserOrders(user.uid)); // при открытии загружаем заказы
      }
   }, [user, dispatch]);

   const handleClose = () => {
      dispatch(toggleOrderHistory(false)); // закрытие окна
   };

   const toggleExpand = (orderId) => {
      setExpandedOrderId((prev) => (prev === orderId ? null : orderId)); // открыть/закрыть заказ
   };

   return (
      <div
         ref={ref}
         className={`${styles["order-history__section"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <div>
            <CustomButton
               className={styles["order-history__custom-button-close"]}
               onClick={handleClose}
            >
               ✖ закрыть
            </CustomButton>

            <div className={styles["order-history__wrap"]}>
               <h3>Мои заказы:</h3>

               {orders.length === 0 ? (
                  <p>Заказов нет ...</p>
               ) : (
                  <ul className={styles.orderList}>
                     {orders.map((order) => (
                        <li key={order.id} className={styles.orderItem}>
                           <div
                              className={styles.orderTopRow}
                              onClick={() => toggleExpand(order.id)}
                           >
                              <div className={styles.orderAmount}>
                                 Заказ на сумму{" "}
                                 {order.total?.toLocaleString("uk-UA")} ₴
                              </div>
                              <div className={styles.arrowIcon}>
                                 {expandedOrderId === order.id ? "▲" : "▼"}
                              </div>
                           </div>

                           {expandedOrderId === order.id && (
                              <ul className={styles.productList}>
                                 {order.products?.map((product, idx) => (
                                    <li
                                       key={idx}
                                       className={styles.productItem}
                                    >
                                       <img
                                          src={product.image}
                                          alt={product.name}
                                          className={styles.productImage}
                                       />
                                       <div>
                                          <div>
                                             {product.name.length > 50
                                                ? `${product.name.slice(
                                                     0,
                                                     50
                                                  )}...`
                                                : product.name}
                                          </div>
                                          <strong>
                                             {product.quantity} ×{" "}
                                             {product.price} ₴
                                          </strong>
                                       </div>
                                    </li>
                                 ))}
                              </ul>
                           )}
                        </li>
                     ))}
                  </ul>
               )}
            </div>
         </div>
      </div>
   );
});

export default OrderHistory;
