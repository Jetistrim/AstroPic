import { AlertTriangle } from "lucide-react"

export const ErrorMessage = ({ message }: { message?: string}) => {
   return (
      <div role="alert" className="alert alert-error alert-vertical sm:alert-horizontal">
         <AlertTriangle className="h-6 w-6" />
         <div>
            <h3 className="font-bold">Oops! Something went wrong.</h3>
            <div className="text-xs">
               {message || "An error occurred while contacting NASA's API."}
            </div>
         </div>
      </div>
   )
}