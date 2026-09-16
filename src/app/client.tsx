"use client";

import { useTRPC } from '@/trpc/client';
import { useSuspenseQuery } from '@tanstack/react-query'; // why we are using useSuspenseQuery here? because we want to use suspense in the client component. If we use useQuery then it will not use suspense and will not show loading state in the client component.

export const Client = () => {
   const trpc = useTRPC();
   const {data : users} = useSuspenseQuery(trpc.getUsers.queryOptions());

   return (
      <div>
            Client Component : {JSON.stringify(users)}
      </div>
   );
}; // in that case where we were using caller in server component , we were using refetching of data when page changes, but in this case there is no pagination(chunks), no refetching of data when page changes