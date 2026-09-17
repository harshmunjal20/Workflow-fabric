import { requireAuth } from '@/lib/auth-utils';
import {caller}  from '@/trpc/server';
import {LogoutButton}  from  './logout';

// we want a protected server component ie, login api should not give me login page even when i have logged in, also i want that home page should not be accessed directly , ie.login is mandatory
const Page = async () => {
  await requireAuth();

  const data = await caller.getUsers();

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center flex-col gap-y-6">
      Protected server component
      <pre className="text-left whitespace-pre-wrap">
        {JSON.stringify(data, null, 3)}
      </pre>

      <LogoutButton/>
    </div> 
  ); // log out will work when user is signed in // i want only logged in users to see this 
};

export default Page;

  // tRPC is the bridge between server side data and client side cache , so your app doesn't refetch data the server already got on each request
  // queryClient -> the server cache (holds fetched data like todo's)

  // The word "hydrate" = add water to something dry. The server-rendered HTML is "dry" (static, no JS state). Hydration "adds the state back" to make it fully alive and interactive.

  // Then React loads and hydrates — meaning it runs your components (<Client />, useQuery, etc.) in the browser for the first time to attach event listeners and make it interactive.
//  Hydration is what carries the data (not the HTML) across the server→client boundary.

  // Hydration = attaching JavaScript to server-rendered HTML so it becomes interactive.
// Server sends HTML    →  Page LOOKS ready   (but dead )
 // Browser loads JS   →  Page BECOMES alive  (hydration )
   // React hydration (the big one) :	Adding JS to server HTML to make the whole page interactive
// React Query hydration :	Filling the client's cache with server data so useQuery doesn't refetch


// state = server data in shippable form (plain json)