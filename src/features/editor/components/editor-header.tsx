"use client"; // This error means a Server Component is passing a function such as onClick or onChange to a Client Component. => this error comes when server component is calling client component and we have not declared this component as "use client". Functions cannot be serialized and sent from the server to the browser
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
   Breadcrumb,
   BreadcrumbItem,
   BreadcrumbLink,
   BreadcrumbList,
   BreadcrumbSeparator
} from "@/components/ui/breadcrumb";
import { useSuspenseWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";

import { Input } from "@/components/ui/input";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";

export const EditorSaveButton = ({workflowId} : {workflowId : string}) => {
   return (
      <div className = "ml-auto ">
         <Button size = "sm" onClick = {() => {}} disabled = {false}>
            <SaveIcon className= "size-4"/>
            Save
         </Button>
      </div>
   )
}

export const EditorBreadcrumbs = ({workflowId} : {workflowId : string}) => {
   return (
      <Breadcrumb>
         <BreadcrumbList>
            <BreadcrumbItem>
               <BreadcrumbLink asChild>
                  <Link prefetch href = "/workflows">
                     Workflows
                  </Link>
               </BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbSeparator/>
            <EditorNameInput workflowId = {workflowId} />
         </BreadcrumbList>
      </Breadcrumb>
   )
}

export const EditorNameInput = ({ workflowId } : {workflowId : string}) => {
   const { data : workflow } = useSuspenseWorkflow(workflowId);
   const updateWorkflow = useUpdateWorkflowName();

   const [isEditing, setIsEditing] = useState(false);
   const [name, setName] = useState(workflow.name);

   const inputRef = useRef<HTMLInputElement>(null); // reference to the input element, null is the initial value because input hasn't been rendered yet, useRef creates an object with a .current property , changing it does not trigger a render.
   
   useEffect(() => {
      if (workflow.name) {
         setName(workflow.name);
      }
   }, [workflow.name]); // this will update if any new name is received

   useEffect(() => {
      if (isEditing && inputRef.current) {
         inputRef.current.focus(); // .focus() tells the browser to make the input the active element that receives keyboard input
         inputRef.current.select(); // select() selects the content on the input
      }
   }, [isEditing])

   const handleSave = async () => {
      if (name === workflow.name) {
         setIsEditing(false);
         return;
      }

      try {
         await updateWorkflow.mutateAsync({
            id : workflow.id,
            name
         });
      }
      catch {
         setName(workflow.name)
      }
      finally {
         setIsEditing(false);
      }
   }

   const handleKeydown = (e : React.KeyboardEvent) => {
      if (e.key === "Enter") {
         handleSave();
      }
      else if (e.key == "Escape") {
         setName(workflow.name);
         setIsEditing(false);
      }
   }; 

   if (isEditing) {
      return (
         <Input
            disabled = {updateWorkflow.isPending}
            ref = {inputRef}
            value = {name}
            onChange  = {(e) => setName(e.target.value)}
            onBlur = {handleSave} // this will be called when the input loses focus
            onKeyDown = {handleKeydown} // listener to handle keydown events
            className = "h-7 w-auto min-w-[100px] px-2"
         />
      )
   }

   return (
      <BreadcrumbItem onClick = {() => setIsEditing(true)} className= "cursor-pointer hover:text-foreground transition-colors">
         {workflow.name}
      </BreadcrumbItem>
   )
};

export const EditorHeader = ({ workflowId } : { workflowId : string }) => {
   return (
      <header className = "flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
         <SidebarTrigger/>

         <div className= "flex flex-row items-center justify-between gap-x-4 w-full">
            <EditorBreadcrumbs workflowId = {workflowId} />
            <EditorSaveButton workflowId = {workflowId}/>
         </div>
      </header>
   );
};