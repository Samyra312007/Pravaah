"use client";

import { useEffect, useRef, useCallback } from "react";
import * as d3 from "d3-force";
import { select, zoom as d3Zoom, drag as d3Drag, pointer } from "d3";
import type { NetworkNode, NetworkEdge } from "@/types/network";

interface SimNode extends NetworkNode {
  x: number;
  y: number;
  vx: number;
  vy: number;
  fx?: number | null;
  fy?: number | null;
}

interface SimEdge {
  source: SimNode | string;
  target: SimNode | string;
  type: "involved-in" | "associated-with" | "occurred-at";
  label?: string;
}

interface NetworkGraphProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  searchQuery: string;
  selectedNodeId: string | null;
  onNodeClick: (nodeId: string) => void;
  onNodeHover: (nodeId: string | null) => void;
}

const NODE_COLORS: Record<string, string> = {
  suspect: "#EF4444",
  victim: "#3B82F6",
  case: "#8B5CF6",
  location: "#10B981",
};

const NODE_RADII: Record<string, number> = {
  suspect: 22,
  victim: 18,
  case: 16,
  location: 14,
};

const EDGE_STROKES: Record<string, { dash: string; width: number; color: string }> = {
  "involved-in": { dash: "", width: 2.5, color: "#94A3B8" },
  "associated-with": { dash: "6,4", width: 2, color: "#94A3B8" },
  "occurred-at": { dash: "2,4", width: 1.5, color: "#CBD5E1" },
};

