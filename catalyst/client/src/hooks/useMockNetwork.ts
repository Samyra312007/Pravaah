"use client";

import { useState, useEffect, useMemo } from "react";
import type { NetworkGraph, NetworkNode, RepeatOffender, Association } from "@/types/network";
import {
  generateMockNetworkGraph,
  generateMockRepeatOffenders,
  generateMockAssociations,
} from "@/lib/mock/mockNetwork";

function delay(ms = 300): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

export function useNetworkGraph() {
  const [graph, setGraph] = useState<NetworkGraph | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => {
      setGraph(generateMockNetworkGraph());
      setLoading(false);
    });
  }, []);

  return { graph, loading };
}

export function useRepeatOffenders() {
  const [offenders, setOffenders] = useState<RepeatOffender[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => {
      setOffenders(generateMockRepeatOffenders());
      setLoading(false);
    });
  }, []);

  return { offenders, loading };
}

export function useAssociations() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    delay().then(() => {
      setAssociations(generateMockAssociations());
      setLoading(false);
    });
  }, []);

  return { associations, loading };
}

export function useNodeConnections(graph: NetworkGraph | null, nodeId: string | null) {
  return useMemo(() => {
    if (!graph || !nodeId) return { connectedNodes: [], connectedEdges: [], secondDegree: [] };

    const connectedEdges = graph.edges.filter((e) => {
      const src = typeof e.source === "string" ? e.source : (e.source as NetworkNode).id;
      const tgt = typeof e.target === "string" ? e.target : (e.target as NetworkNode).id;
      return src === nodeId || tgt === nodeId;
    });

    const connectedNodeIds = new Set<string>([nodeId]);
    connectedEdges.forEach((e) => {
      const src = typeof e.source === "string" ? e.source : (e.source as NetworkNode).id;
      const tgt = typeof e.target === "string" ? e.target : (e.target as NetworkNode).id;
      connectedNodeIds.add(src);
      connectedNodeIds.add(tgt);
    });

    const connectedNodes = graph.nodes.filter((n) => connectedNodeIds.has(n.id));

    const secondDegreeEdges = graph.edges.filter((e) => {
      const src = typeof e.source === "string" ? e.source : (e.source as NetworkNode).id;
      const tgt = typeof e.target === "string" ? e.target : (e.target as NetworkNode).id;
      return connectedNodeIds.has(src) && connectedNodeIds.has(tgt);
    });

    const secondDegreeNodeIds = new Set<string>([nodeId]);
    secondDegreeEdges.forEach((e) => {
      const src = typeof e.source === "string" ? e.source : (e.source as NetworkNode).id;
      const tgt = typeof e.target === "string" ? e.target : (e.target as NetworkNode).id;
      secondDegreeNodeIds.add(src);
      secondDegreeNodeIds.add(tgt);
    });

    const secondDegree = graph.nodes.filter((n) => secondDegreeNodeIds.has(n.id) && !connectedNodeIds.has(n.id));

    return { connectedNodes, connectedEdges, secondDegree };
  }, [graph, nodeId]);
}
