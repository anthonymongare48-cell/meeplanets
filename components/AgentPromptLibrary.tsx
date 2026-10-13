"use client";

import { useMemo, useState } from "react";

const promptGroups = [
  {
    id: "personas",
    title: "System persona & core directives",
    eyebrow: "01 / CONFIGURATION",
    description: "Set the agent's role, reasoning style, and response standards.",
    prompts: [
      {
        title: "The Analytical Systems Engineer",
        description: "A physics-grounded aerospace engineering and systems architecture persona.",
        prompt: "Act as a senior aerospace engineer and systems architect. Prioritize physics-grounded reasoning, telemetry data, and clear operational parameters. Never hallucinate sensor metrics—state assumptions explicitly when data is incomplete. Organize outputs into clear, labeled technical sections with minimal introductory filler.",
      },
      {
        title: "The High-Yield Research Partner",
        description: "Surface mechanisms, concrete parameters, and actionable conclusions.",
        prompt: "You are an expert research partner. For every query, surface the underlying mechanics first before summarizing high-level conclusions. Favor concrete parameters, edge cases, and actionable next steps over descriptive summaries. Keep responses concise, information-dense, and structured.",
      },
      {
        title: "The Strict Protocol Auditor",
        description: "Review a plan against feasibility, risk, and failure modes.",
        prompt: "You are an operational evaluator. Review my proposals or plans strictly against feasibility, risk factors, and failure modes. Highlight hidden assumptions, point out single points of failure, and provide counter-proposals to harden the system.",
      },
    ],
  },
  {
    id: "analysis",
    title: "Deep-dive analytical prompts",
    eyebrow: "02 / TASK EXECUTION",
    description: "Use these structures to investigate a technical topic or compare designs.",
    prompts: [
      {
        title: "Mechanisms & failure-mode analysis",
        description: "Break a system down from operating principles through performance metrics.",
        prompt: "Break down the core mechanisms governing [Topic/Subsystem]. Detail: (1) Primary operating principles, (2) Critical environmental or operational bottlenecks, (3) Common failure modes and mitigations, and (4) Three quantitative metrics that dictate overall performance.",
      },
      {
        title: "Comparative trade-off evaluation",
        description: "Compare two approaches against constraints and a specific goal.",
        prompt: "Compare [Approach A] versus [Approach B] for [Specific Goal]. Structure the evaluation in a comparison table evaluating efficiency, implementation complexity, failure tolerance, and scalability. Finish with a definitive recommendation based on resource constraints.",
      },
      {
        title: "First-principles breakdown",
        description: "Derive a complex concept from its governing laws.",
        prompt: "Explain [Complex Concept] from first principles. Start with the governing fundamental laws, derive the macro-level behavior step-by-step, and illustrate the concept using an edge-case scenario.",
      },
    ],
  },
  {
    id: "robustness",
    title: "Agent stress-testing & robustness",
    eyebrow: "03 / VALIDATION",
    description: "Probe arithmetic, degraded operation, and response precision.",
    prompts: [
      {
        title: "Premise verification challenge",
        description: "Check a proposed result against constraints and independent arithmetic.",
        prompt: "Calculate whether a system operating under [Parameter X] will achieve [Metric Y], given [Constraint Z]. Independently verify the arithmetic and physical constraints step-by-step before stating whether this configuration succeeds.",
      },
      {
        title: "Adversarial / corner-case probe",
        description: "Exercise the system under degraded telemetry and rising latency.",
        prompt: "Analyze the limits of this architecture under extreme degradation: what happens if primary sensor telemetry drops by 80% while ambient latency spikes? Outline the graceful degradation procedure.",
      },
      {
        title: "Conciseness & precision benchmark",
        description: "Enforce a measurable format with no filler.",
        prompt: "Summarize the operational profile of [Mission/System] in exactly 5 bullet points. Each bullet must contain at least one concrete numerical parameter and zero filler adjectives.",
      },
    ],
  },
  {
    id: "simulation",
    title: "Interactive simulation & workflow builders",
    eyebrow: "04 / SIMULATION",
    description: "Generate structured mission telemetry or a runnable simulation module.",
    prompts: [
      {
        title: "Mission telemetry simulator",
        description: "Create a sequence of vehicle readings that ends with an anomaly to triage.",
        prompt: "Simulate a live telemetry stream for a probe approaching [Target Body/Orbit]. Provide 4 sequential updates detailing altitude, velocity, thermal load, and primary sensor health, concluding with an anomaly event that requires user triage.",
      },
      {
        title: "Code / module generator",
        description: "Request a self-contained Python simulation with formulas and sample output.",
        prompt: "Write a standalone, self-contained Python module that simulates [Phenomenon/Process]. Include modular parameter definitions, docstrings explaining the governing formulas, and a minimal execution block displaying sample output.",
      },
    ],
  },
] as const;

