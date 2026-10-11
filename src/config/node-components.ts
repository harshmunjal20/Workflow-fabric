import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/components/manual-trigger/node";

export const NodeComponents = {
   [NodeType.INITIAL] : InitialNode,
   [NodeType.HTTP_REQUEST] : HttpRequestNode,
   [NodeType.MANUAL_TRIGGER] : ManualTriggerNode

} as const satisfies NodeTypes // as const makes the properties readonly for TypeScript.
// satisfies NodeTypes : checks that this object meets react flow's requirements

export type RegisterNodeType = keyof typeof NodeComponents