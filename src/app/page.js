import TopBar from "@/components/TopBar";
import NavBar from "@/components/NavBar";
import Hero from "@/components/Hero"
import QuickAccess from "@/components/QuickAccess";
import Stats from "@/components/Stats";

export default function Home() {
  return (
      <main className="min-h-screen bg-neutral-900 text-white">
      <TopBar />
      <NavBar />
      <Hero />
      <QuickAccess />
      <Stats />

    </main>
  );
}
