"use client";

import { type Node, type NodeProps, useReactFlow } from "@xyflow/react";
import { GlobeIcon } from "lucide-react";
import { memo, useState } from "react";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestDialog } from "./dialog"

type HttpRequestNodeData = {
   endpoint? : string;
   method? : "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
   body? : string;
   [key : string] : unknown; // Any additional properties
}

type HttpRequestNodeType = Node<HttpRequestNodeData>

export const HttpRequestNode = memo((props : NodeProps<HttpRequestNodeType>) => {
   const [dialogOpen, setDialogOpen] = useState(false);
   const nodeData = props.data;
   const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : \n ${nodeData.endpoint}` : "Not Configured";

   const nodeStatus = "initial";
   const handleOpenSettings = () => {
      setDialogOpen(true)
   };
   const { setNodes } = useReactFlow();
   
   const handleSubmit = (values : {
      endpoint : string,
      method : string,
      body? : string
   }) => {
      setNodes((nodes) => {
         return nodes.map((node) => {
            if (node.id === props.id) {
               return {
                  ...node,
                  data : {
                     ...node.data,
                     method : values.method,
                     endpoint : values.endpoint,
                     body : values.body
                  }
               }
            }

            return node;
         })
      })
   }

   return (
      <>
         <HttpRequestDialog 
            open = {dialogOpen} 
            onOpenChange = {setDialogOpen} 
            onSubmit = {handleSubmit}
            defaultEndpoint = {nodeData.endpoint}
            defaultMethod = {nodeData.method}
            defaultBody = {nodeData.body}
         />
         <BaseExecutionNode
            {...props}
            id = {props.id}
            icon = {GlobeIcon}
            name = "Http Request"
            status = {nodeStatus}
            description = {description}
            onSettings = {handleOpenSettings}
            onDoubleClick = {handleOpenSettings}
         />
      </>
   )

});

HttpRequestNode.displayName = "HttpRequestNode";