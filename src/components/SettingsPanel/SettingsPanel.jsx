import { forwardRef } from "react";
import { useDispatch } from "react-redux";
import { toggleSettingsPanel } from "../../store/menuSlice";
import CustomButton from "../CustomButton/CustomButton";

import styles from "./SettingsPanel.module.css";

const SettingsPanel = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();

   const handleClose = () => {
      dispatch(toggleSettingsPanel(false)); // Закрываем через Redux
   };

   return (
      <div
         ref={ref}
         className={`${styles["settings-panel__section"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <CustomButton
            className={styles["settings-panel__custom-button-close"]}
            onClick={handleClose}
         >
            ✖ закрыть
         </CustomButton>
         <div className={styles["settings-panel__wrap"]}>
            <h3>Функция появится позже</h3>
         </div>
      </div>
   );
});

export default SettingsPanel;
