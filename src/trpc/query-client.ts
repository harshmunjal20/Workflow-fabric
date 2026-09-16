import {
  defaultShouldDehydrateQuery,
  QueryClient,
} from '@tanstack/react-query';
// import superjson from 'superjson';

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30 * 1000,
      },
      dehydrate: {
        // serializeData: superjson.serialize,
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === 'pending',
      },
      hydrate: {
        // deserializeData: superjson.deserialize,
      },
    },
  });
} // singleton pattern is used to create a single instance of the QueryClient that can be shared across the application. This is important because the QueryClient is responsible for managing the cache and state of all queries in the application, and having multiple instances could lead to inconsistent state and unexpected behavior. By creating a single instance, we ensure that all queries share the same cache and state, which improves performance and reduces the risk of bugs.