// page is now left as a server component
import { Client } from './client';
import {Suspense} from 'react';
import { trpc, getQueryClient } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.query(trpc.getUsers.queryOptions()); // it is leveraging the speed of server

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center ">
      <HydrationBoundary state = {dehydrate(queryClient)}>
        <Suspense fallback={<p> Loading... </p>}>
          <Client />
        </Suspense>
      </HydrationBoundary>
    </div> 
    // state = server data in shippable form (plain json)
  )// It is the bridge between server side data and client side cache , so your app doesn't refetch data the server already got on each request
  // queryClient -> the server cache (holds fetched data like todo's)

  // The word "hydrate" = add water to something dry. The server-rendered HTML is "dry" (static, no JS state). Hydration "adds the state back" to make it fully alive and interactive.

  // Then React loads and hydrates — meaning it runs your components (<Client />, useQuery, etc.) in the browser for the first time to attach event listeners and make it interactive.
//  Hydration is what carries the data (not the HTML) across the server→client boundary.

  // Hydration = attaching JavaScript to server-rendered HTML so it becomes interactive.
// Server sends HTML    →  Page LOOKS ready   (but dead )
 // Browser loads JS   →  Page BECOMES alive  (hydration )
   // React hydration (the big one) :	Adding JS to server HTML to make the whole page interactive
// React Query hydration :	Filling the client's cache with server data so useQuery doesn't refetch




};

export default Page;