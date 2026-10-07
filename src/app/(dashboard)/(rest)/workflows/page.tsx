// Workflows is my default route
import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import type { SearchParams } from "nuqs/server";
import { Suspense } from "react";
import { WorkflowsList, WorkflowsContainer, WorkflowsLoading, WorkflowsError } from "@/features/workflows/components/workflows";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";

type Props = {
   searchParams : Promise<SearchParams>, //params is a promise and it is a reserved keyword for each page.tsx same way searchParams for queries
}

const Page = async ({searchParams} : Props) => {
   await requireAuth();
   const params = await workflowsParamsLoader(searchParams);
   prefetchWorkflows(params);  // because it is asynchronous and loads faster

   // rendering the workflows below by hydrate client
   return (
      <WorkflowsContainer>
         <HydrateClient>
            <ErrorBoundary fallback={<WorkflowsError />}> {/* if fails then show this */}
               <Suspense fallback= {<WorkflowsLoading />}> {/* we can use suspense around it as we using useSuspenseQuery in workflows list */}
                  <WorkflowsList />
               </Suspense>
            </ErrorBoundary>
         </HydrateClient>
      </WorkflowsContainer>
   );
};

export default Page;