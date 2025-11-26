"use client";

import { useState, useEffect } from "react";
import { SantaLetterForm, type GeneratedLetter } from "@/components/santa-letter-form";
import { SantaLetterPreview } from "@/components/santa-letter-preview";
import { Snowflake, Sparkles } from "lucide-react";

export default function Home() {
  const [generatedLetter, setGeneratedLetter] = useState<GeneratedLetter | null>(null);
  const [showLetter, setShowLetter] = useState(false);

  // Restore state from sessionStorage on mount (for mobile browser recovery)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('santaLetter');
      if (saved) {
        const data = JSON.parse(saved) as GeneratedLetter;
        setGeneratedLetter(data);
        setShowLetter(true);
      }
    } catch (e) {
      console.warn('Could not restore from sessionStorage:', e);
    }
  }, []);

  const handleGenerateLetter = (data: GeneratedLetter) => {
    setGeneratedLetter(data);
    setShowLetter(true);
    
    // Defer scroll to after render completes (critical for mobile)
    requestAnimationFrame(() => {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }, 100);
    });
  };

  const handleReset = () => {
    setShowLetter(false);
    setGeneratedLetter(null);
    
    // Clear sessionStorage when resetting
    try {
      sessionStorage.removeItem('santaLetter');
    } catch (e) {
      console.warn('Could not clear sessionStorage:', e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-christmas-cream to-background overflow-x-hidden w-full">
      {/* Decorative Background Elements - Mobile Optimized */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 w-full">
        <Snowflake className="absolute top-4 left-4 md:top-10 md:left-10 h-8 w-8 md:h-12 md:w-12 text-primary/20 animate-spin snowflake-glow" style={{ animationDuration: "20s" }} />
        <Snowflake className="absolute top-20 right-8 md:top-32 md:right-20 h-10 w-10 md:h-16 md:w-16 text-secondary/20 animate-spin snowflake-glow" style={{ animationDuration: "15s" }} />
        <Snowflake className="absolute bottom-32 left-8 md:bottom-20 md:left-1/4 h-6 w-6 md:h-10 md:w-10 text-accent/30 animate-spin snowflake-glow" style={{ animationDuration: "25s" }} />
        <Snowflake className="absolute bottom-48 right-4 md:bottom-40 md:right-1/3 h-8 w-8 md:h-14 md:w-14 text-primary/15 animate-spin snowflake-glow" style={{ animationDuration: "18s" }} />
        <Sparkles className="absolute top-1/3 right-1/4 h-6 w-6 text-accent/25 float-animation" style={{ animationDelay: "0.5s" }} />
        <Sparkles className="absolute bottom-1/3 left-1/3 h-5 w-5 text-primary/20 float-animation" style={{ animationDelay: "1.5s" }} />
      </div>

      {/* Main Content */}
      <main className="relative z-10 flex flex-col items-center px-4 pt-3 pb-6 md:pt-4 md:pb-12 w-full max-w-full overflow-x-hidden">
        {/* Header - Mobile Optimized */}
        <header className="text-center mb-4 md:mb-6 space-y-2 md:space-y-4">
          {/* Logo */}
          <div className="flex justify-center mb-3 md:mb-6">
            <img 
              src="/logo.jpg" 
              alt="SantaScribe Logo" 
              className="h-16 w-16 md:h-24 md:w-24 lg:h-32 lg:w-32 object-contain drop-shadow-lg"
            />
          </div>
          
          <div className="flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-4">
            <Sparkles className="h-6 w-6 md:h-10 md:w-10 text-accent float-animation" />
            <h1 className="text-3xl md:text-6xl lg:text-7xl text-primary drop-shadow-lg">
              SantaScribe
            </h1>
            <Sparkles className="h-6 w-6 md:h-10 md:w-10 text-accent float-animation" style={{ animationDelay: "1s" }} />
          </div>
          <p className="text-base md:text-xl lg:text-2xl text-secondary font-semibold px-2">
            ✨ Create Magical Letters from Santa ✨
          </p>
          <p className="text-sm md:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2 leading-relaxed">
            Bring the wonder of Christmas to life with personalized letters from the North Pole!
          </p>
        </header>

        {/* Form or Letter Preview */}
        <div className="w-full flex justify-center mb-8 md:mb-12">
          {!showLetter ? (
            <SantaLetterForm onGenerate={handleGenerateLetter} />
          ) : generatedLetter ? (
            <SantaLetterPreview generatedLetter={generatedLetter} onReset={handleReset} />
          ) : null}
        </div>

        {/* Footer - Mobile Optimized */}
        <footer className="text-center text-xs md:text-sm text-muted-foreground mt-auto pt-8 md:pt-12 px-4">
          <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1.5 md:mb-2 flex-wrap">
            <Snowflake className="h-3 w-3 md:h-4 md:w-4" />
            <p className="text-xs md:text-sm">Made with ❤️ and Christmas magic</p>
            <Snowflake className="h-3 w-3 md:h-4 md:w-4" />
          </div>
          <p className="text-[10px] md:text-xs">© {new Date().getFullYear()} SantaScribe. Spreading joy, one letter at a time.</p>
        </footer>
      </main>
    </div>
  );
}
