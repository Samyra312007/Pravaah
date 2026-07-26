"use client";

import { useState, useMemo } from "react";
import { Search, Users, Share2, ArrowLeft } from "lucide-react";
import { RoleGuard } from "@/components/layout/RoleGuard";
import { NetworkGraph, NodeDetails, AssociationTable, RepeatOffenderProfile } from "@/components/network";
import { useNetworkGraph, useRepeatOffenders, useAssociations, useNodeConnections } from "@/hooks/useMockNetwork";
import type { Role } from "@/types/common";

const allRoles: Role[] = ["SCRB_ADMIN", "DISTRICT_SP", "STATION_SHO", "INVESTIGATOR", "ANALYST"];

type Tab = "graph" | "offenders" | "associations";

export default function NetworkPage() {
  const { graph, loading: graphLoading } = useNetworkGraph();
  const { offenders, loading: offendersLoading } = useRepeatOffenders();
  const { associations, loading: assocLoading } = useAssociations();

  const [activeTab, setActiveTab] = useState<Tab>("graph");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [selectedOffenderIndex, setSelectedOffenderIndex] = useState<number>(0);

  const { connectedNodes, connectedEdges } = useNodeConnections(graph, selectedNodeId);

  const selectedNode = useMemo(() => {
    if (!graph || !selectedNodeId) return null;
    return graph.nodes.find((n) => n.id === selectedNodeId) || null;
  }, [graph, selectedNodeId]);

  const searchResults = useMemo(() => {
    if (!graph || !searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return graph.nodes.filter((n) => n.label.toLowerCase().includes(q));
  }, [graph, searchQuery]);

  const handleNodeClick = (nodeId: string) => {
    setSelectedNodeId((prev) => (prev === nodeId ? null : nodeId));
  };

  const handleSearchSelect = (nodeId: string) => {
    setSearchQuery(graph?.nodes.find((n) => n.id === nodeId)?.label || "");
    setSelectedNodeId(nodeId);
  };

  return (
    <RoleGuard roles={allRoles}>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1 w-fit">
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "graph" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Share2 className="h-4 w-4" />
            Network Graph
          </button>
          <button
            onClick={() => setActiveTab("offenders")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "offenders" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="h-4 w-4" />
            Repeat Offenders
          </button>
          <button
            onClick={() => setActiveTab("associations")}
            className={`flex items-center gap-2 px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
              activeTab === "associations" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Share2 className="h-4 w-4" />
            Hidden Associations
          </button>
        </div>

        {/* Network Graph Tab */}
        {activeTab === "graph" && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Graph Area */}
            <div className="lg:col-span-3 bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden" style={{ height: "580px" }}>
              {/* Search Bar */}
              <div className="relative border-b border-gray-100">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search suspects, victims, cases, or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm focus:outline-none bg-transparent"
                />
                {searchQuery && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-b-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                    {searchResults.map((n) => (
                      <button
                        key={n.id}
                        onClick={() => handleSearchSelect(n.id)}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                      >
                        <span className={`w-2 h-2 rounded-full ${
                          n.type === "suspect" ? "bg-red-500" :
                          n.type === "victim" ? "bg-blue-500" :
                          n.type === "case" ? "bg-purple-500" :
                          "bg-green-500"
                        }`} />
                        <span className="font-medium">{n.label}</span>
                        <span className="text-xs text-gray-400 capitalize">{n.type}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Graph */}
              {graphLoading ? (
                <div className="h-[520px] flex items-center justify-center text-gray-400 text-sm">Loading network...</div>
              ) : graph ? (
                <div className="h-[520px]">
                  <NetworkGraph
                    nodes={graph.nodes}
                    edges={graph.edges}
                    searchQuery={searchQuery}
                    selectedNodeId={selectedNodeId}
                    onNodeClick={handleNodeClick}
                    onNodeHover={setHoveredNodeId}
                  />
                </div>
              ) : null}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Legend */}
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                <h3 className="font-semibold text-gray-800 text-sm mb-3">Legend</h3>
                <div className="space-y-2">
                  {[
                    { color: "bg-red-500", label: "Suspect / Accused" },
                    { color: "bg-blue-500", label: "Victim" },
                    { color: "bg-purple-500", label: "Case / FIR" },
                    { color: "bg-green-500", label: "Location" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="text-xs text-gray-600">{item.label}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5">
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-gray-400 inline-block" /> Involved In
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-gray-400 inline-block border-dashed" style={{ borderTop: "1.5px dashed #94A3B8", background: "transparent" }} /> Associated With
                  </p>
                  <p className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="w-6 h-0.5 bg-gray-300 inline-block border-dashed" style={{ borderTop: "1px dotted #CBD5E1", background: "transparent" }} /> Occurred At
                  </p>
                </div>
                <div className="mt-3 text-xs text-gray-400">
                  <p>Drag nodes to rearrange.</p>
                  <p>Scroll to zoom. Click a node for details.</p>
                </div>
              </div>

              {/* Selected Node Details */}
              {selectedNode && (
                <NodeDetails
                  node={selectedNode}
                  onClose={() => setSelectedNodeId(null)}
                />
              )}

              {/* Connections Summary */}
              {selectedNodeId && !graphLoading && graph && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
                  <h3 className="font-semibold text-gray-800 text-sm mb-2">Connections</h3>
                  <div className="space-y-1 text-sm">
                    <p className="text-gray-600">
                      Direct connections: <strong>{connectedNodes.length - 1}</strong>
                    </p>
                    <p className="text-gray-600">
                      Linked edges: <strong>{connectedEdges.length}</strong>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Repeat Offenders Tab */}
        {activeTab === "offenders" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Offender List */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Repeat Offenders</h3>
              {offendersLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : (
                <div className="space-y-2">
                  {offenders.map((offender, i) => (
                    <button
                      key={offender.personId}
                      onClick={() => setSelectedOffenderIndex(i)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedOffenderIndex === i
                          ? "border-ksp-blue bg-ksp-blue/5"
                          : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-800">{offender.accusedName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-medium">
                          {offender.caseCount} cases
                        </span>
                        <span className="text-xs text-gray-400">
                          {offender.linkedCases.length} jurisdictions
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Offender Detail */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              {offendersLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading...</div>
              ) : offenders.length > 0 ? (
                <RepeatOffenderProfile offender={offenders[selectedOffenderIndex]} />
              ) : (
                <div className="text-center py-8 text-gray-400 text-sm">No repeat offenders identified</div>
              )}
            </div>
          </div>
        )}

        {/* Hidden Associations Tab */}
        {activeTab === "associations" && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-800">Hidden Association Detection</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Connections between entities across different cases that would be impossible to spot in isolated records.
                </p>
              </div>
            </div>
            {assocLoading ? (
              <div className="text-center py-8 text-gray-400 text-sm">Analyzing hidden links...</div>
            ) : (
              <AssociationTable associations={associations} />
            )}
          </div>
        )}
      </div>
    </RoleGuard>
  );
}
