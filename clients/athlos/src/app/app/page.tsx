import type { Metadata } from "next";
import CoachChat from "@/components/coach/CoachChat";
import "@/components/coach/coach.css";

export const metadata: Metadata = {
  title: "Coach — ATHLOS",
  description:
    "Tvoj AI trener. Zgrajen na protokolih Tima Drenovca. Zapomni si tvoje treninge in gradi vsak naslednji plan na prejšnjem.",
};

export default function AppPage() {
  return (
    <main className="coach-page">
      <CoachChat />
    </main>
  );
}
