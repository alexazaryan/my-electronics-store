import { useLayoutEffect } from "react";

const useBodyOverflow = (isVisible) => {
   useLayoutEffect(() => {
      const scrollbarWidth =
         window.innerWidth - document.documentElement.clientWidth;

      if (isVisible) {
         document.body.style.overflow = "hidden"; // Блокируем прокрутку
         document.body.style.paddingRight = `${scrollbarWidth}px`; // Добавляем padding-right
         document.documentElement.style.setProperty(
            "--scrollbar-width",
            `${scrollbarWidth}px`
         ); // Устанавливаем CSS-переменную
      } else {
         document.body.style.overflow = "auto"; // Восстанавливаем прокрутку
         document.body.style.paddingRight = "0"; // Убираем padding-right
         document.documentElement.style.setProperty("--scrollbar-width", "0"); // Сбрасываем CSS-переменную
      }

      return () => {
         document.body.style.overflow = "auto"; // Очистка при размонтировании
         document.body.style.paddingRight = "0"; // Убираем padding-right
         document.documentElement.style.setProperty("--scrollbar-width", "0"); // Сбрасываем CSS-переменную
      };
   }, [isVisible]);
};

export default useBodyOverflow;
