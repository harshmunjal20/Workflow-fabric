"use client";
import { EntityHeader, EntityContainer, EntitySearch, EntityPagination } from "@/components/entity-components";
import { useSuspenseWorkflows, useCreateWorkflow } from "../hooks/use-workflows"
import { useUpgradeModal } from "@/hooks/use-upgrade-modal";
import { useRouter } from "next/navigation";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

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
      <div className= "flex-1 flex justify-center items-center ">
         <pre className = "whitespace-pre-wrap">{/* means whitespace : pre-wrap , it tells the browser to : preserve lines and breaks in the text , wrap long lines so they fit inside the container */}
            {JSON.stringify(workflows.data, null, 2)}  {/* adds newline and indentation but div alone collapses that whitespace , use pre to preserve the formatting*/}
         </pre>
      </div>
   );
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