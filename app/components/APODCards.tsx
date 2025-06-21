import { Link } from "react-router";
import { ArrowLeft, ArrowRight, ExternalLink } from "lucide-react";
import type { APODCardProps } from "~/lib/apod.types";

export function APODCard({ data, prevDate, nextDate }: APODCardProps) {
   return (
      <div className="card lg:card-side bg-base-100/60 shadow-xl glass max-w-5xl animate__animated animate__fadeIn">
         <figure className="lg:w-1/2 bg-base-300/50">
            {data.media_type === "image" ? (
               <div className="flex items-center justify-center">
                  <img
                     src={data.url}
                     alt={data.title}
                     className=""
                  />
               </div>
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
            <p className="mt-4 text-xs italic opacity-70">
               Créditos: {data.copyright ? data.copyright : "National Aeronautics and Space Administration — NASA"}
            </p>
            <div className="flex justify-center card-actions sm:justify-end items-center mt-6 flex-wrap gap-4">
               <div className="w-full flex justify-center items-center sm:justify-end">
                  <Link
                     to={`/date/${prevDate}`}
                     className="btn btn-outline not-hover:border-[var(--foreground)] text-[var(--foreground)] rounded-l-md sm:rounded-none sm:rounded-l-sm join-item"
                  >
                     <ArrowLeft size={16} /> Anterior
                  </Link>
                  {nextDate ? (
                     <Link
                        to={`/date/${nextDate}`}
                        className="btn btn-outline not-hover:border-[var(--foreground)] text-[var(--foreground)] rounded-r-md sm:rounded-none sm:rounded-r-sm join-item"
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