import  prisma  from '@/lib/db'; // why prisma ? because prisma is a database client that allows you to interact with your database in a type-safe way. It generates TypeScript types based on your database schema, which allows you to catch errors at compile time rather than at runtime.

import { baseProcedure, createTRPCRouter } from '@/trpc/init';
 
export const appRouter = createTRPCRouter({
  getUsers: baseProcedure
    .query((opts) => { // .mutation is used for operations that change data on the server
      return prisma.user.findMany();
    }),
    // 
});
 
// export type definition of API because we want to use it in the client side.
export type AppRouter = typeof appRouter;