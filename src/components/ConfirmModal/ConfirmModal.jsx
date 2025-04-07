import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({ handleDelete, product, setIsModalOpen }) => {
   return (
      <div className={styles["confirm-modal"]}>
         <p>Вы уверены, что хотите удалить?</p>
         <div className={styles["confirm-modal__buttons-wrap"]}>
            <div
               className={styles["confirm-modal__button"]}
               onClick={() => {
                  handleDelete(product.id, product.imageUrl);
                  setIsModalOpen(false);
               }}
            >
               Да
            </div>
            <div
               className={styles["confirm-modal__button"]}
               onClick={() => setIsModalOpen(false)}
            >
               Нет
            </div>
         </div>
      </div>
   );
};

export default ConfirmModal;
