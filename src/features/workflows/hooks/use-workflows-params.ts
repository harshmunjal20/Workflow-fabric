import { useQueryStates } from "nuqs"; // no /server added because it is hook, it is meant to be used in client side, client hook that connects react state to url query params
import { workflowsParams } from "../params";

export const useWorkflowsParams = () => {
   return useQueryStates(workflowsParams);
}
