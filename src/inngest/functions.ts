// src/inngest/functions.ts
import { inngest } from "./client";
import prisma from "@/lib/db";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { sarvam } from "sarvam-ai-sdk";
import { groq } from "@ai-sdk/groq";
const google = createGoogleGenerativeAI();

export const execute = inngest.createFunction(
  { id: "execute-ai"},
  { event: "execute/ai" }, // They are just the names execute/ai and id : execute-ai
  async ({ event, step }) => {
   await step.sleep("pretend", "5s"); // pretend is the name of step

   // step.ai.wrap essentially allowing inngest to manage that ai operation as part of its durable workflow
   const {steps : geminiSteps } = await step.ai.wrap( // await step.ai.wrap means Run this ai-operation as an inngest step
      "gemini-generate-text", // The first argument is the step's identifier/name within the Inngest workflow.
      generateText, // function which we are wrapping ie. generate text from ai library
      { // The third argument is the options object passed to generateText
         model : google("gemini-3.5-flash-lite"),
         system : "You are a helpful Ai Assistant.", // → system instruction for the model.
         prompt : "What is 2 + 2?"
      } // These are the arguments/options passed to generateText.
   );

   const {steps : sarvamSteps} = await step.ai.wrap( // await step.ai.wrap means Run this ai-operation as an inngest step
      "sarvam-generate-text", // The first argument is the step's identifier/name within the Inngest workflow.
      generateText, // function which we are wrapping ie. generate text from ai library
      { // The third argument is the options object passed to generateText
         model : sarvam("sarvam-105b-conversations"),
         system : "You are a helpful Ai Assistant.", // → system instruction for the model.
         prompt : "What is 2 + 2?"
      } // These are the arguments/options passed to generateText.
   );

   const {steps : openaisteps} = await step.ai.wrap(
      "OpenAI-genrate-text",
      generateText,
      {
         model : groq("openai/gpt-oss-120b"),
         system : "You are a helpful Ai Assistant",
         prompt : "What is 2 + 2"
      }
   );

   return {
      geminiSteps, 
      sarvamSteps,
      openaisteps
   };
  }
);