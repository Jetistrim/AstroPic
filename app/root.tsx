import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Page not Found" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : (error.data?.message as string) || error.statusText;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    message = error.name;
    details = error.message;
    stack = error.stack;
  }

  return (
    <Layout>
      <main
        className="min-h-screen w-full p-4 flex items-center justify-center bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop')",
        }}
      >
        <div className="card bg-base-100/60 shadow-xl glass max-w-lg w-full">
          <div className="card-body items-center text-center">
            <h1 className="card-title text-3xl font-bold">{message}</h1>
            <p>{details}</p>
            {stack && (
              <pre className="w-full p-4 text-left overflow-x-auto bg-base-300/50 rounded-md mt-4 text-xs">
                <code>{stack}</code>
              </pre>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}
