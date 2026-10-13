import "./prompt-library.css";
import { AgentPromptLibrary } from "@/components/AgentPromptLibrary";
import { SectionHeading } from "@/components/SectionHeading";

export default function AgentPromptsPage() {
  return (
    <div className="page prompt-library-page">
      <SectionHeading eyebrow="MISSION TOOLKIT / 015" title="Agent prompt library">
        Configure an analytical partner, investigate technical systems, test robustness, and build simulation workflows with reusable prompts.
      </SectionHeading>
      <AgentPromptLibrary />
    </div>
  );
}
