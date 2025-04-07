import styles from "./Spinner.module.css";

const Spinner = () => {
   return (
      <div className={styles["spinner"]}>
         <div className={`${styles["circle"]} ${styles["little"]}`}></div>
         <div className={`${styles["circle"]} ${styles["small"]}`}></div>
         <div className={`${styles["circle"]} ${styles["medium"]}`}></div>
         <div className={`${styles["circle"]} ${styles["large"]}`}></div>
      </div>
   );
};

export default Spinner;
