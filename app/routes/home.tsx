import type { Route } from "./+types/home";
// import { Button } from "~/components/ui/button";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { APODCard } from "~/components/APODCards";
import { ErrorMessage } from "~/components/ErrorMessage";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import type { APODData } from "../lib/apod.types";

// --- I still need search what this function do ---

export function meta({}: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

// Função auxiliar para formatar a data para o formato YYYY-MM-DD
const getFormattedDate = (date: Date): string => {
   return date.toISOString().split("T")[0];
};

export default function Home() {
   const { date: dateParam } = useParams<{ date?: string }>();
   const navigate = useNavigate();
   const [apodData, setApodData] = useState<APODData | null>(null);
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [latestDate, setLatestDate] = useState<string | null>(null);

   useEffect(() => {
      const fetchAPOD = async (targetDate?: string) => {
         setIsLoading(true);
         setError(null);
         setApodData(null);
         const apiKey = import.meta.env.VITE_NASA_API_KEY;
         if (!apiKey || apiKey === "SUA_CHAVE_API_AQUI") {
            setError("Chave da API da NASA não configurada. Verifique o arquivo .env");
            setIsLoading(false);
            return;
         }
         try {
            let url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`;
            if (targetDate) url += `&date=${targetDate}`;
            const response = await fetch(url);
            if (!response.ok) {
               const errorData = await response.json();
               throw new Error(errorData.msg || `A imagem para esta data não foi encontrada ou houve um erro na API.`);
            }
            const data: APODData = await response.json();            
            setApodData(data);
            if (!dateParam && data.date) {
               setLatestDate(data.date); // Salva a última data disponível
               navigate(`/date/${data.date}`, { replace: true, state: { apodData: data } });
            }
         } catch (err) {
            if (err instanceof Error) {
               setError(err.message);
            } else {
               setError("Um erro desconhecido ocorreu.");
            }
         } finally {
            setIsLoading(false);
         }
      };

      if (!dateParam) {
         fetchAPOD();
      } else {
         // Se veio do redirecionamento e já tem dados, usa-os
         const nav = window.history.state && window.history.state.usr;
         if (nav && nav.apodData) {
            setApodData(nav.apodData);
            setLatestDate(nav.apodData.date); // Salva a última data disponível
            setIsLoading(false);
         } else {
            fetchAPOD(dateParam);
            // Busca a última data disponível
            if (!latestDate) {
               const apiKey = import.meta.env.VITE_NASA_API_KEY;
               if (apiKey && apiKey !== "SUA_CHAVE_API_AQUI") {
                  fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`)
                     .then(res => res.json())
                     .then(data => {
                        if (data.date) setLatestDate(data.date);
                     });
               }
            }
         }
      }
   }, [dateParam, navigate]);

   // Calcula as datas anterior e próxima para a navegação.
   const getNavDates = () => {
      const targetDate = dateParam
         ? new Date(dateParam + "T12:00:00")
         : new Date();

      const prev = new Date(targetDate);
      prev.setDate(targetDate.getDate() - 1);

      const next = new Date(targetDate);
      next.setDate(targetDate.getDate() + 1);

      // Usa a última data disponível da API como limite
      if (latestDate) {
         const last = new Date(latestDate + "T12:00:00");
         if (next > last) {
            return {
               prevDate: getFormattedDate(prev),
               nextDate: null,
            };
         }
         return {
            prevDate: getFormattedDate(prev),
            nextDate: getFormattedDate(next),
         };
      }
      // fallback para hoje
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normaliza a data de hoje para comparação
      if (next > today) {
         return {
            prevDate: getFormattedDate(prev),
            nextDate: null,
         };
      }
      return {
         prevDate: getFormattedDate(prev),
         nextDate: getFormattedDate(next),
      };
   };

   const { prevDate, nextDate } = getNavDates();

   return (
      <div
         className="min-h-screen w-full p-4 flex items-center justify-center bg-cover bg-center bg-fixed"
         style={{
            backgroundImage:
               "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')",
         }}
      >
         <div className="w-full max-w-5xl mx-auto flex items-center justify-center">
            {isLoading && <LoadingSpinner />}
            {error && <ErrorMessage message={error} />}
            {!isLoading && !error && apodData && (
               <APODCard
                  data={apodData}
                  prevDate={prevDate}
                  nextDate={nextDate}
               />
            )}
         </div>
      </div>
   );
}
