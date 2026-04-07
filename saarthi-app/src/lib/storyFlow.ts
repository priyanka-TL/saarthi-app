import storyFlowRaw from "@/config/story.json?raw";

import { parseHomeFlowConfig } from "@/lib/homeFlow";

export const storyFlowConfig = parseHomeFlowConfig(storyFlowRaw);

export const storySimulationEnabled =
  String(
    import.meta.env.VITE_STORY_SIMULATION_ENABLED || "true",
  ).toLowerCase() === "true";
