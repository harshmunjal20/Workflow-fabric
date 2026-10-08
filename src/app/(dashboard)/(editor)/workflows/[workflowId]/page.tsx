import { requireAuth } from "@/lib/auth-utils";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from 'react';
import { EditorError, EditorLoading, Editor } from "@/features/editor/components/editor";
import { EditorHeader } from "@/features/editor/components/editor-header";

interface PageProps {
   params : Promise<{
      workflowId : string
   }> // route params changed from plain synchronous to asychronous promises
};

// http://localhost:3000/workflows/123

const page = async ({ params } : PageProps) => {
   await requireAuth(); // Protecting the page

   const { workflowId } = await params;
   prefetchWorkflow(workflowId);

   return (
      <HydrateClient>
         <ErrorBoundary fallback={<EditorError />}> {/* if fails then show this */}
            <Suspense fallback= {<EditorLoading />}> {/* we can use suspense around it as we using useSuspenseQuery in workflows list */}
               <EditorHeader workflowId = {workflowId} />
               <main className = "flex-1">
                  <Editor workflowId = {workflowId} />
               </main> 
               {/* separating editorHeader and main because we are following this structure in /workflows also check in C:\Users\harsh\Downloads\Workflow_Fabric\workflow-fabric\src\app\(dashboard)\(rest)\layout.tsx , children are wrapped in main and above main is appHeader */}
            </Suspense>
         </ErrorBoundary>
      </HydrateClient>
   )
}

export default page;