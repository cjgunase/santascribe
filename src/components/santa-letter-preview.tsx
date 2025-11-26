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
    
    // Small delay to ensure title change takes effect
    setTimeout(() => {
      window.print();
      // Restore original title after print dialog
      setTimeout(() => {
        document.title = originalTitle;
      }, 100);
    }, 100);
  };

  const { letter, formData } = generatedLetter;

  return (
    <div className="w-full max-w-3xl space-y-4 md:space-y-6 print:space-y-0 overflow-x-hidden">
      {/* Top Action Buttons - Visible before scrolling */}
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

      {/* Letter Card - Mobile Optimized */}
      <Card id="letter-to-print" className="christmas-border print:christmas-border shadow-xl bg-gradient-to-b from-white via-christmas-cream to-white print:shadow-none print:bg-white overflow-hidden">
        <CardContent className="p-4 md:p-8 lg:p-12 print:p-3">
          {/* North Pole Header - Compact */}
          <div className="text-center mb-4 md:mb-5 print:mb-2 space-y-1 print:space-y-0.5">
            <div className="flex items-center justify-center gap-1.5 md:gap-2 mb-1 print:mb-1 flex-wrap">
              <Snowflake className="h-4 w-4 md:h-6 md:w-6 print:h-4 print:w-4 text-primary animate-spin print:animate-none flex-shrink-0" style={{ animationDuration: "10s" }} />
              <h1 className="text-2xl md:text-4xl lg:text-5xl print:text-3xl text-primary break-words">Santa's Workshop</h1>
              <Snowflake className="h-4 w-4 md:h-6 md:w-6 print:h-4 print:w-4 text-primary animate-spin print:animate-none flex-shrink-0" style={{ animationDuration: "10s" }} />
            </div>
            <p className="text-sm md:text-base lg:text-lg print:text-sm text-secondary font-semibold break-words">The North Pole, Arctic Circle</p>
            <p className="text-xs md:text-sm print:text-xs text-muted-foreground">{currentDate}</p>
          </div>

          <Separator className="mb-4 print:mb-2 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Letter Content - Mobile Optimized with proper text wrapping */}
          <div className="space-y-3 md:space-y-4 print:space-y-1 text-sm md:text-base lg:text-lg print:text-sm leading-relaxed print:leading-snug text-foreground break-words overflow-wrap-anywhere max-w-full">
            {letter.split('\n').map((line, index) => {
              // Check if line is a signature or important line
              const isSantaSignature = line.includes('Santa Claus');
              const isClosing = line.includes('With love') || line.includes('With hope');
              const isPS = line.startsWith('P.S.');
              
              return (
                <div key={index}>
                  {/* Add signature image before Santa Claus name */}
                  {isSantaSignature && (
                    <div className="flex justify-start mt-4 md:mt-6 print:mt-1 mb-1 print:mb-0.5">
                      <Image
                        src="/signature.png"
                        alt="Santa's Signature"
                        width={150}
                        height={60}
                        className="w-32 md:w-40 print:w-28 h-auto"
                        priority
                      />
                    </div>
                  )}
                  <p 
                    className={`break-words overflow-wrap-anywhere max-w-full ${
                      isSantaSignature ? 'font-bold text-lg md:text-xl print:text-base text-primary' : 
                      isClosing ? 'font-semibold mt-4 md:mt-6 print:mt-2' :
                      isPS ? 'text-xs md:text-sm print:text-xs italic' : 
                      ''
                    }`}
                  >
                    {line || '\u00A0'}
                  </p>
                </div>
              );
            })}
          </div>

          <Separator className="mt-6 md:mt-8 print:mt-2 bg-gradient-to-r from-transparent via-primary to-transparent" />

          {/* Footer Decoration - Compact */}
          <div className="mt-4 md:mt-6 print:mt-1.5 flex items-center justify-center gap-2 md:gap-4 print:gap-2 text-muted-foreground text-xs md:text-sm print:text-xs">
            <Snowflake className="h-3 w-3 md:h-4 md:w-4 print:h-3 print:w-3" />
            <span>Delivered with Christmas Magic</span>
            <Snowflake className="h-3 w-3 md:h-4 md:w-4 print:h-3 print:w-3" />
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

