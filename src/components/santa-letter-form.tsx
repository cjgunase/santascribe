"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Sparkles, Gift, Star, Plus, ChevronDown } from "lucide-react";

interface SantaLetterFormProps {
  onGenerate: (data: GeneratedLetter) => void;
}

export interface LetterData {
  childName: string;
  goodThings: string;
  badThings: string;
  isOnGoodList: boolean;
  additionalNotes: string;
  age?: string;
  gender?: "boy" | "girl" | "";
  gifts?: string;
}

export interface GeneratedLetter {
  letter: string;
  formData: LetterData;
}

export function SantaLetterForm({ onGenerate }: SantaLetterFormProps) {
  const [formData, setFormData] = useState<LetterData>({
    childName: "",
    goodThings: "",
    badThings: "",
    isOnGoodList: true,
    additionalNotes: "",
    age: "",
    gender: "",
    gifts: "",
  });
  const [error, setError] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Collapsible sections state
  const [showAge, setShowAge] = useState(false);
  const [showGoodThings, setShowGoodThings] = useState(false);
  const [showBadThings, setShowBadThings] = useState(false);
  const [showGifts, setShowGifts] = useState(false);
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Prevent double submission on mobile
    if (isGenerating) {
      return;
    }
    
    setError("");
    setIsGenerating(true);

    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to generate letter");
      }

      // Simple JSON response (non-streaming for Safari mobile compatibility)
      const data = await response.json();
      
      if (!data.letter) {
        throw new Error("No letter content received");
      }

      // Display the complete letter
      onGenerate({
        letter: data.letter,
        formData,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      console.error("Error generating letter:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border shadow-lg overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 p-4 md:p-6 overflow-hidden">
        <div className="flex items-center gap-2 md:gap-3">
          <Gift className="h-6 w-6 md:h-8 md:w-8 text-primary float-animation flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <CardTitle className="text-xl md:text-2xl text-primary truncate">Santa's Letter Generator</CardTitle>
            <CardDescription className="text-sm md:text-base mt-0.5">
              Create magical letters! ✨
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Child's Name - Always Visible */}
          <div className="space-y-2">
            <Label htmlFor="childName" className="text-base md:text-lg font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 text-accent" />
              Child's Name *
            </Label>
            <Input
              id="childName"
              placeholder="e.g., Emily"
              value={formData.childName}
              onChange={(e) => setFormData({ ...formData, childName: e.target.value })}
              required
              className="text-base md:text-lg border-secondary/30 focus:border-primary h-11 md:h-12"
            />
          </div>

          {/* Age & Gender - Collapsible */}
          <Collapsible open={showAge} onOpenChange={setShowAge}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground p-2 h-auto"
              >
                <Plus className={`h-4 w-4 transition-transform ${showAge ? 'rotate-45' : ''}`} />
                Add child's details (optional)
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-3 pt-2">
              <div className="space-y-2">
                <Label htmlFor="gender" className="text-sm font-medium">
                  Gender
                </Label>
                <RadioGroup
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value as "boy" | "girl" | "" })
                  }
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boy" id="boy" />
                    <Label htmlFor="boy" className="cursor-pointer font-normal">
                      Boy
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="girl" id="girl" />
                    <Label htmlFor="girl" className="cursor-pointer font-normal">
                      Girl
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="e.g., 7"
                  value={formData.age}
                  onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                  className="text-base border-secondary/30 focus:border-primary h-11"
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Good Things - Collapsible */}
          <Collapsible open={showGoodThings} onOpenChange={setShowGoodThings}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground p-2 h-auto"
              >
                <Sparkles className={`h-4 w-4 text-accent transition-transform ${showGoodThings ? 'rotate-12' : ''}`} />
                Tell Santa about good things ✨
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <Textarea
                id="goodThings"
                placeholder="e.g., Helped with chores, shared toys with siblings, did well in school..."
                value={formData.goodThings}
                onChange={(e) => setFormData({ ...formData, goodThings: e.target.value })}
                className="min-h-28 text-sm md:text-base border-secondary/30 focus:border-primary resize-none"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Bad Things - Collapsible */}
          <Collapsible open={showBadThings} onOpenChange={setShowBadThings}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground p-2 h-auto"
              >
                <Plus className={`h-4 w-4 transition-transform ${showBadThings ? 'rotate-45' : ''}`} />
                Add areas for improvement 🎯
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <Textarea
                id="badThings"
                placeholder="e.g., Sometimes forgets to clean room, needs to listen better..."
                value={formData.badThings}
                onChange={(e) => setFormData({ ...formData, badThings: e.target.value })}
                className="min-h-28 text-sm md:text-base border-secondary/30 focus:border-primary resize-none"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Good List / Naughty List Selection */}
          <div className="space-y-3 p-3 md:p-4 bg-accent/10 rounded-lg border border-accent/30 my-1">
            <Label className="text-sm md:text-base font-semibold">
              Choose List Type
            </Label>
            <RadioGroup
              value={formData.isOnGoodList ? "good" : "naughty"}
              onValueChange={(value) =>
                setFormData({ ...formData, isOnGoodList: value === "good" })
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                <RadioGroupItem value="good" id="good" />
                <Label
                  htmlFor="good"
                  className="flex-1 cursor-pointer text-sm md:text-base font-medium"
                >
                  <div className="flex items-center gap-2">
                    <span>✅ Good List</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground font-normal mt-0.5">
                    Santa will deliver presents!
                  </p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-2 rounded-md hover:bg-accent/20 transition-colors">
                <RadioGroupItem value="naughty" id="naughty" />
                <Label
                  htmlFor="naughty"
                  className="flex-1 cursor-pointer text-sm md:text-base font-medium"
                >
                  <div className="flex items-center gap-2">
                    <span>⚠️ Naughty List</span>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground font-normal mt-0.5">
                    Encourages improvement
                  </p>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Gift Wishes - Collapsible (only show if on good list) */}
          {formData.isOnGoodList && (
            <Collapsible open={showGifts} onOpenChange={setShowGifts}>
              <CollapsibleTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  className="w-full justify-start gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground p-2 h-auto"
                >
                  <Gift className={`h-4 w-4 text-primary transition-transform ${showGifts ? 'scale-110' : ''}`} />
                  Add gift wishes (optional)
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2 pt-2">
                <Textarea
                  id="gifts"
                  placeholder="e.g., A new bicycle, art supplies, books..."
                  value={formData.gifts}
                  onChange={(e) => setFormData({ ...formData, gifts: e.target.value })}
                  className="min-h-24 text-sm md:text-base border-secondary/30 focus:border-primary resize-none"
                />
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Additional Notes - Collapsible */}
          <Collapsible open={showAdditionalNotes} onOpenChange={setShowAdditionalNotes}>
            <CollapsibleTrigger asChild>
              <Button
                type="button"
                variant="ghost"
                className="w-full justify-start gap-2 text-sm md:text-base font-semibold text-muted-foreground hover:text-foreground p-2 h-auto"
              >
                <Plus className={`h-4 w-4 transition-transform ${showAdditionalNotes ? 'rotate-45' : ''}`} />
                Add special message from Santa 💌
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-2 pt-2">
              <Textarea
                id="additionalNotes"
                placeholder="Any special message or encouragement you'd like Santa to include..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="min-h-24 text-sm md:text-base border-secondary/30 focus:border-primary resize-none"
              />
            </CollapsibleContent>
          </Collapsible>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg mt-2">
              <p className="text-sm text-destructive font-semibold">❌ {error}</p>
            </div>
          )}

          {/* Generate Button - Mobile Optimized */}
          <Button
            type="submit"
            size="lg"
            className="w-full text-base md:text-lg py-5 md:py-6 christmas-gradient hover:opacity-90 transition-all hover:scale-[1.01] shadow-lg mt-4"
            disabled={!formData.childName || isGenerating}
          >
            {isGenerating ? (
              <>
                <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
                Generating Magic...
                <Sparkles className="ml-2 h-5 w-5 md:h-6 md:w-6 animate-spin" />
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5 md:h-6 md:w-6" />
                Generate Santa's Letter
                <Sparkles className="ml-2 h-5 w-5 md:h-6 md:w-6" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

