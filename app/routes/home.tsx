import {
   useLoaderData,
   useRouteError,
   isRouteErrorResponse,
   redirect,
   type LoaderFunctionArgs,
} from "react-router";
import { useState, useEffect } from "react";

import { APODCard } from "../components/APODCards";
import { ErrorMessage } from "../components/ErrorMessage";
import { LoadingSpinner } from "../components/LoadingSpinner";
import type { APODData } from "../lib/apod.types";

// Auxiliary function to format date as YYYY-MM-DD
const getFormattedDate = (date: Date): string =>
   date.toISOString().split("T")[0];

export async function loader({ params }: LoaderFunctionArgs) {
   const apiKey = import.meta.env.VITE_NASA_API_KEY;
   if (!apiKey || apiKey === "SUA_CHAVE_API_AQUI") {
      throw new Response(
         JSON.stringify({
            message:
               "NASA API key not configured. Check your .env file.",
         }),
         { status: 500 }
      );
   }
   const targetDate = params.date;
   if (!targetDate) {
      const latestResponse = await fetch(
         `https://api.nasa.gov/planetary/apod?api_key=${apiKey}`
      );
      if (!latestResponse.ok) {
         throw new Response(
            JSON.stringify({
               message:
                  "Unable to fetch the latest date from NASA API.",
            }),
            { status: 500 }
         );
      }
      const latestApodData: APODData = await latestResponse.json();
      return redirect(`/date/${latestApodData.date}`);
   }
   const [targetDateResponse, latestDateResponse] = await Promise.all([
      fetch(
         `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&date=${targetDate}`
      ),
      fetch(`https://api.nasa.gov/planetary/apod?api_key=${apiKey}`),
   ]);
   if (!targetDateResponse.ok) {
      const errorData = await targetDateResponse.json();
      throw new Response(
         JSON.stringify({
            message:
               errorData.msg ||
               `The image for the date ${targetDate} was not found.`,
         }),
         { status: targetDateResponse.status, statusText: "Not Found" }
      );
   }
   const apodData: APODData = await targetDateResponse.json();
   let latestDate: string;
   if (!latestDateResponse.ok) {
      latestDate = apodData.date;
   } else {
      const latestApodData: APODData = await latestDateResponse.json();
      latestDate = latestApodData.date;
   }
   const target = new Date(apodData.date + "T12:00:00");
   const prev = new Date(target);
   prev.setDate(target.getDate() - 1);
   const next = new Date(target);
   next.setDate(target.getDate() + 1);
   const last = new Date(latestDate + "T12:00:00");
   let nextDate: string | null = getFormattedDate(next);
   if (next > last) nextDate = null;
   return {
      apodData,
      prevDate: getFormattedDate(prev),
      nextDate,
   };
}

// Meta tags should be handled in your route config or with a dedicated component in v7

export default function Home() {
   const { apodData, prevDate, nextDate } = useLoaderData() as {
      apodData: APODData;
      prevDate: string;
      nextDate: string | null;
   };

   // Loading Handler
   const [imgLoaded, setImgLoaded] = useState(false);
   useEffect(() => {
      setImgLoaded(false);
      if (apodData?.url) {
         const img = new window.Image();
         img.src = apodData.url;
         img.onload = () => setImgLoaded(true);
         img.onerror = () => setImgLoaded(true); // evita travar caso erro
      } else {
         setImgLoaded(true);
      }
   }, [apodData?.url]);
   if (!apodData || !imgLoaded) return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-400 inset-shadow-sm inset-shadow-black">
         <LoadingSpinner />
      </div>
   );

   return (
      <div
         className="min-h-screen w-full p-4 flex items-center justify-center bg-cover bg-center bg-fixed"
         style={{
            backgroundImage:
               "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')",
         }}
      >
         <div className="w-full max-w-5xl mx-auto flex items-center justify-center">
            <APODCard data={apodData} prevDate={prevDate} nextDate={nextDate} />
         </div>
      </div>
   );
}

export function ErrorBoundary() {
   const error = useRouteError();
   if (isRouteErrorResponse(error)) {
      return (
         <div className="min-h-screen w-full p-4 flex items-center justify-center">
            <ErrorMessage
               message={
                  error.data?.message || `${error.status} ${error.statusText}`
               }
            />
         </div>
      );
   }
   const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred.";
   return (
      <div className="min-h-screen w-full p-4 flex items-center justify-center">
         <ErrorMessage message={errorMessage} />
      </div>
   );
}
