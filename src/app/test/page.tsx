"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, Smartphone, Wifi, Globe, Code } from "lucide-react";
import { cn } from "@/lib/utils";

interface TestResult {
  name: string;
  status: "pending" | "running" | "success" | "error";
  message: string;
  details?: string;
}

export default function TestPage() {
  const [tests, setTests] = useState<TestResult[]>([
    { name: "Environment Detection", status: "pending", message: "Not run" },
    { name: "Network Connectivity", status: "pending", message: "Not run" },
    { name: "API Health Check", status: "pending", message: "Not run" },
    { name: "Letter Generation Test", status: "pending", message: "Not run" },
  ]);
  const [deviceInfo, setDeviceInfo] = useState<any>(null);

  useEffect(() => {
    // Detect device info
    const info = {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      isOnline: navigator.onLine,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
      },
    };
    setDeviceInfo(info);
  }, []);

  const updateTest = (index: number, updates: Partial<TestResult>) => {
    setTests((prev) =>
      prev.map((test, i) => (i === index ? { ...test, ...updates } : test))
    );
  };

  const runTests = async () => {
    // Test 1: Environment Detection
    updateTest(0, { status: "running", message: "Checking..." });
    await new Promise((resolve) => setTimeout(resolve, 500));
    updateTest(0, {
      status: "success",
      message: `${deviceInfo?.isMobile ? "Mobile" : "Desktop"} device detected`,
      details: `${deviceInfo?.platform} - ${deviceInfo?.viewport.width}x${deviceInfo?.viewport.height}`,
    });

    // Test 2: Network Connectivity
    updateTest(1, { status: "running", message: "Checking..." });
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (navigator.onLine) {
      updateTest(1, {
        status: "success",
        message: "Network is online",
        details: "Internet connection detected",
      });
    } else {
      updateTest(1, {
        status: "error",
        message: "Network is offline",
        details: "No internet connection",
      });
      return; // Stop if offline
    }

    // Test 3: API Health Check
    updateTest(2, { status: "running", message: "Testing API..." });
    try {
      const response = await fetch("/api/health");
      const data = await response.json();

      if (response.ok && data.status === "success") {
        updateTest(2, {
          status: "success",
          message: "API is working!",
          details: data.message,
        });
      } else {
        updateTest(2, {
          status: "error",
          message: "API check failed",
          details: data.message || data.details,
        });
        return; // Stop if API is not working
      }
    } catch (error) {
      updateTest(2, {
        status: "error",
        message: "API request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
      return;
    }

    // Test 4: Letter Generation Test
    updateTest(3, { status: "running", message: "Generating test letter..." });
    try {
      const response = await fetch("/api/generate-letter", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          childName: "Test User",
          goodThings: "Being helpful",
          badThings: "",
          isOnGoodList: true,
          additionalNotes: "This is a test",
          gifts: "A toy",
        }),
      });

      const data = await response.json();

      if (response.ok && data.letter) {
        updateTest(3, {
          status: "success",
          message: "Letter generated successfully!",
          details: `Generated ${data.letter.length} characters`,
        });
      } else {
        updateTest(3, {
          status: "error",
          message: "Letter generation failed",
          details: data.error || data.details || "Unknown error",
        });
      }
    } catch (error) {
      updateTest(3, {
        status: "error",
        message: "Letter generation request failed",
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const resetTests = () => {
    setTests((prev) =>
      prev.map((test) => ({ ...test, status: "pending", message: "Not run", details: undefined }))
    );
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-5 w-5 text-primary animate-spin" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-secondary" />;
      case "error":
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <div className="h-5 w-5 rounded-full border-2 border-muted" />;
    }
  };

  const allTestsPassed = tests.every((test) => test.status === "success");
  const anyTestRunning = tests.some((test) => test.status === "running");
  const anyTestFailed = tests.some((test) => test.status === "error");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-christmas-cream to-background p-4">
      <div className="max-w-4xl mx-auto space-y-6 py-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl text-primary">🧪 SantaScribe Test Suite</h1>
          <p className="text-muted-foreground">
            Diagnostic tools to verify your setup is working correctly
          </p>
        </div>

        {/* Device Info Card */}
        {deviceInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Device Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-semibold">Device Type:</span>{" "}
                  {deviceInfo.isMobile ? "Mobile 📱" : "Desktop 🖥️"}
                </div>
                <div>
                  <span className="font-semibold">Online:</span>{" "}
                  {deviceInfo.isOnline ? "Yes ✅" : "No ❌"}
                </div>
                <div>
                  <span className="font-semibold">Viewport:</span>{" "}
                  {deviceInfo.viewport.width} × {deviceInfo.viewport.height}
                </div>
                <div>
                  <span className="font-semibold">Platform:</span> {deviceInfo.platform}
                </div>
              </div>
              <div className="pt-2 border-t">
                <span className="font-semibold">User Agent:</span>
                <p className="text-xs text-muted-foreground mt-1 break-all">
                  {deviceInfo.userAgent}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <Button
                onClick={runTests}
                disabled={anyTestRunning}
                className="flex-1 christmas-gradient text-white"
                size="lg"
              >
                {anyTestRunning ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Running Tests...
                  </>
                ) : (
                  <>
                    <Code className="mr-2 h-5 w-5" />
                    Run All Tests
                  </>
                )}
              </Button>
              <Button onClick={resetTests} variant="outline" size="lg" disabled={anyTestRunning}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Results */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>
              {allTestsPassed && "All tests passed! ✅"}
              {anyTestFailed && "Some tests failed. Check details below."}
              {!allTestsPassed && !anyTestFailed && "Run tests to check your setup"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {tests.map((test, index) => (
              <div
                key={index}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-lg border-2 transition-all",
                  test.status === "success" && "bg-secondary/5 border-secondary",
                  test.status === "error" && "bg-destructive/5 border-destructive",
                  test.status === "running" && "bg-primary/5 border-primary",
                  test.status === "pending" && "bg-muted/30 border-muted"
                )}
              >
                <div className="flex-shrink-0 mt-1">{getStatusIcon(test.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="font-semibold">{test.name}</div>
                  <div
                    className={cn(
                      "text-sm",
                      test.status === "success" && "text-secondary",
                      test.status === "error" && "text-destructive",
                      test.status === "running" && "text-primary",
                      test.status === "pending" && "text-muted-foreground"
                    )}
                  >
                    {test.message}
                  </div>
                  {test.details && (
                    <div className="text-xs text-muted-foreground mt-1">{test.details}</div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Help Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">Need Help?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="font-semibold mb-2">If tests are failing:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>
                  Check if <code className="bg-background px-1 py-0.5 rounded">OPENAI_API_KEY</code>{" "}
                  is set in your environment variables
                </li>
                <li>Verify your OpenAI API key is valid and has credits</li>
                <li>Ensure you have a stable internet connection</li>
                <li>Try refreshing the page and running tests again</li>
                <li>Check browser console for additional error details</li>
              </ul>
            </div>
            <div className="pt-2 border-t">
              <p className="font-semibold mb-1">For Production/Vercel:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-muted-foreground">
                <li>Add environment variables in Vercel dashboard</li>
                <li>Redeploy after adding environment variables</li>
                <li>Check function logs in Vercel dashboard</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div className="flex gap-3 justify-center">
          <Button asChild variant="outline">
            <a href="/">← Back to Home</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/api/health" target="_blank" rel="noopener noreferrer">
              <Globe className="mr-2 h-4 w-4" />
              View API Health
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}

