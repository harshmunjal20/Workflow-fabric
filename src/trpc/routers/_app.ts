import { createTRPCRouter } from "@/trpc/init";
import { workflowsRouter } from "@/features/workflows/server/routers";

async function _sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const appRouter = createTRPCRouter({
  workflows : workflowsRouter
});

// export type definition of API because we want to use it in the client side.
export type AppRouter = typeof appRouter;
