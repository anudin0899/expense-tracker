import { clerkMiddleware } from "@clerk/nextjs/server";
import { authMiddleware } from "@clerk/nextjs/server";


export default authMiddleware({
  publicRoutes: ["/api/public/(.*)", "/", "/api/tracking-api/(.*)"],
});

// export default clerkMiddleware();

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
