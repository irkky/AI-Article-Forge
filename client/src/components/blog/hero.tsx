import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Hero_background_workspace_image_0e1918cc.png";

export function Hero() {
  return (
    <section className="relative h-[70vh] min-h-[500px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      
      <div className="relative h-full flex items-center justify-center px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-6" data-testid="text-hero-title">
            AI-Powered Blog Platform
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-2xl mx-auto" data-testid="text-hero-subtitle">
            Generate intelligent, well-researched articles instantly with the power of AI
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/blog" data-testid="link-explore-articles">
              <Button 
                size="lg" 
                className="backdrop-blur-md bg-white/90 hover:bg-white text-foreground border border-white/20"
              >
                Explore Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin" data-testid="link-admin-dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="backdrop-blur-md bg-black/20 hover:bg-black/30 text-white border-white/30"
              >
                Admin Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
