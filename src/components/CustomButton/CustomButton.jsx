import styles from "./CustomButton.module.css";
import classNames from "classnames"; // Импортируем classNames

export default function CustomButton({
   children,
   onClick,
   className = "", // Значение по умолчанию
   customStyle,
   overrideDefault = false,
}) {
   const defaultStyle = styles.defaultButton;
   const customClass = customStyle ? styles[customStyle] : null;
   const buttonClass = classNames(
      !overrideDefault && defaultStyle,
      customClass,
      className
   );

   return (
      <div className={buttonClass} onClick={onClick}>
         {children}
      </div>
   );
}
