import homeFlowRaw from "@/config/homeFlow.json?raw";
import type {
  DemoScript,
  DemoStep,
  DemoUserStep,
  HomeFlowConfig,
  ResolvedRouteMatch,
  RouteContext,
  RoutedFlowKey,
  RoutingRule,
} from "@/types/homeFlow";

const routedFlows: RoutedFlowKey[] = [
  "capture",
  "insights",
  "recommendations",
  "improvement",
  "story",
  "companion",
  "program",
];

const defaultConfig: HomeFlowConfig = {
  version: 1,
  defaultContextId: "listening-general",
  defaultScriptId: "story-to-saathi-demo",
  contexts: [
    {
      id: "listening-general",
      label: "Listening at Scale Context",
      subLabel: "Capture discussions",
      flow: "capture",
    },
    {
      id: "listening-story",
      label: "Listening at Scale Context",
      subLabel: "Story capture",
      flow: "story",
    },
    {
      id: "saathi-support",
      label: "Saathi",
      flow: "companion",
    },
  ],
  routingRules: [
    {
      id: "story-capture-intent",
      phrases: ["i need to record a story", "record a story", "story capture"],
      targetContextId: "listening-story",
      notice:
        "Context switched to Listening at Scale Context. Sub-context set to Story capture.",
    },
    {
      id: "issue-support-intent",
      phrases: [
        "i am facing an issue",
        "i'm facing an issue",
        "facing an issue",
        "issue with",
      ],
      targetContextId: "saathi-support",
      notice: "Context switched to Saathi.",
    },
  ],
  demoScripts: [
    {
      id: "story-to-saathi-demo",
      title: "Story Capture to Saathi",
      steps: [
        {
          id: "story-intent",
          type: "user",
          text: "I need to record a story",
          typingMsPerChar: 24,
          postDelayMs: 700,
        },
        {
          id: "issue-intent",
          type: "user",
          text: "I am facing an issue with low student engagement",
          typingMsPerChar: 20,
          postDelayMs: 700,
        },
      ],
    },
  ],
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parsePositiveNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0
    ? value
    : undefined;
}

function parseFlow(value: unknown): RoutedFlowKey | null {
  if (typeof value !== "string") {
    return null;
  }

  return routedFlows.includes(value as RoutedFlowKey)
    ? (value as RoutedFlowKey)
    : null;
}

function parseContext(value: unknown): RouteContext | null {
  if (!isObject(value)) {
    return null;
  }

  if (typeof value.id !== "string" || typeof value.label !== "string") {
    return null;
  }

  const flow = parseFlow(value.flow);
  if (!flow) {
    return null;
  }

  return {
    id: value.id,
    label: value.label,
    subLabel: typeof value.subLabel === "string" ? value.subLabel : undefined,
    flow,
  };
}

function parseRule(
  value: unknown,
  contexts: RouteContext[],
): RoutingRule | null {
  if (!isObject(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    !Array.isArray(value.phrases) ||
    typeof value.targetContextId !== "string" ||
    typeof value.notice !== "string"
  ) {
    return null;
  }

  const phrases = value.phrases.filter(
    (entry): entry is string =>
      typeof entry === "string" && entry.trim().length > 0,
  );
  if (phrases.length === 0) {
    return null;
  }

  const contextExists = contexts.some(
    (context) => context.id === value.targetContextId,
  );
  if (!contextExists) {
    return null;
  }

  return {
    id: value.id,
    phrases,
    targetContextId: value.targetContextId,
    notice: value.notice,
  };
}

function parseStep(value: unknown): DemoStep | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.type !== "string" ||
    typeof value.text !== "string"
  ) {
    return null;
  }

  const postDelayMs = parsePositiveNumber(value.postDelayMs);

  if (value.type === "user") {
    const step: DemoUserStep = {
      id: value.id,
      type: "user",
      text: value.text,
      typingMsPerChar: parsePositiveNumber(value.typingMsPerChar),
      postDelayMs,
      skipEngineResponse:
        typeof value.skipEngineResponse === "boolean"
          ? value.skipEngineResponse
          : undefined,
    };
    return step;
  }

  if (value.type === "assistant") {
    return {
      id: value.id,
      type: "assistant",
      text: value.text,
      postDelayMs,
    };
  }

  return null;
}

