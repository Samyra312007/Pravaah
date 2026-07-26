export type NodeType = "suspect" | "victim" | "case" | "location";
export type EdgeType = "involved-in" | "associated-with" | "occurred-at";

export interface NetworkNode {
  id: string;
  label: string;
  type: NodeType;
  data?: Record<string, unknown>;
}

export interface NetworkEdge {
  source: string;
  target: string;
  type: EdgeType;
  label?: string;
}

export interface NetworkGraph {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

export interface RepeatOffender {
  accusedName: string;
  personId?: number;
  caseCount: number;
  linkedCases: Array<{
    caseId: number;
    crimeNo: string;
    district: string;
    crimeGroup: string;
    registeredDate: string;
  }>;
  commonMO?: string;
  lastKnownLocation?: string;
}

export interface Association {
  sourceEntity: string;
  sourceType: NodeType;
  targetEntity: string;
  targetType: NodeType;
  associationType: string;
  strength: number;
  casesInCommon: number;
}
