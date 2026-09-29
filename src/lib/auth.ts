import { checkout, polar, portal } from "@polar-sh/better-auth";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma  from "./db";
import { polarClient } from "./polar";

export const auth = betterAuth({
   database : prismaAdapter(prisma, {
      provider : "postgresql"
   }),
   emailAndPassword : {
      enabled : true,
      autoSignIn : true // automatically signs in when someone registers
   },
   plugins : [
      polar({
         client : polarClient,
         createCustomerOnSignUp: true,
         use: [
            checkout({
               products : [
                  {
                     productId : "306d4406-ffa7-485d-921c-acf4bfcefcad",
                     slug : "pro", // readable alias for polar product id
                  }
               ],
               successUrl: process.env.POLAR_SUCCESS_URL,
               authenticatedUsersOnly : true, // customers will only be able to checkout if they are signed in
            }),
            portal(),
         ]
      })
   ]
});

// now we introduced create customer on sign up field, 

