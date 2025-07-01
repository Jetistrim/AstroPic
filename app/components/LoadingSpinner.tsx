import { useEffect, useState } from "react";

export const LoadingSpinner = () => {
   const getRandomItem = (array: string[]) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex]
   }

   const [phrase, setPhrase] = useState("");

   useEffect(() => {
      setPhrase(getRandomItem(phrases));
   }, []);

   const phrases = ["Searching among the stars...", "Taking a picture of a black hole...", "Storing dark matter..."]

   return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
         <span className="loading loading-spinner text-primary loading-lg"></span>
         <p className="text-primary/70 text-lg">{phrase}</p>
      </div>
   )
}