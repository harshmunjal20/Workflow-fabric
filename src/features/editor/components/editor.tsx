"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
   return (
      <LoadingView message = "Loading editor..." />
   )
}

export const EditorError = () => {
   return (
      <ErrorView message = "Error loading Editor..." />
   )
}

export const Editor = ({ workflowId } : { workflowId : string}) => {
   const { data : workflow } = useSuspenseWorkflow(workflowId);

   return (       
      <div> 
         <pre className="whitespace-pre-wrap">
            {JSON.stringify(workflow, null, 2)}
         </pre>
      </div>
   )
}