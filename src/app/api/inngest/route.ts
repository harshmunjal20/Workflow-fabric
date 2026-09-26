import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { execute } from "@/inngest/functions";
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";

const google = createGoogleGenerativeAI();

// create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
   // your functions will be passed here later
   execute
  ],
});