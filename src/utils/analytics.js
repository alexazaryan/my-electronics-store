// src/utils/analytics.js

export const initGA = () => {
   // создаём dataLayer, если ещё нет
   window.dataLayer = window.dataLayer || [];
   function gtag() {
      window.dataLayer.push(arguments);
   }
   gtag("js", new Date());

   // твой GA4 ID
   gtag("config", "G-SF6G1PRZ48");
};
