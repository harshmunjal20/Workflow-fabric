// src/inngest/functions.ts
import { inngest } from "./client";
import prisma from "@/lib/db";

export const processTask = inngest.createFunction(
  { id: "process-task", retries : 2}, {event: "app/task.created" },
  async ({ event, step }) => {
   // fetching the video
   await step.sleep("Fetching", "5s");

   // transcribing the video
   await step.sleep("Transcribing", "5s");

   // sending transcribed Files to AI
   await step.sleep("Sending to AI", "5s");

   await step.run("create-workflow", async () => {
      return prisma.workflow.create({
         data : {
            name : "workflow-from-inngest",
         },
      });
   });

   const result = await step.run("handle-task", async () => {
      return { processed: true, id: event.data.id };
   });

   return { message: `Task ${event.data.id} complete`, result }; // event.data.id is the payload
  }
);