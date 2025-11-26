"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, XCircle, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ApiStatus {
  status: "success" | "error" | "checking" | "idle";
  message: string;
  details?: string;
}

export function ApiStatusIndicator() {
  const [apiStatus, setApiStatus] = useState<ApiStatus>({
    status: "idle",
    message: "Not checked",
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkApiHealth = async () => {
    setIsChecking(true);
    setApiStatus({ status: "checking", message: "Checking OpenAI connection..." });

    try {
      const response = await fetch("/api/health");
      const data = await response.json();

      if (response.ok && data.status === "success") {
        setApiStatus({
          status: "success",
          message: "OpenAI API is working perfectly! ✨",
          details: data.message,
        });
      } else {
        setApiStatus({
          status: "error",
          message: data.message || "API check failed",
          details: data.details,
        });
      }
    } catch (error) {
      setApiStatus({
        status: "error",
        message: "Failed to check API status",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsChecking(false);
    }
  };

  // Auto-check on mount
  useEffect(() => {
    checkApiHealth();
  }, []);

  return (
    <Card
      className={cn(
        "border-2 transition-all duration-300",
        apiStatus.status === "success" && "border-secondary bg-secondary/5",
        apiStatus.status === "error" && "border-destructive bg-destructive/5",
        apiStatus.status === "checking" && "border-primary bg-primary/5",
        apiStatus.status === "idle" && "border-muted"
      )}
    >
      <CardContent className="pt-6">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="flex-shrink-0">
            {apiStatus.status === "checking" && (
              <Loader2 className="h-6 w-6 text-primary animate-spin" />
            )}
            {apiStatus.status === "success" && (
              <CheckCircle2 className="h-6 w-6 text-secondary" />
            )}
            {apiStatus.status === "error" && (
              <XCircle className="h-6 w-6 text-destructive" />
            )}
            {apiStatus.status === "idle" && (
              <AlertCircle className="h-6 w-6 text-muted-foreground" />
            )}
          </div>

          {/* Status Content */}
          <div className="flex-1 space-y-2">
            <div>
              <h3 className="font-semibold text-lg">OpenAI API Status</h3>
              <p
                className={cn(
                  "text-sm",
                  apiStatus.status === "success" && "text-secondary",
                  apiStatus.status === "error" && "text-destructive",
                  apiStatus.status === "checking" && "text-primary",
                  apiStatus.status === "idle" && "text-muted-foreground"
                )}
              >
                {apiStatus.message}
              </p>
              {apiStatus.details && (
                <p className="text-xs text-muted-foreground mt-1">{apiStatus.details}</p>
              )}
            </div>

            {/* Recheck Button */}
            <Button
              onClick={checkApiHealth}
              disabled={isChecking}
              variant="outline"
              size="sm"
              className="mt-2"
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Recheck Status"
              )}
            </Button>
          </div>
        </div>

        {/* Help Text for Errors */}
        {apiStatus.status === "error" && (
          <div className="mt-4 p-3 bg-muted rounded-lg text-xs space-y-1">
            <p className="font-semibold">Troubleshooting Tips:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Verify your API key in <code className="bg-background px-1 py-0.5 rounded">.env.local</code></li>
              <li>Ensure the key starts with <code className="bg-background px-1 py-0.5 rounded">sk-</code></li>
              <li>Check your OpenAI account has available credits</li>
              <li>Restart the development server after updating the key</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

