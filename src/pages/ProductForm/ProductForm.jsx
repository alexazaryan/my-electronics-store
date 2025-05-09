import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { uploadImageToImgBB } from "../../utils/uploadImage";
import CustomButton from "../../components/CustomButton/CustomButton";
import CsvUpload from "../../components/CsvUpload/CsvUpload";
import AdminNewsEditor from "../../components/AdminNewsEditor/AdminNewsEditor";

import { collection, doc, getDoc, setDoc } from "firebase/firestore"; // ✅
import { db } from "../../utils/firebase"; // не забудь импорт

import styles from "./ProductForm.module.css";
import { useNavigate } from "react-router-dom";

const ProductForm = () => {
   const dispatch = useDispatch();
   const navigate = useNavigate();
   const fileInputRef = useRef(null);

   const newDocRef = doc(collection(db, "products")); // 🔧 создаём ссылку с новым ID
   const [productData, setProductData] = useState({
      category: "",
      name: "",
      description: "",
      sku: "",
      price: "",
      images: [],
   });

   const [success, setSuccess] = useState(false);
   const [error, setError] = useState(null);

   const [formErrors, setFormErrors] = useState({
      category: false,
      name: false,
      description: false,
      price: false,
      images: false,
      sku: false,
   });

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setProductData((prev) => ({
         ...prev,
         [name]: value.replace(/^\s+/, ""),
      }));
   };

   const handleMultiImageUpload = async (e) => {
      const files = Array.from(e.target.files);
      if (files.length < 2 || files.length > 15) {
         setError("Загрузите от 2 до 15 изображений.");
         return;
      }

      try {
         const urls = await Promise.all(files.map(uploadImageToImgBB));
         setProductData((prev) => ({
            ...prev,
            images: urls,
         }));
         setError(null);
      } catch (err) {
         console.error(err);
         setError("Ошибка при загрузке изображений");
      }
   };

   const handleSubmit = async (e) => {
      const errors = {
         category: !productData.category.trim(), // ошибка если пустая категория
         name: !productData.name.trim(), // ошибка если пустое имя
         description: !productData.description.trim(), // ошибка если пустое описание
         price: isNaN(productData.price) || productData.price <= 0, // ошибка если цена не число или <= 0
         images: productData.images.length < 2, // ошибка если меньше 2 изображений
         sku: !productData.sku.trim(), // ошибка если пустой sku
      };

      setFormErrors(errors);

      if (Object.values(errors).includes(true)) {
         setError("Пожалуйста, заполните все поля корректно.");
         return;
      }

      try {
         const docRef = doc(db, "products", productData.sku); // создаём ссылку с ID = sku
         const existing = await getDoc(docRef); // проверяем, существует ли товар

         if (existing.exists()) {
            setError("Товар с таким SKU уже существует.");
            return;
         }

         await setDoc(docRef, {
            //
            id: productData.sku, //удалить
            //

            ...productData, // все данные из формы
            price: Number(productData.price), // цена в числовом формате
            rating: null, // рейтинг по умолчанию
            purchase: null, // закупочная цена по умолчанию
            discount: 0, // скидка 0 по умолчанию
            markup: 0, // наценка 0 по умолчанию
            stock: true, // в наличии
            ordersCount: 0, // 0 заказов
            subcategory: "", // подкатегория пустая
            mainImage: productData.images[0], // главное изображение — первое
         });

         setSuccess(true);
         alert("Товар добавлен!");

         setProductData({
            category: "",
            name: "",
            description: "",
            price: "",
            images: [],
            sku: "",
         });

         if (fileInputRef.current) fileInputRef.current.value = ""; // сбрасываем input
      } catch (err) {
         console.error("Ошибка при добавлении товара:", err);
         setError("Ошибка при добавлении товара.");
      }
   };

   return (
      <>
         <h3 className={styles["product-form__title"]}>Admin room</h3>

         <div className={styles["product-form"]}>
            <form className={styles["form"]} onSubmit={handleSubmit}>
               <h4>
                  <u>Загрузка индивидуального товара</u>
               </h4>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Категория:</label>
                  <select
                     className={`${styles["form__input"]} ${
                        formErrors.category ? styles["form__input--error"] : ""
                     }`}
                     name="category"
                     value={productData.category}
                     onChange={handleInputChange}
                  >
                     <option value="">Выберите категорию</option>
                     <option value="Машины">Машины</option>
                     <option value="Аксессуары">Аксессуары</option>
                     <option value="Смартфоны">Смартфоны</option>
                     <option value="Ноутбуки">Ноутбуки</option>
                     <option value="Носки">Носки</option>
                  </select>
               </div>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Название товара:
                  </label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.name ? styles["form__input--error"] : ""
                     }`}
                     type="text"
                     name="name"
                     placeholder="Название товара"
                     value={productData.name}
                     onChange={handleInputChange}
                  />
               </div>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Описание:</label>
                  <textarea
                     className={`${styles["form__input"]} ${
                        formErrors.description
                           ? styles["form__input--error"]
                           : ""
                     }`}
                     name="description"
                     placeholder="Описание товара (не более 900 символов)"
                     value={productData.description}
                     onChange={handleInputChange}
                     maxLength={900}
                  />
               </div>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Код товара / Артикул:
                  </label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.sku ? styles["form__input--error"] : ""
                     }`}
                     type="text"
                     name="sku"
                     placeholder="Например: Арт. 1527-091"
                     value={productData.sku}
                     onChange={handleInputChange}
                  />
               </div>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>Цена:</label>
                  <input
                     className={`${styles["form__input"]} ${
                        formErrors.price ? styles["form__input--error"] : ""
                     }`}
                     type="number"
                     name="price"
                     placeholder="Цена"
                     value={productData.price}
                     onChange={handleInputChange}
                  />
               </div>

               <div className={styles["form__field"]}>
                  <label className={styles["form__label"]}>
                     Загрузите от 2 до 15 изображений:
                  </label>
                  <input
                     ref={fileInputRef}
                     className={`${styles["form__fileInput"]} ${
                        formErrors.images
                           ? styles["form__fileInput--error"]
                           : ""
                     }`}
                     type="file"
                     accept="image/*"
                     multiple
                     onChange={handleMultiImageUpload}
                  />
               </div>

               {productData.images.length > 0 && (
                  <div className={styles["form__image-preview-wrap"]}>
                     {productData.images.map((img, i) => (
                        <div key={i} className={styles["form__image-item"]}>
                           <img
                              src={img}
                              className={styles["form__image"]}
                              alt={`preview-${i}`}
                           />
                        </div>
                     ))}
                  </div>
               )}

               {error && <p className={styles["form__error"]}>{error}</p>}
               {success && (
                  <p className={styles["form__success"]}>
                     Товар успешно добавлен!
                  </p>
               )}

               <CustomButton
                  className={styles["form__add-product"]}
                  onClick={handleSubmit}
               >
                  Добавить товар
               </CustomButton>
            </form>

            <div className={styles["form__up-load-new"]}>
               <div className={styles["form__orders"]}>
                  <h4>
                     <u>Обработка заказов</u>
                  </h4>
                  <CustomButton
                     className={styles["form__go-to-orders"]}
                     onClick={() => navigate("/admin-orders")}
                  >
                     Перейти к обработке заказов
                  </CustomButton>
               </div>

               <div className={styles["form__up-load"]}>
                  <h4>
                     <u>Загрузка файлов типов .CSV</u>
                  </h4>
                  <div className={styles["form__up-load--component"]}>
                     <CsvUpload />
                  </div>
               </div>

               <div className={styles["form__new"]}>
                  <AdminNewsEditor />
               </div>
            </div>

            <div>
               <div className={styles["form__admin-products"]}>
                  <h4>
                     <u>
                        Управление карточеками - удаелние товара, редактор
                        отзывов установка акций и тд . . .
                     </u>
                  </h4>
                  <CustomButton
                     className={styles["form__go-to-editor"]}
                     onClick={() => navigate("/admin-products")}
                  >
                     Перейти
                  </CustomButton>
               </div>
               {/* Наценка товара */}
               <div className={styles["form__admin-products"]}>
                  <h4>
                     <u>Установка наценки на товары (markup %)</u>
                  </h4>
                  <CustomButton
                     className={styles["form__go-to-editor"]}
                     onClick={() => navigate("/admin-markup")}
                  >
                     Перейти к наценке
                  </CustomButton>
               </div>
            </div>
         </div>
      </>
   );
};

export default ProductForm;
