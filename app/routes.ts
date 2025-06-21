import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
   index("routes/home.tsx"), //torna a página home a primeira a ser acessada
   route("date/:date", "routes/home.tsx", { id: "routes/home-date" }), // adiciona rotas de data, alterando a página dependendo da que estiver lá
] satisfies RouteConfig;