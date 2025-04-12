import Papa from "papaparse"; // npm install papaparse
import { doc, setDoc } from "../../utils/firebase"; // путь к твоему firebase
import { db } from "../../utils/firebase";
import { useState } from "react";

const CsvUpload = () => {
   const [status, setStatus] = useState("");

   const handleFile = (e) => {
      const file = e.target.files[0];
      if (!file) return;

      Papa.parse(file, {
         header: true,
         skipEmptyLines: true,
         complete: async (results) => {
            const data = results.data;
            setStatus("Загрузка...");

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
         },
      });
   };

   return (
      <div>
         <input type="file" accept=".csv" onChange={handleFile} />
         <p>{status}</p>
      </div>
   );
};

export default CsvUpload;
