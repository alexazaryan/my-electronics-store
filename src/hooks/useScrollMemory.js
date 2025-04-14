// запоминаем растояние от верха
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollMemory = (key = "scroll") => {
   const location = useLocation();

   useEffect(() => {
      const pageKey = `${key}-${location.pathname}`;
      const savedY = parseInt(sessionStorage.getItem(pageKey) || "0", 10);

      // Сохраняем скролл при изменении позиции
      const handleScroll = () => {
         if (window.scrollY > 100) {
            sessionStorage.setItem(pageKey, window.scrollY.toString());
         }
      };

      // Сохраняем скролл при уходе со страницы
      const saveScrollBeforeUnload = () => {
         sessionStorage.setItem(pageKey, window.scrollY.toString());
      };

      // Восстанавливаем скролл
      const restoreScroll = () => {
         if (savedY > 0) {
            const checkContentLoaded = () => {
               // Проверяем, что контент загружен (страница достаточно высокая)
               if (document.body.scrollHeight > savedY) {
                  window.scrollTo({
                     top: savedY,
                     behavior: "auto",
                  });
               } else {
                  // Если контент еще не загружен, проверяем снова через 100мс
                  setTimeout(checkContentLoaded, 100);
               }
            };

            checkContentLoaded();
         }
      };

      // Подписываемся на события
      window.addEventListener("scroll", handleScroll, { passive: true });
      window.addEventListener("beforeunload", saveScrollBeforeUnload);

      // Восстанавливаем скролл после небольшой задержки
      const restoreTimer = setTimeout(restoreScroll, 50);

      return () => {
         // Отписываемся от событий при размонтировании
         window.removeEventListener("scroll", handleScroll);
         window.removeEventListener("beforeunload", saveScrollBeforeUnload);
         clearTimeout(restoreTimer);
      };
   }, [location.pathname, key]);
};

export default useScrollMemory;
