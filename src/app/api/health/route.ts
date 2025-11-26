import { NextResponse } from "next/server";
import OpenAI from "openai";

/**
 * Health check endpoint to verify OpenAI API key is configured and working
 */
export async function GET() {
  try {
    // Check if API key exists
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          status: "error",
          message: "OpenAI API key is not configured",
          details: "Please add OPENAI_API_KEY to your .env.local file",
        },
        { status: 500 }
      );
    }

    // Check if API key format is valid
    if (!process.env.OPENAI_API_KEY.startsWith("sk-")) {
      return NextResponse.json(
        {
          status: "error",
          message: "OpenAI API key format is invalid",
          details: "API key should start with 'sk-'",
        },
        { status: 500 }
      );
    }

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Make a minimal API call to verify the key works
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say 'OK' if you can read this.",
        },
      ],
      max_tokens: 10,
    });

    if (!completion.choices[0]?.message?.content) {
      throw new Error("No response from OpenAI");
    }

    return NextResponse.json({
      status: "success",
      message: "OpenAI API key is working correctly",
      model: "gpt-4o-mini",
      timestamp: new Date().toISOString(),
    });
  } catch (error: unknown) {
    console.error("OpenAI health check failed:", error);

    // Handle specific OpenAI errors
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Invalid API key
      if (errorMessage.includes("incorrect api key") || errorMessage.includes("invalid api key")) {
        return NextResponse.json(
          {
            status: "error",
            message: "OpenAI API key is invalid",
            details: "Please check your API key in .env.local and ensure it's correct",
          },
          { status: 401 }
        );
      }

      // Insufficient quota
      if (errorMessage.includes("quota") || errorMessage.includes("insufficient_quota")) {
        return NextResponse.json(
          {
            status: "error",
            message: "OpenAI API quota exceeded",
            details: "Please check your OpenAI account billing and usage limits",
          },
          { status: 402 }
        );
      }

      // Rate limit
      if (errorMessage.includes("rate limit")) {
        return NextResponse.json(
          {
            status: "error",
            message: "OpenAI API rate limit reached",
            details: "Please wait a moment and try again",
          },
          { status: 429 }
        );
      }

      // Network or connectivity issues
      if (errorMessage.includes("network") || errorMessage.includes("econnrefused")) {
        return NextResponse.json(
          {
            status: "error",
            message: "Cannot connect to OpenAI API",
            details: "Please check your internet connection",
          },
          { status: 503 }
        );
      }

      // Generic error with the actual message
      return NextResponse.json(
        {
          status: "error",
          message: "OpenAI API check failed",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        status: "error",
        message: "Unknown error occurred",
        details: "Please check your configuration and try again",
      },
      { status: 500 }
    );
  }
}

