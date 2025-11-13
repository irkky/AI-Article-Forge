import { Hero } from "@/components/blog/hero";
import { Navigation } from "@/components/blog/navigation";
import { Footer } from "@/components/blog/footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        <Hero />
      </main>
      <Footer />
    </div>
  );
}
