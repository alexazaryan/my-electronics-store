import { forwardRef } from "react";
import CustomButton from "../CustomButton/CustomButton";
import AuthForm from "../../pages/AuthForm/AuthForm";
import { useDispatch } from "react-redux";
import { toggleRegistration } from "../../store/menuSlice";
import { IoMdClose } from "react-icons/io";

import styles from "./MenuRegistration.module.css";

const MenuRegistration = forwardRef(({ isVisible }, ref) => {
   const dispatch = useDispatch();

   const handleClose = () => {
      dispatch(toggleRegistration(false)); // Закрываем через Redux
   };

   return (
      <div
         ref={ref}
         className={`${styles["menu-registration"]} ${
            isVisible ? styles["visible"] : ""
         }`}
      >
         <CustomButton
            onClick={handleClose}
            className={styles["menu-registration__btn"]}
         >
            <IoMdClose color="white" size={30} />
            <span>Закрыть</span>
         </CustomButton>

         <div>
            {/* форма регистрации */}
            <AuthForm />
         </div>
      </div>
   );
});

export default MenuRegistration;
