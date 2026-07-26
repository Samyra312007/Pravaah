import type { NetworkGraph, RepeatOffender, Association } from "@/types/network";

export function generateMockNetworkGraph(): NetworkGraph {
  const nodes = [
    { id: "sus-1", label: "Ramesh Kumar", type: "suspect" as const, data: { age: 34, mo: "Burglary via ventilation shafts, typically between 2-4 AM", cases: 4 } },
    { id: "sus-2", label: "Suresh Patel", type: "suspect" as const, data: { age: 28, mo: "Chain snatching on motorbike, afternoon hours", cases: 3 } },
    { id: "sus-3", label: "Venkatesh Rao", type: "suspect" as const, data: { age: 45, mo: "Cyber fraud via fake banking portals", cases: 6 } },
    { id: "sus-4", label: "Manjunath Gowda", type: "suspect" as const, data: { age: 31, mo: "Vehicle theft, cross-border operation", cases: 2 } },
    { id: "sus-5", label: "Kavita Sharma", type: "suspect" as const, data: { age: 26, mo: "Identity theft for loan fraud", cases: 3 } },
    { id: "sus-6", label: "Prakash Shetty", type: "suspect" as const, data: { age: 39, mo: "Organized property theft ring", cases: 5 } },
    { id: "vic-1", label: "Mohan Lal", type: "victim" as const, data: { age: 52 } },
    { id: "vic-2", label: "Priya Srinivas", type: "victim" as const, data: { age: 29 } },
    { id: "vic-3", label: "Anita Desai", type: "victim" as const, data: { age: 41 } },
    { id: "vic-4", label: "Rajesh Hegde", type: "victim" as const, data: { age: 37 } },
    { id: "vic-5", label: "Sneha Reddy", type: "victim" as const, data: { age: 33 } },
    { id: "vic-6", label: "Vikram Joseph", type: "victim" as const, data: { age: 48 } },
    { id: "case-1", label: "FIR-001/2026", type: "case" as const, data: { crimeNo: "104430006202600001", crimeGroup: "Crimes Against Property", status: "Under Investigation", date: "2026-01-15" } },
    { id: "case-2", label: "FIR-002/2026", type: "case" as const, data: { crimeNo: "104430006202600002", crimeGroup: "Crimes Against Property", status: "Charge Sheeted", date: "2026-02-03" } },
    { id: "case-3", label: "FIR-003/2026", type: "case" as const, data: { crimeNo: "104430006202600003", crimeGroup: "Cyber Crimes", status: "Under Investigation", date: "2026-02-20" } },
    { id: "case-4", label: "FIR-004/2026", type: "case" as const, data: { crimeNo: "104430006202600004", crimeGroup: "Crimes Against Women", status: "Trial", date: "2026-03-10" } },
    { id: "case-5", label: "FIR-005/2025", type: "case" as const, data: { crimeNo: "104430006202500005", crimeGroup: "Crimes Against Property", status: "Closed", date: "2025-11-22" } },
    { id: "case-6", label: "FIR-006/2026", type: "case" as const, data: { crimeNo: "104430006202600006", crimeGroup: "Economic Offences", status: "Under Investigation", date: "2026-04-05" } },
    { id: "case-7", label: "FIR-007/2026", type: "case" as const, data: { crimeNo: "104430006202600007", crimeGroup: "Cyber Crimes", status: "Charge Sheeted", date: "2026-04-18" } },
    { id: "loc-1", label: "Koramangala", type: "location" as const, data: { district: "Bengaluru Urban" } },
    { id: "loc-2", label: "Yeshwanthpur", type: "location" as const, data: { district: "Bengaluru Urban" } },
    { id: "loc-3", label: "Mysuru North", type: "location" as const, data: { district: "Mysuru" } },
    { id: "loc-4", label: "Whitefield", type: "location" as const, data: { district: "Bengaluru Urban" } },
  ];

  const edges = [
    // Ramesh connections
    { source: "sus-1", target: "case-1", type: "involved-in" as const, label: "Primary Accused" },
    { source: "sus-1", target: "case-5", type: "involved-in" as const, label: "Primary Accused" },
    { source: "sus-1", target: "loc-1", type: "occurred-at" as const },
    { source: "sus-1", target: "vic-1", type: "associated-with" as const, label: "Victim" },
    // Suresh connections
    { source: "sus-2", target: "case-2", type: "involved-in" as const, label: "Accused" },
    { source: "sus-2", target: "loc-2", type: "occurred-at" as const },
    { source: "sus-2", target: "vic-2", type: "associated-with" as const, label: "Victim" },
    // Venkatesh connections
    { source: "sus-3", target: "case-3", type: "involved-in" as const, label: "Primary Accused" },
    { source: "sus-3", target: "case-7", type: "involved-in" as const, label: "Primary Accused" },
    { source: "sus-3", target: "loc-4", type: "occurred-at" as const },
    { source: "sus-3", target: "vic-3", type: "associated-with" as const, label: "Victim" },
    // Manjunath connections
    { source: "sus-4", target: "case-4", type: "involved-in" as const, label: "Accused" },
    { source: "sus-4", target: "loc-3", type: "occurred-at" as const },
    { source: "sus-4", target: "vic-4", type: "associated-with" as const, label: "Victim" },
    // Kavita connections
    { source: "sus-5", target: "case-6", type: "involved-in" as const, label: "Primary Accused" },
    { source: "sus-5", target: "case-7", type: "involved-in" as const, label: "Co-Accused" },
    { source: "sus-5", target: "loc-1", type: "occurred-at" as const },
    { source: "sus-5", target: "vic-5", type: "associated-with" as const, label: "Victim" },
    // Prakash connections (mastermind - connected to multiple)
    { source: "sus-6", target: "case-1", type: "involved-in" as const, label: "Co-Accused" },
    { source: "sus-6", target: "case-2", type: "involved-in" as const, label: "Co-Accused" },
    { source: "sus-6", target: "case-5", type: "involved-in" as const, label: "Co-Accused" },
    { source: "sus-6", target: "vic-6", type: "associated-with" as const, label: "Victim" },
    { source: "sus-6", target: "loc-2", type: "occurred-at" as const },
    // Case-location edges
    { source: "case-1", target: "loc-1", type: "occurred-at" as const },
    { source: "case-2", target: "loc-2", type: "occurred-at" as const },
    { source: "case-3", target: "loc-4", type: "occurred-at" as const },
    { source: "case-4", target: "loc-3", type: "occurred-at" as const },
    { source: "case-5", target: "loc-1", type: "occurred-at" as const },
    { source: "case-6", target: "loc-1", type: "occurred-at" as const },
    { source: "case-7", target: "loc-4", type: "occurred-at" as const },
    // Victim-case edges
    { source: "vic-1", target: "case-1", type: "associated-with" as const },
    { source: "vic-2", target: "case-2", type: "associated-with" as const },
    { source: "vic-3", target: "case-3", type: "associated-with" as const },
    { source: "vic-4", target: "case-4", type: "associated-with" as const },
    { source: "vic-5", target: "case-6", type: "associated-with" as const },
    { source: "vic-6", target: "case-5", type: "associated-with" as const },
    // Cross-connections (hidden associations)
    { source: "sus-1", target: "sus-6", type: "associated-with" as const, label: "Co-conspirator" },
    { source: "sus-2", target: "sus-6", type: "associated-with" as const, label: "Co-conspirator" },
    { source: "sus-3", target: "sus-5", type: "associated-with" as const, label: "Cyber ring" },
    { source: "sus-6", target: "loc-1", type: "occurred-at" as const },
  ];

  return { nodes, edges };
}

