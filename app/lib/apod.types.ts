// Define a estrutura dos dados que esperamos da API da NASA.
export interface APODData {
   date: string;
   explanation: string;
   hdurl: string;
   media_type: "image" | "video";
   title: string;
   url: string;
   copyright?: string;
}

export interface APODCardProps {
   data: APODData;
   prevDate: string;
   nextDate: string | null;
}