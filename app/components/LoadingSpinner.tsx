export const LoadingSpinner = () => {
   const getRandomItem = (array: string[]) => {
      const randomIndex = Math.floor(Math.random() * array.length);
      return array[randomIndex];
   }
   const phrases = ["A buscar as estrelas...", "Tirando foto de buraco negro...", "Guardando matéria escura..."]

   return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
         <span className="loading loading-spinner text-primary loading-lg"></span>
         <p className="text-primary/70 text-lg">{
            getRandomItem(phrases)
         }</p>
      </div>
   )
}