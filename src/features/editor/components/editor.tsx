"use client";

import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge , type Node, type Edge, type NodeChange, type EdgeChange, type Connection , Background, Controls, MiniMap , Panel } from "@xyflow/react";
import '@xyflow/react/dist/style.css';
import { NodeComponents } from "@/config/node-components";
import { AddNodeButton } from "./add-node-button";

// Stable reference simply means reusing the same object instead of creating new one each render
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

   const [nodes, setNodes] = useState<Node[]> (workflow.nodes); // now we will be creating node components registery
   const [edges, setEdges] = useState<Edge[]> (workflow.edges);

   const onNodesChange = useCallback( // useCallback keeps the same function reference between renders.Without it, React creates a new function every time your component renders:
      (changes : NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)), 
   []); // changes are new changes, nodeSnapshot is the current state 
   // applyNodeChanges(changes, nodesSnapshot) -> This takes the changes and the current nodes, then returns an updated array of nodes. and react setNodes setter has stable reference, Use the callback form when the new state depends on the previous state, as it does here.
   
   const onEdgesChange = useCallback(
      (changes : EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)), 
   []);

   const onConnect = useCallback( // A callback is a function you pass to another function so it can call it when needed.
      (params : Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)), // setEdges also has stable reference and has callback applyNodeChanges
   []); // [] is dependency array

   return (       
      <div className = "size-full">
         <ReactFlow
            nodes = {nodes}
            edges = {edges}
            onNodesChange = {onNodesChange}
            onEdgesChange = {onEdgesChange}
            onConnect = {onConnect}
            fitView // this prop will automatically adjusts the zoom and position of the canvas so that all nodes fit inside the visible area, so fitView applies the initial fit, it doesn't automatically refit every time you move a node
            proOptions = {
               {hideAttribution : true}
            }
            nodeTypes= {NodeComponents}
         >
            <Background />
            <Controls />
            <MiniMap />
            <Panel position = "top-right">
               <AddNodeButton />
            </Panel>
         </ReactFlow>
      </div>
   )
}