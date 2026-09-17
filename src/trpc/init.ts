import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import {auth} from '@/lib/auth';
import { headers } from 'next/headers';

export const createTRPCContext = cache(async () => {
  // @see: https://trpc.io/docs/server/context 
  return { userId: 'user_123' }; // like a auth token
}); // why cache ? because the context is created once per request, caching it can improve performance by avoiding unnecessary re-computation of the context for each request.

// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.create({
   // * @see https://trpc.io/docs/server/data-transformers

  // transformer: superjson,
});

// Base router and procedure helpers
export const createTRPCRouter = t.router; 
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = baseProcedure.use(async({ctx , next }) => {

  const session = await auth.api.getSession({
    headers : await headers()
  })

  if (!session) {
    throw new TRPCError({
      code : "UNAUTHORIZED",
      message : "Unauthorized",
    });
  }

  return next({ctx : {...ctx, auth : session}}); // if above error is not thrown then the next middleware will be  called

  // If session exists → call next({ ctx }), which:

  // Passes control to the actual resolver.

  // Extends the context with auth: session, so inside any protected procedure you can access ctx.auth.user, ctx.auth.session, etc
}); 



// protectedProcedure extends baseProcedure , these are proper middlewares , next js middlewares are more like proxy than a middleware