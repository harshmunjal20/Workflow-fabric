import { Polar } from "@polar-sh/sdk";

export const polarClient = new Polar({
   accessToken : process.env.POLAR_ACCESS_TOKEN,
   server : "sandbox"
});

// The external id that we see with each customer in polar is one to one mapping of that id which is currently in our database => you can confirm it by running command npx prisma studio => it means customer are automatically created on sign up via polar, you don't need any webhook or any after sign up event