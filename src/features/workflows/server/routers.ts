import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import { createTRPCRouter , premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod"; // zod is a library for validating data

// ctx provides things like database connection and logged in users
export const workflowsRouter = createTRPCRouter({
   create : premiumProcedure.mutation(({ ctx }) => {
      return prisma.workflow.create({
         data : {
            name : generateSlug(3), // 3 is the number of words
            userId : ctx.auth.user.id
         },
      });
   }),

   remove : protectedProcedure
   .input(z.object({id : z.string() })) // The mutation needs input to know which record to delete. this requires input to be an object with an id property whose value is a string
   .mutation(({ctx, input}) => {
      return prisma.workflow.delete({
         where : {
            id : input.id,
            userId : ctx.auth.user.id, // userId does not alone makes workflow unique
         }
      }); // deleting the user who actually created the workflow
   }), // used remove because delete is reserved keyword in javascript

   updateName : protectedProcedure
      .input(z.object({ id : z.string(), name : z.string().min(1) }))  // min 1 character
      .mutation(({ ctx , input }) => {
         return prisma.workflow.update({
            where : {
               id : input.id,
               userId : ctx.auth.user.id
            },
            data : {
               name : input.name
            }
         });
      }), //  the update name above is now secure and authenticated endpoint to update a workflow name

   getOne : protectedProcedure
      .input(z.object({ id : z.string() }))
      .query(({ ctx, input }) => {
         return prisma.workflow.findUnique({
            where : {
               id : input.id,
               user: { id: ctx.auth.user.id }
            }
         }) // findUnique is used bcoz it will either find this or throw an error
      }),
   
   getMany : protectedProcedure
      .query(({ctx }) => {
         return prisma.workflow.findMany({
            where : {
               userId : ctx.auth.user.id,
            }
         });
      }),
});