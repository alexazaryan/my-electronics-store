// Рисует звёзды по числу rating
const RatingStars = ({ rating }) => {
   const full = Math.floor(rating);
   const half = rating % 1 >= 0.5;
   const empty = 5 - full - (half ? 1 : 0);

   return (
      <div style={{ display: "flex", gap: "2px", color: "#f5b301" }}>
         {Array(full)
            .fill("★")
            .map((_, i) => (
               <span key={"f" + i}>★</span>
            ))}
         {half && <span>☆</span>}
         {Array(empty)
            .fill("☆")
            .map((_, i) => (
               <span key={"e" + i}>☆</span>
            ))}
      </div>
   );
};

export default RatingStars;
