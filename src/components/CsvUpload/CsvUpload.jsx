import Papa from "papaparse";
import { doc, setDoc } from "../../utils/firebase";
import { db } from "../../utils/firebase";
import { useState } from "react";
import styles from "./CsvUpload.module.css"; // импорт стилей

const CsvUpload = () => {
   const [file, setFile] = useState(null);
   const [status, setStatus] = useState("");

   const handleFileChange = (e) => {
      const selected = e.target.files[0];
      setFile(selected);
      setStatus("");
   };

   const handleConfirm = () => {
      if (!file) return;
      setStatus("Загрузка...");

      Papa.parse(file, {
         header: true,
         skipEmptyLines: true,
         complete: async (results) => {
            const data = results.data;

            for (const item of data) {
               try {
                  await setDoc(doc(db, "products", item["Артикул"]), {
                     name: item["Название товара"],
                     sku: item["Артикул"],
                     price: Number(item["Рекомендовання розничная цена"]),
                     purchase: Number(item["Дроп цена для партнера"]),
                     stock: item["Наличие"] === "instock",
                     images: item["Изображения"]
                        ? item["Изображения"].split(",")
                        : [],
                     mainImage: item["Изображения"]?.split(",")[0] || "",
                     description: item["Описание товара"],
                     category: item["Категории товара"],
                     subcategory: item["Подкатегории"],
                  });
               } catch (err) {
                  console.error("Ошибка загрузки:", item, err);
               }
            }

            setStatus("✅ Загрузка завершена");
            setFile(null);
         },
      });
   };

   const handleCancel = () => {
      setFile(null);
      setStatus("❌ Загрузка отменена");
   };

   return (
      <div className={styles.container}>
         <input type="file" accept=".csv" onChange={handleFileChange} />

         {file && (
            <div style={{ margin: "16px" }}>
               <p>
                  Выбран файл: <strong>{file.name}</strong>
               </p>
               <button className={styles.button} onClick={handleConfirm}>
                  ✅ Подтвердить
               </button>
               <button className={styles.cancelButton} onClick={handleCancel}>
                  ❌ Отменить
               </button>
            </div>
         )}

         <p style={{ marginTop: "12px" }}>{status}</p>
      </div>
   );
};

export default CsvUpload;
