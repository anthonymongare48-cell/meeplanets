import { MissionSandbox } from "@/components/FrontierSuite";
import { LiveMissionPanel } from "@/components/LiveMissionPanel";
export default function MissionControlPage() { return <div className="page"><div className="section-heading"><span className="eyebrow">OPERATIONS / 009</span><h1>Mission <em>Control</em></h1><p>Write safe, repeatable commands for a probe or rover and watch its route resolve in real time.</p></div><LiveMissionPanel /><MissionSandbox /></div>; }
