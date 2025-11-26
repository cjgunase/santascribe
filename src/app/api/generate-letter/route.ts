import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Vercel production configuration - CRITICAL for mobile Safari streaming
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // Maximum execution time in seconds

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { childName, age, gender, goodThings, badThings, isOnGoodList, additionalNotes, gifts } = body;

    // Validate required fields
    if (!childName) {
      return NextResponse.json(
        { error: "Child's name is required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file." },
        { status: 500 }
      );
    }

    // Build the prompt for OpenAI
    const prompt = buildPrompt({
      childName,
      age,
      gender,
      goodThings,
      badThings,
      isOnGoodList,
      additionalNotes,
      gifts,
    });

    // Call OpenAI API with streaming
    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Santa Claus writing SHORT, SWEET letters from the North Pole! Keep it BRIEF - just 3-4 short paragraphs max. Be enthusiastic and magical but GET TO THE POINT quickly. Write like you're talking to a kid - friendly, warm, and playful. Use age-appropriate vocabulary. Sprinkle in Christmas magic but keep it concise. Include specific details about them to make it personal. Remember: SHORT and SWEET is the goal - make every word count! 

IMPORTANT: Write in a classic, old-fashioned style. DO NOT use any emojis - keep the letter traditional and timeless, just like letters from Santa used to be written.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.9,
      max_tokens: 400,
      stream: true,
    });

    // Create a ReadableStream for the response - Vercel/Safari compatible
    const encoder = new TextEncoder();
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              const message = `data: ${JSON.stringify({ content })}\n\n`;
              controller.enqueue(encoder.encode(message));
            }
          }
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    // Vercel-optimized headers for mobile Safari streaming
    return new Response(readableStream, {
      status: 200,
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no', // Disable Nginx buffering
        'Transfer-Encoding': 'chunked', // Enable chunked transfer
      },
    });
  } catch (error: unknown) {
    console.error("Error generating letter:", error);
    
    // Handle specific OpenAI errors with helpful messages
    if (error instanceof Error) {
      const errorMessage = error.message.toLowerCase();

      // Invalid API key
      if (errorMessage.includes("incorrect api key") || errorMessage.includes("invalid api key")) {
        return NextResponse.json(
          {
            error: "Invalid API Key",
            details: "Your OpenAI API key is invalid. Please check your .env.local file and update the OPENAI_API_KEY.",
          },
          { status: 401 }
        );
      }

      // Insufficient quota
      if (errorMessage.includes("quota") || errorMessage.includes("insufficient_quota")) {
        return NextResponse.json(
          {
            error: "API Quota Exceeded",
            details: "You've reached your OpenAI usage limit. Please check your billing at https://platform.openai.com/account/billing",
          },
          { status: 402 }
        );
      }

      // Rate limit
      if (errorMessage.includes("rate limit")) {
        return NextResponse.json(
          {
            error: "Rate Limit Reached",
            details: "Too many requests. Please wait a moment and try again.",
          },
          { status: 429 }
        );
      }

      // Network issues
      if (errorMessage.includes("network") || errorMessage.includes("econnrefused") || errorMessage.includes("fetch failed")) {
        return NextResponse.json(
          {
            error: "Connection Error",
            details: "Cannot connect to OpenAI. Please check your internet connection.",
          },
          { status: 503 }
        );
      }

      // Generic error with the actual message
      return NextResponse.json(
        { error: "Failed to generate letter", details: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate letter", details: "An unknown error occurred" },
      { status: 500 }
    );
  }
}

function buildPrompt(data: {
  childName: string;
  age?: string;
  gender?: string;
  goodThings: string;
  badThings: string;
  isOnGoodList: boolean;
  additionalNotes: string;
  gifts?: string;
}) {
  const { childName, age, gender, goodThings, badThings, isOnGoodList, additionalNotes, gifts } = data;

  let prompt = `Write a personalized letter from Santa Claus to ${childName}`;
  
  // Add gender and age information
  if (gender && age) {
    prompt += `, a ${age}-year-old ${gender}`;
  } else if (gender) {
    prompt += `, a wonderful ${gender}`;
  } else if (age) {
    prompt += `, who is ${age} years old`;
  }
  
  prompt += `. The current date is ${new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })}.\n\n`;

  prompt += `IMPORTANT: Keep this SHORT and SWEET! Format the letter like this:
  
[Greeting with "Ho Ho Ho!" and their name]

[ONE paragraph about their year - mention 1-2 specific things they did well]

[ONE paragraph about their list status and any gifts (if applicable)]

[Quick closing with warmth and Christmas magic]

Santa Claus

[Short P.S. with one fun detail about the North Pole]

TOTAL LENGTH: 3-4 SHORT paragraphs maximum! Be concise but magical!

`;

  prompt += `Letter Details:\n`;
  prompt += `- List Status: ${isOnGoodList ? "GOOD LIST" : "NAUGHTY LIST"}\n`;

  if (goodThings) {
    prompt += `- Good things this year: ${goodThings}\n`;
  }

  if (badThings) {
    prompt += `- Areas for improvement: ${badThings}\n`;
  }

  if (gifts && isOnGoodList) {
    prompt += `- Requested gifts: ${gifts}\n`;
  }

  if (additionalNotes) {
    prompt += `- Special message to include: ${additionalNotes}\n`;
  }

  if (isOnGoodList) {
    prompt += `\nTone: SUPER EXCITED and proud! Celebrate their awesome behavior! Make them feel special! Keep it brief but genuine.`;
  } else {
    prompt += `\nTone: Still super friendly and believe in them 100%! Be encouraging and hopeful about next year. Keep it brief but caring.`;
  }

  prompt += `\n\nKEEP IT SHORT! 3-4 brief paragraphs max. Match the energy to the kid's age. Include 1-2 specific details about them. Add ONE fun North Pole detail. NO rambling - every sentence should count. Make it magical but CONCISE!`;

  return prompt;
}