export function generateMockRepeatOffenders(): RepeatOffender[] {
  return [
    {
      accusedName: "Ramesh Kumar",
      personId: 1,
      caseCount: 4,
      linkedCases: [
        { caseId: 1, crimeNo: "104430006202600001", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2026-01-15" },
        { caseId: 5, crimeNo: "104430006202500005", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2025-11-22" },
        { caseId: 8, crimeNo: "104430006202400008", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2024-08-10" },
        { caseId: 12, crimeNo: "304430006202300012", district: "Bengaluru Rural", crimeGroup: "Crimes Against Property", registeredDate: "2023-05-04" },
      ],
      commonMO: "Burglary via ventilation shafts between 2-4 AM. Targets ground-floor commercial establishments. Uses bolt cutters and avoids alarm systems.",
      lastKnownLocation: "Koramangala, Bengaluru Urban",
    },
    {
      accusedName: "Venkatesh Rao",
      personId: 3,
      caseCount: 6,
      linkedCases: [
        { caseId: 3, crimeNo: "104430006202600003", district: "Bengaluru Urban", crimeGroup: "Cyber Crimes", registeredDate: "2026-02-20" },
        { caseId: 7, crimeNo: "104430006202600007", district: "Bengaluru Urban", crimeGroup: "Cyber Crimes", registeredDate: "2026-04-18" },
        { caseId: 9, crimeNo: "104430006202500009", district: "Bengaluru Urban", crimeGroup: "Economic Offences", registeredDate: "2025-07-14" },
        { caseId: 10, crimeNo: "404430006202400010", district: "Mysuru", crimeGroup: "Cyber Crimes", registeredDate: "2024-12-01" },
        { caseId: 13, crimeNo: "104430006202400013", district: "Bengaluru Urban", crimeGroup: "Cyber Crimes", registeredDate: "2024-03-19" },
        { caseId: 14, crimeNo: "804430006202300014", district: "Hubballi-Dharwad", crimeGroup: "Economic Offences", registeredDate: "2023-09-28" },
      ],
      commonMO: "Phishing attacks via fake banking portals. Creates lookalike URLs of major banks and sends SMS blasts. Mules used for fund transfers.",
      lastKnownLocation: "Whitefield, Bengaluru Urban",
    },
    {
      accusedName: "Prakash Shetty",
      personId: 6,
      caseCount: 5,
      linkedCases: [
        { caseId: 1, crimeNo: "104430006202600001", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2026-01-15" },
        { caseId: 2, crimeNo: "104430006202600002", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2026-02-03" },
        { caseId: 5, crimeNo: "104430006202500005", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2025-11-22" },
        { caseId: 11, crimeNo: "104430006202400011", district: "Bengaluru Urban", crimeGroup: "Crimes Against Property", registeredDate: "2024-06-30" },
        { caseId: 15, crimeNo: "304430006202300015", district: "Shivamogga", crimeGroup: "Crimes Against Property", registeredDate: "2023-12-12" },
      ],
      commonMO: "Organized property theft ring operator. Fences stolen goods through multiple channels. Uses minors for execution to evade serious penalties.",
      lastKnownLocation: "Yeshwanthpur, Bengaluru Urban",
    },
    {
      accusedName: "Kavita Sharma",
      personId: 5,
      caseCount: 3,
      linkedCases: [
        { caseId: 6, crimeNo: "104430006202600006", district: "Bengaluru Urban", crimeGroup: "Economic Offences", registeredDate: "2026-04-05" },
        { caseId: 7, crimeNo: "104430006202600007", district: "Bengaluru Urban", crimeGroup: "Cyber Crimes", registeredDate: "2026-04-18" },
        { caseId: 16, crimeNo: "104430006202500016", district: "Bengaluru Urban", crimeGroup: "Economic Offences", registeredDate: "2025-10-05" },
      ],
      commonMO: "Identity theft for loan fraud. Uses stolen Aadhaar and PAN details to apply for small-ticket personal loans. Operates through e-wallet accounts.",
      lastKnownLocation: "Koramangala, Bengaluru Urban",
    },
  ];
}

export function generateMockAssociations(): Association[] {
  return [
    { sourceEntity: "Ramesh Kumar", sourceType: "suspect", targetEntity: "Prakash Shetty", targetType: "suspect", associationType: "Co-Conspirator — Property Ring", strength: 0.85, casesInCommon: 3 },
    { sourceEntity: "Suresh Patel", sourceType: "suspect", targetEntity: "Prakash Shetty", targetType: "suspect", associationType: "Co-Conspirator — Property Ring", strength: 0.72, casesInCommon: 2 },
    { sourceEntity: "Venkatesh Rao", sourceType: "suspect", targetEntity: "Kavita Sharma", targetType: "suspect", associationType: "Digital Fraud Network", strength: 0.68, casesInCommon: 2 },
    { sourceEntity: "Ramesh Kumar", sourceType: "suspect", targetEntity: "Mohan Lal", targetType: "victim", associationType: "Repeat Victimization — Same MO", strength: 0.45, casesInCommon: 2 },
    { sourceEntity: "Venkatesh Rao", sourceType: "suspect", targetEntity: "Anita Desai", targetType: "victim", associationType: "Cyber Fraud — Phishing", strength: 0.55, casesInCommon: 1 },
    { sourceEntity: "Prakash Shetty", sourceType: "suspect", targetEntity: "Koramangala", targetType: "location", associationType: "Crime Hotspot — Multiple Incidents", strength: 0.78, casesInCommon: 4 },
    { sourceEntity: "Kavita Sharma", sourceType: "suspect", targetEntity: "Whitefield", targetType: "location", associationType: "Operation Base", strength: 0.62, casesInCommon: 2 },
    { sourceEntity: "Manjunath Gowda", sourceType: "suspect", targetEntity: "Mysuru North", targetType: "location", associationType: "Cross-Border Operation", strength: 0.51, casesInCommon: 1 },
  ];
}
