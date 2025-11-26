"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Download, Mail, Snowflake } from "lucide-react";
import Image from "next/image";
import type { GeneratedLetter } from "./santa-letter-form";

interface SantaLetterPreviewProps {
  generatedLetter: GeneratedLetter;
  onReset: () => void;
}

export function SantaLetterPreview({ generatedLetter, onReset }: SantaLetterPreviewProps) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const handlePrint = () => {
    // Temporarily change title to remove it from print header
    const originalTitle = document.title;
    document.title = ' ';
    
    // Add mobile print optimization
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Force viewport meta for print on mobile
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      const originalContent = viewportMeta?.getAttribute('content');
      if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
      }
      
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
          // Restore original viewport
          if (viewportMeta && originalContent) {
            viewportMeta.setAttribute('content', originalContent);
          }
        }, 100);
      }, 150);
    } else {
      // Desktop print
      setTimeout(() => {
        window.print();
        setTimeout(() => {
          document.title = originalTitle;
        }, 100);
      }, 100);
    }
  };

  const { letter, formData } = generatedLetter;

  return (
    <div className="w-full max-w-3xl space-y-4 md:space-y-6 print:space-y-0 print:max-w-full overflow-x-hidden">
      {/* Top Action Buttons - Visible before scrolling */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 no-print w-full">
        <Button
          onClick={handlePrint}
          size="lg"
          className="flex-1 bg-white hover:bg-red-50 text-red-600 border-4 border-red-600 hover:border-red-700 font-bold h-12 md:h-14 text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Print Letter
        </Button>
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 h-12 md:h-14 text-sm md:text-base"
        >
          <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Generate Another Letter
        </Button>
      </div>

      {/* Letter Card - Mobile Optimized & Print Ready */}
      <Card id="letter-to-print" className="christmas-border print:christmas-border shadow-xl bg-gradient-to-b from-white via-christmas-cream to-white print:shadow-none print:bg-white overflow-hidden print:w-full print:max-w-full">
        <CardContent className="p-4 md:p-6 lg:p-8 print:p-3">
          {/* Santa Sleigh Header Image */}
          <div className="flex justify-center mb-4 md:mb-6 print:mb-1">
            <Image
              src="/Asset1.png"
              alt="Santa's Sleigh with Reindeer"
              width={200}
              height={50}
              className="w-full max-w-xs md:max-w-sm print:max-w-[10rem] h-auto"
              priority
            />
          </div>

          {/* North Pole Header - Compact */}
          <div className="text-center mb-4 md:mb-5 print:mb-0.5 space-y-1 print:space-y-0">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1 print:mb-0 flex-wrap">
              <Snowflake className="h-4 w-4 md:h-6 md:w-6 print:h-3 print:w-3 text-primary animate-spin print:animate-none flex-shrink-0" style={{ animationDuration: "10s" }} />
              <h1 className="text-2xl md:text-4xl lg:text-5xl print:text-3xl text-primary break-words">Santa's Workshop</h1>
              <Snowflake className="h-4 w-4 md:h-6 md:w-6 print:h-3 print:w-3 text-primary animate-spin print:animate-none flex-shrink-0" style={{ animationDuration: "10s" }} />
            </div>
            <p className="text-sm md:text-base lg:text-lg print:text-sm text-secondary font-semibold break-words">The North Pole, Arctic Circle</p>
            <p className="text-xs md:text-sm print:text-xs text-muted-foreground">{currentDate}</p>
          </div>

          <Separator className="mb-4 print:mb-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Letter Content - Mobile Optimized with proper text wrapping */}
          <div className="space-y-3 md:space-y-4 print:space-y-0 text-base md:text-lg lg:text-xl print:text-lg leading-relaxed print:leading-snug text-foreground break-words overflow-wrap-anywhere max-w-full">
            {letter.split('\n').map((line, index) => {
              // Check if line is a signature or important line
              const isSantaSignature = line.includes('Santa Claus');
              const isClosing = line.includes('With love') || line.includes('With hope');
              const isPS = line.startsWith('P.S.');
              
              return (
                <div key={index}>
                  {/* Add signature image before Santa Claus name */}
                  {isSantaSignature && (
                    <div className="flex justify-start mt-4 md:mt-6 print:mt-0.5 mb-1 print:mb-0">
                      <Image
                        src="/signature.png"
                        alt="Santa's Signature"
                        width={150}
                        height={60}
                        className="w-32 md:w-40 print:w-20 h-auto"
                        priority
                      />
                    </div>
                  )}
                  <p 
                    className={`break-words overflow-wrap-anywhere max-w-full ${
                      isSantaSignature ? 'font-bold text-xl md:text-2xl print:text-lg text-primary' : 
                      isClosing ? 'font-semibold mt-4 md:mt-6 print:mt-1' :
                      isPS ? 'text-sm md:text-base print:text-xs italic' : 
                      ''
                    }`}
                  >
                    {line || '\u00A0'}
                  </p>
                </div>
              );
            })}
          </div>

          <Separator className="mt-6 md:mt-8 print:mt-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Footer Decoration - Compact */}
          <div className="mt-4 md:mt-6 print:mt-0.5 flex items-center justify-center gap-2 md:gap-4 print:gap-1 text-muted-foreground text-sm md:text-base print:text-xs">
            <Snowflake className="h-3 w-3 md:h-4 md:w-4 print:h-2 print:w-2" />
            <span>Delivered with Christmas Magic</span>
            <Snowflake className="h-3 w-3 md:h-4 md:w-4 print:h-2 print:w-2" />
          </div>
        </CardContent>
      </Card>

      {/* Bottom Action Buttons - Mobile Optimized */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4 no-print">
        <Button
          onClick={handlePrint}
          size="lg"
          className="flex-1 bg-white hover:bg-red-50 text-red-600 border-4 border-red-600 hover:border-red-700 font-bold h-12 md:h-14 text-sm md:text-base shadow-lg hover:shadow-xl transition-all"
        >
          <Download className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Print Letter
        </Button>
        <Button
          onClick={onReset}
          size="lg"
          variant="outline"
          className="flex-1 border-2 border-primary text-primary hover:bg-primary/10 h-12 md:h-14 text-sm md:text-base"
        >
          <Mail className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Generate Another Letter
        </Button>
      </div>

    </div>
  );
}

