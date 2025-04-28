import React, { useEffect, useState } from "react";
import { db } from "../../utils/firebase";
import { deleteDoc } from "firebase/firestore";
import {
   collectionGroup,
   getDocs,
   query,
   orderBy,
   updateDoc,
} from "firebase/firestore";
import styles from "./UserOrdersList.module.css";
import ScrollToTopButton from "../ScrollToTopButton/ScrollToTopButton";

const UserOrdersList = () => {
   const [searchQuery, setSearchQuery] = useState(""); //для поиска товара по коду
   const [orders, setOrders] = useState([]);
   const [filterStatus, setFilterStatus] = useState("all");
   const [sortType, setSortType] = useState("date-desc");

   useEffect(() => {
      const fetchOrders = async () => {
         const q = query(
            collectionGroup(db, "orders"),
            orderBy("createdAt", "desc")
         );
         const snapshot = await getDocs(q);
         const result = [];

         for (const docSnap of snapshot.docs) {
            const orderData = {
               id: docSnap.id,
               path: docSnap.ref.path,
               ref: docSnap.ref,
               ...docSnap.data(),
            };

            if (!orderData.products || orderData.products.length === 0) {
               // Если заказ пустой — удаляем физически из базы
               await deleteDoc(docSnap.ref);
               console.log(`Удалён пустой заказ: ${orderData.id}`);
            } else {
               result.push(orderData);
            }
         }

         setOrders(result);
      };

      fetchOrders();
   }, []);

   const handleDelete = async (orderRef, index) => {
      if (window.confirm("Отметить заказ как удалённый?")) {
         await updateDoc(orderRef, { deletedByAdmin: true });
         setOrders((prev) => {
            const updated = [...prev];
            updated[index].deletedByAdmin = true;
            return updated;
         });
      }
   };

   const handleRestore = async (orderRef, index) => {
      if (window.confirm("Вернуть заказ?")) {
         await updateDoc(orderRef, { deletedByAdmin: false });
         setOrders((prev) => {
            const updated = [...prev];
            updated[index].deletedByAdmin = false;
            return updated;
         });
      }
   };

   // для заметок
   const handleNoteChange = async (orderRef, index, newNote) => {
      try {
         await updateDoc(orderRef, { note: newNote });

         setOrders((prev) => {
            const updated = [...prev];
            updated[index].note = newNote;
            return updated;
         });
      } catch (error) {
         console.error("Ошибка обновления заметки:", error);
      }
   };

   // удаление количества продукта
   const handleDecreaseProductQuantity = async (orderRef, productId) => {
      if (!window.confirm("Уменьшить количество на 1?")) return;

      try {
         const updatedOrder = orders.find((o) => o.ref.path === orderRef.path);
         if (!updatedOrder) return;

         const updatedProducts = updatedOrder.products
            .map((p) => {
               if (p.id === productId) {
                  return { ...p, quantity: (p.quantity || 1) - 1 };
               }
               return p;
            })
            .filter((p) => p.quantity > 0); // Убираем товар, если quantity стало 0

         if (updatedProducts.length === 0) {
            // ❌ Все товары исчезли — удаляем заказ
            await deleteDoc(orderRef);
            setOrders((prev) =>
               prev.filter((o) => o.ref.path !== orderRef.path)
            );
            alert("Все товары удалены, заказ удалён полностью");
            return;
         }

         const newTotal = updatedProducts.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
         );

         await updateDoc(orderRef, {
            products: updatedProducts,
            total: newTotal,
         });

         setOrders((prev) =>
            prev.map((o) =>
               o.ref.path === orderRef.path
                  ? { ...o, products: updatedProducts, total: newTotal }
                  : o
            )
         );
      } catch (error) {
         console.error("Ошибка уменьшения количества товара:", error);
      }
   };

   // добавление колличества товара
   const handleIncreaseProductQuantity = async (orderRef, productId) => {
      if (!window.confirm("Добавить ещё 1 единицу этого товара?")) return;

      try {
         const updatedOrder = orders.find((o) => o.ref.path === orderRef.path);
         if (!updatedOrder) return;

         const updatedProducts = updatedOrder.products.map((p) => {
            if (p.id === productId) {
               return { ...p, quantity: (p.quantity || 1) + 1 };
            }
            return p;
         });

         const newTotal = updatedProducts.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
         );

         await updateDoc(orderRef, {
            products: updatedProducts,
            total: newTotal,
         });

         setOrders((prev) =>
            prev.map((o) =>
               o.ref.path === orderRef.path
                  ? { ...o, products: updatedProducts, total: newTotal }
                  : o
            )
         );
      } catch (error) {
         console.error("Ошибка увеличения количества товара:", error);
      }
   };

   // удаление полность продукта
   const handleDeleteProduct = async (orderRef, productId) => {
      if (!window.confirm("Удалить этот товар из заказа?")) return;

      try {
         const updatedOrder = orders.find((o) => o.ref.path === orderRef.path);
         if (!updatedOrder) return;

         const updatedProducts = updatedOrder.products.filter(
            (p) => p.id !== productId
         );

         if (updatedProducts.length === 0) {
            // ❌ Если товаров не осталось — удаляем весь заказ
            await deleteDoc(orderRef);
            setOrders((prev) =>
               prev.filter((o) => o.ref.path !== orderRef.path)
            );
            alert("Все товары удалены, заказ удалён полностью");
            return;
         }

         // ✅ Если товары остались — пересчитываем сумму
         const newTotal = updatedProducts.reduce(
            (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
            0
         );

         // Обновляем заказ в Firestore
         await updateDoc(orderRef, {
            products: updatedProducts,
            total: newTotal,
         });

         // Обновляем локальный стейт
         setOrders((prev) =>
            prev.map((o) =>
               o.ref.path === orderRef.path
                  ? { ...o, products: updatedProducts, total: newTotal }
                  : o
            )
         );
      } catch (error) {
         console.error("Ошибка удаления товара:", error);
      }
   };

   const handleMarkProcessed = async (orderRef, index) => {
      if (window.confirm("Подтвердить обработку заказа?")) {
         await updateDoc(orderRef, { processed: true });
         setOrders((prev) => {
            const updated = [...prev];
            updated[index].processed = true;
            return updated;
         });
      }
   };

   // сортировка товара по выбору
   const filteredOrders = orders
      .filter((order) => {
         // по карточкам поиск
         const matchesCode =
            order.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.code
               ?.replace(/^ord-/, "")
               .includes(searchQuery.toUpperCase());

         if (searchQuery && !matchesCode) return false;

         if (filterStatus === "all") return true;
         if (filterStatus === "processed")
            return order.processed && !order.deletedByAdmin;
         if (filterStatus === "unprocessed")
            return !order.processed && !order.deletedByAdmin;
         if (filterStatus === "deleted") return order.deletedByAdmin;
         return true;
      })
      .sort((a, b) => {
         if (sortType === "date-desc")
            return b.createdAt?.seconds - a.createdAt?.seconds;
         if (sortType === "date-asc")
            return a.createdAt?.seconds - b.createdAt?.seconds;
         if (sortType === "total-desc") return (b.total || 0) - (a.total || 0);
         if (sortType === "total-asc") return (a.total || 0) - (b.total || 0);
         return 0;
      });

   // длина товаров обработанных и тд
   const totalOrders = orders.length;
   const newOrders = orders.filter(
      (o) => !o.processed && !o.deletedByAdmin
   ).length;
   const processedOrders = orders.filter(
      (o) => o.processed && !o.deletedByAdmin
   ).length;
   const deletedOrders = orders.filter((o) => o.deletedByAdmin).length;

   return (
      <div className={styles.blok__oder}>
         <h2>Все заказы</h2>

         {/* заглавие функционал  */}
         <div className={styles.fixedFilters}>
            <div className={styles.filtersContainer}>
               <select
                  className={styles.selectControl}
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
               >
                  <option value="all">Все заказы</option>
                  <option value="processed">Обработанные</option>
                  <option value="unprocessed">Необработанные</option>
                  <option value="deleted">Удалённые</option>
               </select>

               <select
                  className={styles.selectControl}
                  value={sortType}
                  onChange={(e) => setSortType(e.target.value)}
               >
                  <option value="date-desc">Дата: от новых к старым</option>
                  <option value="date-asc">Дата: от старых к новым</option>
                  <option value="total-desc">
                     Сумма: от большой к маленькой
                  </option>
                  <option value="total-asc">
                     Сумма: от маленькой к большой
                  </option>
               </select>
            </div>

            {/* Поиск по коду заказа */}
            <input
               type="text"
               placeholder="Поиск по коду заказа..."
               className={styles.searchInput}
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
            />

            <div className={styles.counterRow}>
               <span>Всего: {totalOrders}</span>
               <span>Необработанные: {newOrders}</span>
               <span>Обработанных: {processedOrders}</span>
               <span>Удалённых: {deletedOrders}</span>
            </div>
         </div>

         {/* заказы пользователя */}
         {filteredOrders.map((order, i) => (
            <div className={styles.orderItem} key={order.id}>
               <div className={styles.buttonGroup}>
                  <button
                     className={
                        order.processed
                           ? `${styles.checkButton} ${styles.checkButtonProcessed}`
                           : styles.checkButton
                     }
                     onClick={() => handleMarkProcessed(order.ref, i)}
                     disabled={order.processed}
                  >
                     ✅{" "}
                     {order.processed
                        ? "Обработано"
                        : "Отметить как обработано"}
                  </button>

                  {order.deletedByAdmin ? (
                     <button
                        className={styles.restoreButton}
                        onClick={() => handleRestore(order.ref, i)}
                     >
                        ♻️ Вернуть заказ
                     </button>
                  ) : (
                     <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(order.ref, i)}
                     >
                        🗑 Удалить
                     </button>
                  )}
               </div>

               <p>
                  <strong>Заказ №{i + 1}</strong>
               </p>
               <span className={styles.orderCode}>
                  <strong>код заказа: </strong>
                  {order.code || "Нет кода"}
               </span>
               <p>
                  <strong>Имя:</strong> {order.name}
               </p>
               <p>
                  <strong>Телефон:</strong> {order.phone}
               </p>
               <p>
                  <strong>Email: </strong>
                  {order.email}
               </p>

               <p>
                  <strong>Город:</strong> {order.city || "—"}
               </p>

               <p>
                  <strong>Способ доставки:</strong>{" "}
                  {order.deliveryMethod || "—"}
               </p>
               <p>
                  <strong>Комментарий:</strong> {order.comment || "—"}
               </p>

               <p>
                  <strong>Дата: </strong>
                  {order.createdAt?.toDate().toLocaleString() || "—"}
               </p>

               <ul className={styles.productList}>
                  {order.products?.map((item, idx) => (
                     <li key={idx} className={styles.productItem}>
                        <a
                           href={`#/product/${item.id}`}
                           target="_blank"
                           rel="noopener noreferrer"
                           className={styles.productLink}
                        >
                           {item.image && (
                              <img
                                 src={item.image}
                                 alt={item.name}
                                 width={50}
                                 height={50}
                                 className={styles.productImage}
                              />
                           )}
                           <div>
                              <strong>{item.name}</strong>
                              <br />
                              Кол-во: {item.quantity} × {item.price} ₴ ={" "}
                              {(item.quantity * item.price).toLocaleString(
                                 "uk-UA"
                              )}
                              ₴
                           </div>
                        </a>

                        {/* Блок кнопок управления товаром */}
                        <div className={styles.productControls}>
                           <button
                              className={styles.decreaseButton}
                              onClick={() =>
                                 handleDecreaseProductQuantity(
                                    order.ref,
                                    item.id
                                 )
                              }
                           >
                              ➖ Убрать 1 шт
                           </button>

                           <button
                              className={styles.increaseButton}
                              onClick={() =>
                                 handleIncreaseProductQuantity(
                                    order.ref,
                                    item.id
                                 )
                              }
                           >
                              ➕ Добавить 1 шт
                           </button>

                           <button
                              className={styles.deleteProductButton}
                              onClick={() =>
                                 handleDeleteProduct(order.ref, item.id)
                              }
                           >
                              ❌ Удалить полность
                           </button>
                        </div>
                     </li>
                  ))}
               </ul>

               <div className={styles.noteContainer}>
                  <p className={styles.noteLabel}>Заметка:</p>
                  <input
                     type="text"
                     maxLength="60"
                     placeholder="Не более 59 символов"
                     value={order.note || ""}
                     onChange={(e) =>
                        handleNoteChange(order.ref, i, e.target.value)
                     }
                     className={styles.noteInput}
                  />
               </div>

               <p className={styles.total}>
                  <strong>💰 Итого к оплате:</strong>{" "}
                  {order.total?.toLocaleString("uk-UA")} ₴
               </p>
            </div>
         ))}

         <ScrollToTopButton />
      </div>
   );
};

export default UserOrdersList;
