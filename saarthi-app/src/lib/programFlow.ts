import programFlowRaw from "@/config/program.json?raw";

import { parseHomeFlowConfig } from "@/lib/homeFlow";

export const programFlowConfig = parseHomeFlowConfig(programFlowRaw);

export const programSimulationEnabled =
  String(
    import.meta.env.VITE_PROGRAM_SIMULATION_ENABLED || "true",
  ).toLowerCase() === "true";
