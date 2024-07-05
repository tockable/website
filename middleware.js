export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/creator/admin",
    "/creator/dashboard",
    "/creator/launchpad",
    "/creator/launchpad/:path*",
  ],
};
