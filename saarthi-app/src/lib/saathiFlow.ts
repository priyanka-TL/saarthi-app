import saathiFlowRaw from "@/config/saathi.json?raw";

import { parseHomeFlowConfig } from "@/lib/homeFlow";

export const saathiFlowConfig = parseHomeFlowConfig(saathiFlowRaw);

export const saathiSimulationEnabled =
  String(
    import.meta.env.VITE_SAATHI_SIMULATION_ENABLED || "true",
  ).toLowerCase() === "true";
