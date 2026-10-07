"use client";
import { EntityHeader, EntityContainer, EntitySearch, EntityPagination, LoadingView , ErrorView, EmptyView, EntityList, EntityItem} from "@/components/entity-components";
import { useSuspenseWorkflows, useCreateWorkflow, useRemoveWorkflow } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";
import React, { ReactNode } from "react";
import { Workflow } from "@/generated/prisma/client";
import {WorkflowIcon} from "lucide-react";
import {formatDistanceToNow,  } from "date-fns";

export const WorkflowsSearch = () => {
   const [params, setParams] = useWorkflowsParams(); // useWorkflowsParams is a custom hook that returns the current query parameters for workflows and a function to update them

   const {searchValue, onSearchChange } = useEntitySearch({
      params,
      setParams,
   });

   return (
      <EntitySearch 
         value ={searchValue}
         onChange = {onSearchChange}
         placeholder = "Search workflows"
      />
   )
}

export const WorkflowsList = () => {
   const workflows = useSuspenseWorkflows();
   
   return (
      <EntityList 
         items = {workflows.data?.items ?? []}
         getKey = {(workflow) => workflow.id} // get each workflow and return its id
         renderItem = {(workflow) => <WorkflowItem data = {workflow}/>}
         emptyView = {<WorkflowsEmpty />}
      />
   )
};

export const WorkflowsHeader = ({
   disabled 
} : {disabled? : boolean}) => {
   const router = useRouter();
   const createWorkflow = useCreateWorkflow();
   const { modal, handleError } = useUpgradeModal();

   const handleCreate  = () => {
      createWorkflow.mutate(undefined, { // No input data is passed to the mutation
         onSuccess : (data) => {
            router.push(`/workflows/${data.id}`)
         },
         onError : (error) => { // A callback that runs if mutation fails, it receives the error
            handleError(error);
         }
      })
   };

   return (
      <>
         {modal}
         <EntityHeader
            title = "Workflows"
            description = "Create and manage your workflows"
            onNew = {() => {handleCreate()}}
            newButtonLabel = "New Workflow"
            disabled = {disabled}
            isCreating = {createWorkflow.isPending}
         />
      </>
   );
};

export const WorkflowsPagination = () => {
   const workflows = useSuspenseWorkflows();
   const [params, setParams] = useWorkflowsParams();

   return (
      <EntityPagination  
         disabled = {workflows.isFetching}
         totalPages = {workflows.data?.totalPages ?? 1} // if workflows.data is undefined, default to 1
         page = {workflows.data?.page ?? 1} // if workflows.data is undefined, default to 1
         onPageChange = {(newPage) => setParams({...params, page : newPage})} // just change the page in the URL
      />
   )
};

export const WorkflowsContainer = ({
   children
} : {children : React.ReactNode}) => {
   return (
      <EntityContainer
         header = {<WorkflowsHeader />}
         search = {<WorkflowsSearch />}
         pagination = {<WorkflowsPagination />}
      >
         {children}
      </EntityContainer>
   );
};

export const WorkflowsLoading = () => {
   return <LoadingView message = "Loading workflows..." />
};

export const WorkflowsError = () => {
   return <ErrorView message = "Error loading workflows" />
}

export const WorkflowsEmpty = () => {
   const createWorkflow = useCreateWorkflow();
   const { handleError, modal } = useUpgradeModal();
   const router = useRouter();
   
   const handleCreate = () => {
      createWorkflow.mutate(undefined, {
         onError : (error) => {
            handleError(error)
         },
         onSuccess : (data) => { // here data is that workflow we just created
            router.push(`/workflows/${data.id}`)
         }
      }) // createWorkflow.mutate() => starts the mutation—the operation that creates a workflow. undefined means you aren't passing any input data to the mutation. options object as the second argument
   };

   return (
      <>
         {modal}
         <EmptyView 
            message = "No workflows yet. Get started by creating your workflow"
            onNew = {handleCreate}
         />
      </>
   )
}

export const WorkflowItem = ({data} : {data : Workflow}) => {
   const removeWorkflow = useRemoveWorkflow();

   const handleRemove = () => {
      removeWorkflow.mutate({id : data.id})
   }

   return (
      <EntityItem 
         href = {`/workflows/${data.id}`}
         title = {data.name}
         subtitle = {
            <>
               Updated {formatDistanceToNow(data.updatedAt, {addSuffix : true})}{" "}
               &bull; 
               Created{" "} {formatDistanceToNow(data.createdAt, {addSuffix : true})}
            </>
         }
         image= {
            <div className= "size-8 flex items-center justify-center ">
               <WorkflowIcon className= "size-5 text-muted-foreground" />
            </div>
         }
         onRemove = {handleRemove}
         isRemoving = {removeWorkflow.isPending}
      />
   )
}