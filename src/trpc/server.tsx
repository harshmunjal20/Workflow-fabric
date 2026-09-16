import 'server-only'; // <-- ensure this file cannot be imported from the client because it contains server-only code. This is important because the code in this file is responsible for creating the TRPC Context and the tRPC Router, which could only be used on the server. If this file is imported from the client, it could lead to security vulnerabilities and unexpected behavior.

import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query';
import { createTRPCClient, httpLink } from '@trpc/client';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import type { AppRouter } from './routers/_app';

// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);

// here we are creating a caller instance of the trpc client that can be used to call the trpc procedures on the server side. This is important because we want to be able to call the trpc procedures from the server side without having to go through the network. This is important because it allows us to call the trpc procedures from the server side without having to go through the network, which improves performance and reduces the risk of bugs.

// allow us to call the trpc data access layer through the server component.
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// create a caller instance of the trpc client that can be used to call the trpc procedures on the server side.
export const caller = appRouter.createCaller(createTRPCContext);