function parseScript(value: unknown): DemoScript | null {
  if (
    !isObject(value) ||
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    !Array.isArray(value.steps)
  ) {
    return null;
  }

  const steps = value.steps
    .map((step) => parseStep(step))
    .filter((step): step is DemoStep => Boolean(step));
  if (steps.length === 0) {
    return null;
  }

  return {
    id: value.id,
    title: value.title,
    steps,
  };
}

export function parseHomeFlowConfig(raw: string): HomeFlowConfig {
  try {
    const parsed = JSON.parse(raw) as unknown;

    if (!isObject(parsed)) {
      return defaultConfig;
    }

    const parsedContexts = Array.isArray(parsed.contexts)
      ? parsed.contexts
          .map((context) => parseContext(context))
          .filter((context): context is RouteContext => Boolean(context))
      : [];
    const contexts =
      parsedContexts.length > 0 ? parsedContexts : defaultConfig.contexts;

    const parsedRules = Array.isArray(parsed.routingRules)
      ? parsed.routingRules
          .map((rule) => parseRule(rule, contexts))
          .filter((rule): rule is RoutingRule => Boolean(rule))
      : [];
    const routingRules =
      parsedRules.length > 0 ? parsedRules : defaultConfig.routingRules;

    const parsedScripts = Array.isArray(parsed.demoScripts)
      ? parsed.demoScripts
          .map((script) => parseScript(script))
          .filter((script): script is DemoScript => Boolean(script))
      : [];
    const demoScripts =
      parsedScripts.length > 0 ? parsedScripts : defaultConfig.demoScripts;

    const defaultContextId =
      typeof parsed.defaultContextId === "string" &&
      contexts.some((context) => context.id === parsed.defaultContextId)
        ? parsed.defaultContextId
        : contexts[0].id;

    const defaultScriptId =
      typeof parsed.defaultScriptId === "string" &&
      demoScripts.some((script) => script.id === parsed.defaultScriptId)
        ? parsed.defaultScriptId
        : demoScripts[0].id;

    return {
      version:
        typeof parsed.version === "number" && Number.isFinite(parsed.version)
          ? parsed.version
          : 1,
      defaultContextId,
      defaultScriptId,
      contexts,
      routingRules,
      demoScripts,
    };
  } catch {
    return defaultConfig;
  }
}

export const homeFlowConfig = parseHomeFlowConfig(homeFlowRaw);

export const homeSimulationEnabled =
  String(
    import.meta.env.VITE_HOME_SIMULATION_ENABLED || "true",
  ).toLowerCase() === "true";

export function getDefaultRouteContext(
  config: HomeFlowConfig = homeFlowConfig,
) {
  return (
    config.contexts.find((context) => context.id === config.defaultContextId) ??
    config.contexts[0]
  );
}

export function getDemoScriptById(
  id: string,
  config: HomeFlowConfig = homeFlowConfig,
) {
  return config.demoScripts.find((script) => script.id === id) ?? null;
}

export function resolveRouteMatch(
  input: string,
  config: HomeFlowConfig = homeFlowConfig,
): ResolvedRouteMatch | null {
  const normalizedInput = normalize(input);

  for (const rule of config.routingRules) {
    const matches = rule.phrases.some((phrase) =>
      normalizedInput.includes(normalize(phrase)),
    );
    if (!matches) {
      continue;
    }

    const context = config.contexts.find(
      (candidate) => candidate.id === rule.targetContextId,
    );
    if (!context) {
      continue;
    }

    return { rule, context };
  }

  return null;
}

function normalize(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}
