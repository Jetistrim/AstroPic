import type { Route } from "./+types/home";
// import { Button } from "~/components/ui/button";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Link, useParams, useNavigate } from "react-router";
import {
   Camera,
   ArrowLeft,
   ArrowRight,
   ExternalLink,
   AlertTriangle,
} from "lucide-react";

// --- I still need search what this function do ---

export function meta({}: Route.MetaArgs) {
   return [
      { title: "New React Router App" },
      { name: "description", content: "Welcome to React Router!" },
   ];
}

// --- TYPES ---
// Define a estrutura dos dados que esperamos da API da NASA.
interface APODData {
   date: string;
   explanation: string;
   hdurl: string;
   media_type: "image" | "video";
   title: string;
   url: string;
   copyright?: string;
}

// --- COMPONENTES AUXILIARES ---

// Componente para exibir um spinner de carregamento enquanto os dados são buscados.
function LoadingSpinner() {
   return (
      <div className="flex flex-col items-center justify-center gap-4 text-center">
         <span className="loading loading-spinner text-primary loading-lg"></span>
         <p className="text-primary/70 text-lg">A buscar as estrelas...</p>
      </div>
   );
}

// Componente para exibir mensagens de erro de forma clara.
function ErrorMessage({ message }: { message?: string }) {
   return (
      <div role="alert" className="alert alert-error max-w-lg shadow-lg">
         <AlertTriangle className="h-6 w-6" />
         <div>
            <h3 className="font-bold">Oops! Algo correu mal.</h3>
            <div className="text-xs">
               {message || "Ocorreu um erro ao contactar a API da NASA."}
            </div>
         </div>
      </div>
   );
}

// --- COMPONENTE DO CARD ---

interface APODCardProps {
   data: APODData;
   prevDate: string;
   nextDate: string | null;
};

// Componente que exibe a imagem ou vídeo do dia, com título, descrição e navegação.
function APODCard({ data, prevDate, nextDate }: APODCardProps) {
   return (
      <div className="card lg:card-side bg-base-100/60 shadow-xl glass max-w-5xl animate__animated animate__fadeIn">
         <figure className="lg:w-1/2 bg-base-300/50">
            {data.media_type === "image" ? (
               <img
                  src={data.url}
                  alt={data.title}
                  className="w-full h-full object-cover"
               />
            ) : (
               <iframe
                  src={data.url}
                  title={data.title}
                  className="w-full h-full aspect-video lg:aspect-auto"
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
               />
            )}
         </figure>
         <div className="card-body lg:w-1/2 flex flex-col p-6 lg:p-8">
            <h2 className="card-title text-2xl lg:text-3xl font-bold">
               {data.title}
            </h2>
            <p className="text-sm text-base-content/80 mb-4">
               {new Date(data.date + "T12:00:00").toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
               })}
            </p>

            <div className="flex-grow overflow-y-auto max-h-60 pr-2">
               <p className="text-base-content/90">{data.explanation}</p>
            </div>

            {data.copyright && (
               <p className="mt-4 text-xs italic opacity-70">
                  Créditos: {data.copyright}
               </p>
            )}

            <div className="card-actions justify-between items-center mt-6 flex-wrap gap-4">
               <div className="join">
                  <Link
                     to={`/date/${prevDate}`}
                     className="btn btn-outline join-item"
                  >
                     <ArrowLeft size={16} /> Anterior
                  </Link>
                  {nextDate ? (
                     <Link
                        to={`/date/${nextDate}`}
                        className="btn btn-outline join-item"
                     >
                        Próximo <ArrowRight size={16} />
                     </Link>
                  ) : (
                     <button className="btn btn-outline join-item" disabled>
                        Próximo <ArrowRight size={16} />
                     </button>
                  )}
               </div>
               <a
                  href={data.hdurl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
               >
                  Ver em HD <ExternalLink size={16} className="ml-2" />
               </a>
            </div>
         </div>
      </div>
   );
}

// --- PÁGINA PRINCIPAL (PARA EXPORTAR) ---

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
            setError("Chave da API da NASA não configurada. Verifique o arquivo .env.local");
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
            // Busca a última data disponível apenas uma vez
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
