import { useRouter } from 'next/navigation';
import { useTRPC  } from "@/trpc/client";
import { useSuspenseQuery , useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

/** Hook to fetch all workflows by suspense */

export const useSuspenseWorkflows = () => {
   const trpc = useTRPC();
   return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
}

/* Hook to create a new workflow  */
// no unexpected side effects now, useCreateWorkflow was having previously side effectes like pushing router to other page
export const useCreateWorkflow = () => {
   const router = useRouter();
   const trpc = useTRPC();
   const queryClient = useQueryClient();

   return useMutation(trpc.workflows.create.mutationOptions({
      onSuccess : (data) => {
         toast.success(`Workflow ${data.name} created successfully `);
         queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions()); // This tells TanStack Query: "The cached workflow list may be outdated—refresh it."
      }, // we get the data we just created , here names were generated randomly
      onError : (error) => {
         toast.error(`Failed to create workflow  "${error.message}"`);
      },
   }));
};

// const state = dehydrate(queryClient);
// This creates a transferable snapshot containing query data and metadata. It doesn’t fetch anything or delete the server cache. Your framework carries that snapshot to the browser

// queryClient is the object that manages TanStack Query’s cache. It keeps track of fetched data, loading states, errors, and whether data needs refreshing. Think of queryClient as the cache manager, useSuspenseQuery is how your components asks that manager for data.