import commonsFlowRaw from "@/config/commons.json?raw";

import { parseHomeFlowConfig } from "@/lib/homeFlow";

export const commonsFlowConfig = parseHomeFlowConfig(commonsFlowRaw);

export const commonsSimulationEnabled =
  String(
    import.meta.env.VITE_COMMONS_SIMULATION_ENABLED || "true",
  ).toLowerCase() === "true";