export function NetworkGraph({
  nodes: staticNodes,
  edges: staticEdges,
  searchQuery,
  selectedNodeId,
  onNodeClick,
  onNodeHover,
}: NetworkGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const simRef = useRef<d3.Simulation<SimNode, SimEdge> | null>(null);

  const getConnectedIds = useCallback((nodeId: string): Set<string> => {
    const connected = new Set<string>([nodeId]);
    staticEdges.forEach((e) => {
      const src = typeof e.source === "string" ? e.source : (e.source as SimNode).id;
      const tgt = typeof e.target === "string" ? e.target : (e.target as SimNode).id;
      if (src === nodeId) connected.add(tgt);
      if (tgt === nodeId) connected.add(src);
    });
    return connected;
  }, [staticEdges]);

  const getSecondDegreeIds = useCallback((nodeId: string): Set<string> => {
    const first = getConnectedIds(nodeId);
    const second = new Set(first);
    first.forEach((id) => {
      getConnectedIds(id).forEach((nid) => second.add(nid));
    });
    return second;
  }, [getConnectedIds]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const svg = select(svgRef.current);

    svg.selectAll("*").remove();

    const g = svg.append("g");

    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoomBehavior);

    const nodes: SimNode[] = staticNodes.map((n) => ({
      ...n,
      x: width / 2 + (Math.random() - 0.5) * width * 0.5,
      y: height / 2 + (Math.random() - 0.5) * height * 0.5,
      vx: 0,
      vy: 0,
    }));

    const edges: SimEdge[] = staticEdges.map((e) => ({ ...e }));

    const simulation = d3.forceSimulation<SimNode>(nodes)
      .force("link", d3.forceLink<SimNode, SimEdge>(edges).id((d) => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-250))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide<SimNode>().radius((d) => NODE_RADII[d.type] + 8));

    simRef.current = simulation;

    const linkGroup = g.append("g").attr("class", "edges");
    const nodeGroup = g.append("g").attr("class", "nodes");
    const labelGroup = g.append("g").attr("class", "labels");

    const linkEls = linkGroup
      .selectAll<SVGLineElement, SimEdge>("line")
      .data(edges)
      .enter()
      .append("line")
      .attr("stroke", (d) => EDGE_STROKES[d.type]?.color || "#94A3B8")
      .attr("stroke-width", (d) => EDGE_STROKES[d.type]?.width || 1.5)
      .attr("stroke-dasharray", (d) => EDGE_STROKES[d.type]?.dash || "")
      .attr("opacity", 0.5);

    const nodeEls = nodeGroup
      .selectAll<SVGGElement, SimNode>("g")
      .data(nodes)
      .enter()
      .append("g")
      .attr("cursor", "pointer");

    nodeEls
      .append("circle")
      .attr("r", (d) => NODE_RADII[d.type])
      .attr("fill", (d) => NODE_COLORS[d.type] || "#6B7280")
      .attr("stroke", "#fff")
      .attr("stroke-width", 2.5);

    const iconEls = nodeEls
      .append("text")
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("fill", "#fff")
      .attr("font-size", (d) => Math.max(NODE_RADII[d.type] * 0.7, 10))
      .attr("font-weight", "bold")
      .attr("pointer-events", "none")
      .text((d) => {
        const map: Record<string, string> = { suspect: "S", victim: "V", case: "C", location: "L" };
        return map[d.type] || "?";
      });

    const labelEls = labelGroup
      .selectAll<SVGTextElement, SimNode>("text")
      .data(nodes)
      .enter()
      .append("text")
      .text((d) => d.label)
      .attr("text-anchor", "middle")
      .attr("dy", (d) => NODE_RADII[d.type] + 16)
      .attr("font-size", 11)
      .attr("fill", "#374151")
      .attr("pointer-events", "none")
      .attr("font-weight", 500)
      .style("text-shadow", "0 1px 2px white");

    const dragBehavior = d3Drag<SVGGElement, SimNode>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeEls.call(dragBehavior);

    nodeEls
      .on("mouseenter", function (_event, d) {
        onNodeHover(d.id);
        select(this).select("circle")
          .transition().duration(150)
          .attr("stroke-width", 4)
          .attr("stroke", "#F59E0B");
      })
      .on("mouseleave", function (_event, d) {
        onNodeHover(null);
        select(this).select("circle")
          .transition().duration(150)
          .attr("stroke-width", 2.5)
          .attr("stroke", "#fff");
      })
      .on("click", (_event, d) => {
        onNodeClick(d.id);
      });

    simulation.on("tick", () => {
      linkEls
        .attr("x1", (d) => (d.source as SimNode).x)
        .attr("y1", (d) => (d.source as SimNode).y)
        .attr("x2", (d) => (d.target as SimNode).x)
        .attr("y2", (d) => (d.target as SimNode).y);

      nodeEls.attr("transform", (d) => `translate(${d.x},${d.y})`);

      labelEls
        .attr("x", (d) => d.x)
        .attr("y", (d) => d.y);
    });

    return () => {
      simulation.stop();
      simRef.current = null;
    };
  }, [staticNodes, staticEdges, onNodeClick, onNodeHover]);

  useEffect(() => {
    if (!simRef.current) return;
    const nodes = simRef.current.nodes();

    const searchLower = searchQuery.toLowerCase().trim();
    let searchMatchIds: Set<string> | null = null;
    let firstDegreeIds: Set<string> | null = null;
    let secondDegreeIds: Set<string> | null = null;

    if (searchLower) {
      // Find directly matched nodes
      const directMatchIds = new Set(
        staticNodes
          .filter((n) => n.label.toLowerCase().includes(searchLower))
          .map((n) => n.id)
      );

      // Compute 1st degree: nodes directly connected to matched nodes
      firstDegreeIds = new Set(directMatchIds);
      directMatchIds.forEach((id) => {
        getConnectedIds(id).forEach((nid) => firstDegreeIds?.add(nid));
      });

      // Compute 2nd degree: nodes connected to 1st degree nodes
      secondDegreeIds = new Set(firstDegreeIds);
      firstDegreeIds.forEach((id) => {
        getConnectedIds(id).forEach((nid) => secondDegreeIds?.add(nid));
      });

      // These are the overall visible nodes
      searchMatchIds = secondDegreeIds;
    }

    const svg = select(svgRef.current);
    svg.selectAll(".nodes g circle").each(function () {
      const el = select(this);
      const d = el.datum() as SimNode;
      if (!searchLower) {
        el.transition().duration(300).attr("opacity", 1).attr("stroke-width", 2.5).attr("stroke", "#fff");
        return;
      }

      const isDirectMatch = firstDegreeIds?.has(d.id) && staticNodes.some((n) => n.id === d.id && n.label.toLowerCase().includes(searchLower));
      const isFirstDegree = !isDirectMatch && getConnectedIds(d.id).size > 0 && Array.from(getConnectedIds(d.id)).some((cid) => {
        const cn = staticNodes.find((n) => n.id === cid);
        return cn?.label.toLowerCase().includes(searchLower);
      });
      const isSecondDegree = !isDirectMatch && !isFirstDegree && secondDegreeIds?.has(d.id);

      el.transition().duration(300)
        .attr("opacity", isDirectMatch || isFirstDegree || isSecondDegree ? 1 : 0.12)
        .attr("stroke-width", isDirectMatch ? 4 : isFirstDegree ? 3 : isSecondDegree ? 2 : 2.5)
        .attr("stroke", isDirectMatch ? "#F59E0B" : isFirstDegree ? "#34D399" : isSecondDegree ? "#60A5FA" : "#fff");
    });

    svg.selectAll(".edges line").each(function () {
      const el = select(this);
      const d = el.datum() as SimEdge;
      const srcId = typeof d.source === "string" ? d.source : (d.source as SimNode).id;
      const tgtId = typeof d.target === "string" ? d.target : (d.target as SimNode).id;
      if (!searchLower) {
        el.transition().duration(300).attr("opacity", 0.5);
        return;
      }
      const isHighlighted = searchMatchIds?.has(srcId) && searchMatchIds?.has(tgtId);
      if (isHighlighted) {
        const srcFirst = firstDegreeIds?.has(srcId);
        const tgtFirst = firstDegreeIds?.has(tgtId);
        const isEdge1st = srcFirst && tgtFirst;
        el.transition().duration(300).attr("opacity", 0.8).attr("stroke", isEdge1st ? "#34D399" : "#60A5FA");
      } else {
        el.transition().duration(300).attr("opacity", 0.04).attr("stroke", "#94A3B8");
      }
    });

    svg.selectAll(".labels text").each(function () {
      const el = select(this);
      const d = el.datum() as SimNode;
      if (!searchLower) {
        el.transition().duration(300).attr("opacity", 1);
        return;
      }
      const isHighlighted = searchMatchIds?.has(d.id);
      el.transition().duration(300).attr("opacity", isHighlighted ? 1 : 0.1);
    });
  }, [searchQuery, staticNodes, staticEdges, getConnectedIds]);

  return (
    <div ref={containerRef} className="w-full h-full">
      <svg ref={svgRef} width="100%" height="100%" className="cursor-grab active:cursor-grabbing" />
    </div>
  );
}
