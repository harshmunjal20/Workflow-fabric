// Workflows is my default route
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";
import { WorkflowsList } from "@/features/workflows/components/workflows";
import { WorkflowsContainer } from "@/features/workflows/components/workflows";

const Page = async () => {
   await requireAuth();
   
   prefetchWorkflows();  // because it is asynchronous and loads faster

   // rendering the workflows below by hydrate client
   return (
      <WorkflowsContainer>
         <HydrateClient>
            <ErrorBoundary fallback={<p>Error!</p>}> {/* if fails then show this */}
               <Suspense fallback= {<p>Loading...</p>}> {/* we can use suspense around it as we using useSuspenseQuery in workflows list */}
                  <WorkflowsList />
               </Suspense>
            </ErrorBoundary>
         </HydrateClient>
      </WorkflowsContainer>
   );
};

export default Page;