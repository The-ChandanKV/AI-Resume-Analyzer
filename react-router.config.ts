import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("app/routes/home.tsx"),
    route("/auth", "app/routes/auth.tsx"),
] satisfies RouteConfig;
