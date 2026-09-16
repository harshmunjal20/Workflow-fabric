import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { createTRPCContext } from '@/trpc/init';
import { appRouter } from '@/trpc/routers/_app'; // why use @ here @ means root of project, so we can use absolute imports instead of relative imports. This makes it easier to move files around without having to update import paths.
 
const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext,
  });
 
export { handler as GET, handler as POST };