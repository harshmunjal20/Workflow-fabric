import prisma from "@/lib/db";
import { generateSlug } from "random-word-slugs";
import { createTRPCRouter , premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod"; // zod is a library for validating data
import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma/enums";
import type {Node} from "@xyflow/react";
import type {Edge} from "@xyflow/react";

// ctx provides things like database connection and logged in users
export const workflowsRouter = createTRPCRouter({
   create : premiumProcedure.mutation(({ ctx }) => {
      return prisma.workflow.create({
         data : {
            name : generateSlug(3), // 3 is the number of words
            userId : ctx.auth.user.id,
            // every time workflow will be created , these set of nodes will also be created
            nodes : {
               create : {
                  type : NodeType.INITIAL,
                  position : {x : 0, y : 0},
                  name : NodeType.INITIAL
               }
            }
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
      .query( async ({ ctx, input }) => {
         const workflow = await prisma.workflow.findUniqueOrThrow({
            where : {
               id : input.id,
               userId: ctx.auth.user.id
            },
            include : {
               nodes : true,
               connections : true
            } // without include prisma returns the workflow's own fields such as id, name and userId, but doesn't return the related nodes and connections array
         }) // findUnique is used bcoz it will either find this or throw an error
         
         // This code converts the nodes returned by Prisma into the shape React Flow expects.
         const nodes : Node[] = workflow.nodes.map((node) => ({
            id : node.id,
            type : node.type,
            position : node.position as {x : number, y : number},
            data : (node.data as Record<string, unknown>) || {}
         })); // .map() goes through each database node and creates a new object

         // This code converts the connections(edges) returned by prisma into the shape React Flow expects.
         const edges : Edge[] = workflow.connections.map((connection) => ({
            id : connection.id,
            source : connection.fromNodeId,
            target : connection.toNodeId,
            sourceHandle : connection.fromOutput, // foTi -> from output to input
            targetHandle : connection.toInput
         }));

         return {
            id : workflow.id,
            name : workflow.name,
            nodes,
            edges
         }
      }),  // Without include, Prisma returns the workflow’s own fields, such as id, name, and userId, but doesn’t return the related nodes array.
   
   getMany : protectedProcedure
      .input(
         z.object({
            page : z.number().default(PAGINATION.DEFAULT_PAGE), // what page we are on this getMany procedure
            pageSize : z
               .number()
               .min(PAGINATION.MIN_PAGE_SIZE)
               .max(PAGINATION.MAX_PAGE_SIZE)
               .default(PAGINATION.DEFAULT_PAGE_SIZE),
            search : z.string().default("")
         }) // validate input
      )
      .query(async ({ctx , input}) => {
         const {page, pageSize, search} = input;
         const [items, totalCount] = await Promise.all([
            prisma.workflow.findMany({
               // means skip the first 5 then take the next 5
               skip : (page - 1) * pageSize,
               take : pageSize, // no of records to return (take this many records :)
               where : {
                  userId : ctx.auth.user.id,
                  name : {
                     contains : search,
                     mode : "insensitive"
                  }
               },
               orderBy : {
                  updatedAt : "desc", // sorts result by most recently updated first
               }
            }), // fetch the page of items
            prisma.workflow.count({
               where : {
                  userId : ctx.auth.user.id,
                  name : {
                     contains : search,
                     mode : "insensitive"
                  }
               }
            }) // count total no of workflows for user
         ])

         const totalPages = Math.ceil(totalCount / pageSize);
         const hasNextPage = page < totalPages;
         const hasPreviousPage = page > 1;
         
         return {
            items : items,
            page,
            pageSize,
            totalCount,
            totalPages,
            hasNextPage,
            hasPreviousPage
         }
      }),
});