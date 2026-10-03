"use client";
import { useState } from "react";
import { SectionHeading } from "@/components/SectionHeading";

const questions = [{ prompt: "Which planet has the most moons?", options: ["Earth", "Jupiter", "Mars", "Venus"], answer: "Jupiter" }, { prompt: "What is the name of our galaxy?", options: ["Andromeda", "The Sombrero", "Milky Way", "Whirlpool"], answer: "Milky Way" }, { prompt: "Which world is known as the Red Planet?", options: ["Mars", "Mercury", "Neptune", "Saturn"], answer: "Mars" }];
export default function QuizPage() {
  const [step, setStep] = useState(0); const [score, setScore] = useState(0);
  if (step >= questions.length) return <div className="page quiz-page"><SectionHeading eyebrow="MISSION COMPLETE" title={`${score} / ${questions.length}`}>Your observational log has been recorded.</SectionHeading><button className="button" onClick={() => { setStep(0); setScore(0); }}>RESTART SIGNAL</button></div>;
  const question = questions[step];
  return <div className="page quiz-page"><SectionHeading eyebrow={`KNOWLEDGE CHECK / 00${step + 1}`} title="Test your signal">Three questions. No pressure, explorer.</SectionHeading><div className="quiz-card"><h2>{question.prompt}</h2><div className="options">{question.options.map((option) => <button key={option} onClick={() => { if (option === question.answer) setScore(score + 1); setStep(step + 1); }}>{option}<span>↗</span></button>)}</div></div></div>;
}
