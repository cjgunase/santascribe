# Cursor Rules Summary

This document provides an overview of the cursor rules created for the SantaScribe project.

## Created Rules

### 1. **ai-integration.mdc** (Always Applied)
**Purpose**: Core AI integration guidelines for the project

**Covers**:
- Current OpenAI SDK implementation
- Migration path to Vercel AI SDK
- Environment variable configuration
- Streaming vs non-streaming approaches
- Model selection guidance
- Error handling patterns
- Model parameters (temperature, max tokens)

**Key Features**:
- ✅ Always applied to every request
- 📚 Documents both current (OpenAI SDK) and recommended (Vercel AI SDK) approaches
- 🔧 Includes production configuration for Vercel deployment
- 🚨 Comprehensive error handling examples

### 2. **ai-text-generation.mdc** (Applied to API Routes & Lib)
**Purpose**: Best practices for AI text generation and prompt engineering

**Covers**:
- Prompt structure and engineering
- Dynamic prompt building
- Length and format specifications
- Temperature and token management
- Input/output validation
- Testing strategies
- Performance optimization
- Safety and content guidelines

**Key Features**:
- 📝 Applied specifically to `src/app/api/*/route.ts` and `src/lib/*.ts`
- 🎯 Practical examples from the Santa letter generator
- ⚠️ Common pitfalls to avoid
- 🧪 Testing recommendations

### 3. **api-routes.mdc** (Applied to API Routes)
**Purpose**: Guidelines for building Next.js API routes with AI integration

**Covers**:
- Route structure patterns
- Runtime configuration (nodejs vs edge)
- Request/response handling
- Comprehensive error handling
- Status code usage
- Validation patterns
- Environment variable checks
- Performance and security

**Key Features**:
- 🔧 Applied to `src/app/api/*/route.ts`
- 📋 Complete code templates
- 🔒 Security best practices
- ⚡ Performance optimization tips

### 4. **vercel-ai-sdk.mdc** (On-Demand Reference)
**Purpose**: Detailed Vercel AI SDK API reference and migration guide

**Covers**:
- `generateText` API complete reference
- `streamText` for streaming responses
- All configuration options
- Return value structure
- Provider configuration (OpenAI, AI Gateway)
- Available models
- Migration guide from OpenAI SDK
- Benefits of Vercel AI SDK

**Key Features**:
- 📖 Comprehensive API documentation
- 🔄 Side-by-side migration examples
- 🌐 AI Gateway integration patterns
- 🎯 Specific next steps for this project

## How These Rules Work

### Always Applied Rules
- **ai-integration.mdc** - Automatically loaded for every AI-related conversation

### Context-Specific Rules
- **ai-text-generation.mdc** - Loaded when working with API routes or library files
- **api-routes.mdc** - Loaded when working with API routes

### Manual/On-Demand Rules
- **vercel-ai-sdk.mdc** - Can be referenced when needed for detailed API information

## Using These Rules

### For AI Text Generation
When working on AI features, the assistant will automatically have access to:
1. Current implementation patterns (OpenAI SDK)
2. Best practices for prompt engineering
3. Error handling strategies
4. Migration path to Vercel AI SDK

### For API Development
When creating or modifying API routes, the assistant will know:
1. Proper route structure
2. Configuration exports for Vercel
3. Error handling patterns
4. Validation approaches

### For Migration to Vercel AI SDK
Reference the **vercel-ai-sdk.mdc** rule to:
1. See complete `generateText` API reference
2. Compare OpenAI SDK vs Vercel AI SDK
3. Get step-by-step migration instructions
4. Understand benefits and new features

## Quick Reference

### Current Stack
- **Framework**: Next.js 16 with React 19
- **AI Library**: OpenAI SDK (direct)
- **Model**: gpt-4o-mini
- **Deployment**: Vercel (nodejs runtime)

### Recommended Stack (Future)
- **Framework**: Next.js 16 with React 19
- **AI Library**: Vercel AI SDK (`ai` + `@ai-sdk/openai`)
- **Model**: gpt-4o-mini (via AI SDK)
- **Deployment**: Vercel (nodejs or edge runtime)

### Key Files Referenced
- [src/app/api/generate-letter/route.ts](../src/app/api/generate-letter/route.ts) - Main AI generation endpoint
- [src/components/santa-letter-form.tsx](../src/components/santa-letter-form.tsx) - Form component
- [src/components/ui/](../src/components/ui/) - shadcn/ui components

## Environment Variables

Required for AI features:
```env
# Current implementation (OpenAI SDK)
OPENAI_API_KEY=sk-...

# Future implementation (Vercel AI SDK)
# Can use same OPENAI_API_KEY or:
AI_GATEWAY_API_KEY=... # For AI Gateway
```

## Next Steps

1. **Continue with OpenAI SDK**: Current implementation is production-ready
2. **Migrate to Vercel AI SDK**: 
   - Install: `npm install ai @ai-sdk/openai`
   - Follow migration guide in **vercel-ai-sdk.mdc**
   - Update [src/app/api/generate-letter/route.ts](../src/app/api/generate-letter/route.ts)
3. **Implement Streaming**: Use `streamText` for better UX (desktop browsers)
4. **Add AI Gateway**: For multi-provider support and advanced routing

## Documentation Sources

All rules are based on:
- Official Vercel AI SDK documentation
- OpenAI API documentation
- Project-specific implementation patterns
- Next.js best practices

## Questions?

These rules will help the AI assistant understand your project's AI integration patterns and provide contextually appropriate suggestions. If you need to update or modify these rules, edit the `.mdc` files in the `.cursor/rules/` directory.

