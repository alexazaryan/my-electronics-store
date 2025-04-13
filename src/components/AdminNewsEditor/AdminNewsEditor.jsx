import { useState } from "react";
import { db } from "../../utils/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

import styles from "./AdminNewsEditor.module.css"; // импорт CSS-модуля

const AdminNewsEditor = () => {
   const [title, setTitle] = useState("");
   const [content, setContent] = useState("");

   const handlePublish = async () => {
      if (!title || !content) return alert("Заполни все поля");

      try {
         await addDoc(collection(db, "news"), {
            title,
            content,
            createdAt: Timestamp.now(),
         });
         setTitle("");
         setContent("");
         alert("Новость опубликована");
      } catch (err) {
         console.error("Ошибка публикации:", err);
         alert("Ошибка при публикации");
      }
   };

   return (
      <div className={styles["editor-container"]}>
         <u className={styles["editor-title"]}>Создать новость</u>

         <input
            type="text"
            placeholder="Заголовок"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={styles["editor-input"]}
         />

         <textarea
            placeholder="Текст новости"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className={styles["editor-textarea"]}
         />

         <button onClick={handlePublish} className={styles["editor-button"]}>
            Опубликовать
         </button>
      </div>
   );
};

export default AdminNewsEditor;
