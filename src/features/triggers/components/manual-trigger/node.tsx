import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import { MousePointerIcon } from "lucide-react";
import { BaseTriggerNode } from "../base-trigger-node";

// This will be not be having settings, It will have a simple onClick event, 
export const ManualTriggerNode = memo((props : NodeProps) => {
   return (
      <>
         <BaseTriggerNode
            {...props}
            icon = {MousePointerIcon}
            name = "When clicking on 'Execute Workflow'"
            // status = {nodeStatus} TODO
            // onSettings = {handleOpenSettings} TODO
            // onDoubleClick = {handleOpenSettings} TODO
            
         />
      </>
   )
})