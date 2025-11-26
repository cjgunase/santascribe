"use client";

import { ApiStatusIndicator } from "@/components/api-status-indicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background">
      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Admin Panel Header */}
        <Card className="mb-6 border-primary/20">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <div>
                <CardTitle>Admin Dashboard</CardTitle>
                <CardDescription>
                  System status and API health monitoring
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* API Status Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">API Status</h2>
          <ApiStatusIndicator />
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-muted">
          <p className="text-sm text-muted-foreground text-center">
            🔒 This page is for administrative purposes only
          </p>
        </div>
      </main>
    </div>
  );
}

