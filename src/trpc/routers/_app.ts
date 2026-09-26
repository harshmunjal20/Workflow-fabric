import { TRPCError } from "@trpc/server";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/db"; // why prisma ? because prisma is a database client that allows you to interact with your database in a type-safe way. It generates TypeScript types based on your database schema, which allows you to catch errors at compile time rather than at runtime.
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

async function _sleep(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export const appRouter = createTRPCRouter({
  testAi: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "execute/ai",
    });

    return { success: true, message: "Job queued" };
  }),

  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany();
  }),

  createWorkflow: protectedProcedure.mutation(async () => {
    await inngest.send({
      name: "app/task.created", // name should be same as event
      data: {
        id: "122",
      },
    });

    return { success: true, message: "Job queued" };
  }),
});

// export type definition of API because we want to use it in the client side.
export type AppRouter = typeof appRouter;
