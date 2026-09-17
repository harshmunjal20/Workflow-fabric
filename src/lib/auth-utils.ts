// for making it page.tsx of / api a server component
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from './auth';

export const requireAuth = async () => {
   const session = await auth.api.getSession({
      headers : await headers(),
   }) // why headers is used because we want to get the cookies

   if (!session) {
      redirect("/login");
   }

   return session;
}

export const requireUnAuth = async () => {
   const session = await auth.api.getSession({
      headers : await headers(),
   })

   if (session) {
      redirect("/");
   }

   return session;
}

