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

// Flow summary

// Client (tRPC client)
//   → POST /api/trpc/user.getById
//     → Next.js routes to this handler (POST export)
//       → fetchRequestHandler parses the path
//         → createTRPCContext runs (auth, db, etc.)
//           → appRouter dispatches to user.getById
//             → your procedure returns data
//               → serialized back as HTTP response
