import { NodeType } from "@/generated/prisma/enums";
import type { NodeTypes } from "@xyflow/react";
import { InitialNode } from "@/components/initial-node";

export const NodeComponents = {
   [NodeType.INITIAL] : InitialNode,

} as const satisfies NodeTypes // as const makes the properties readonly for TypeScript.
// satisfies NodeTypes : checks that this object meets react flow's requirements

export type RegisterNodeType = keyof typeof NodeComponents