type PromptItem = (typeof promptGroups)[number]["prompts"][number];

export function AgentPromptLibrary() {
  const [activeGroup, setActiveGroup] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copiedTitle, setCopiedTitle] = useState<string | null>(null);
  const [copyError, setCopyError] = useState<{ title: string; prompt: string } | null>(null);

  const visibleGroups = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return promptGroups
      .filter((group) => activeGroup === "all" || group.id === activeGroup)
      .map((group) => ({
        ...group,
        prompts: group.prompts.filter((item) =>
          !normalizedQuery
          || `${item.title} ${item.description} ${item.prompt}`.toLowerCase().includes(normalizedQuery),
        ),
      }))
      .filter((group) => group.prompts.length > 0);
  }, [activeGroup, query]);

  async function copyPrompt(item: PromptItem) {
    setCopiedTitle(null);
    setCopyError(null);
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopiedTitle(item.title);
    } catch (error) {
      console.error("Unable to copy the prompt to the clipboard.", error);
      setCopyError({ title: item.title, prompt: item.prompt });
    }
  }

  return (
    <div className="prompt-library">
      <section className="prompt-library__toolbar" aria-label="Filter prompt library">
        <label className="prompt-library__search">
          <span>SEARCH PROMPTS</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try: telemetry, failure, Python…"
          />
        </label>
        <div className="prompt-library__filters" aria-label="Prompt categories">
          <button type="button" aria-pressed={activeGroup === "all"} onClick={() => setActiveGroup("all")}>ALL PROMPTS</button>
          {promptGroups.map((group) => (
            <button
              type="button"
              key={group.id}
              aria-pressed={activeGroup === group.id}
              onClick={() => setActiveGroup(group.id)}
            >
              {group.eyebrow.split(" / ")[1]}
            </button>
          ))}
        </div>
      </section>

      <p className="prompt-library__count" aria-live="polite">
        {visibleGroups.reduce((count, group) => count + group.prompts.length, 0)} PROMPTS · SELECT COPY TO USE ONE
      </p>

      {visibleGroups.length > 0 ? visibleGroups.map((group) => (
        <section className="prompt-group" key={group.id} aria-labelledby={`prompt-group-${group.id}`}>
          <header className="prompt-group__heading">
            <div><span className="eyebrow">{group.eyebrow}</span><h2 id={`prompt-group-${group.id}`}>{group.title}</h2></div>
            <p>{group.description}</p>
          </header>
          <div className="prompt-group__grid">
            {group.prompts.map((item) => (
              <article className="prompt-card" key={item.title}>
                <div className="prompt-card__heading">
                  <span className="prompt-card__index">{String(group.prompts.indexOf(item) + 1).padStart(2, "0")}</span>
                  <h3>{item.title}</h3>
                </div>
                <p className="prompt-card__description">{item.description}</p>
                <blockquote>{item.prompt}</blockquote>
                {copyError?.title === item.title && (
                  <label className="prompt-card__copy-fallback">
                    Clipboard unavailable — select and copy this prompt:
                    <textarea readOnly value={copyError.prompt} onFocus={(event) => event.currentTarget.select()} />
                  </label>
                )}
                <button className="prompt-card__copy" type="button" onClick={() => void copyPrompt(item)}>
                  {copiedTitle === item.title ? "COPIED TO CLIPBOARD ✓" : "COPY PROMPT ↗"}
                </button>
              </article>
            ))}
          </div>
        </section>
      )) : (
        <p className="prompt-library__empty" role="status">No prompts match that search. Try a different keyword or category.</p>
      )}
    </div>
  );
}
