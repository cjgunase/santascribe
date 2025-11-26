# 🎅 SantaScribe

Create magical, personalized letters from Santa Claus using AI! SantaScribe uses OpenAI's GPT model to generate heartwarming, customized letters from the North Pole.

## ✨ Features

- 🎄 AI-generated personalized Santa letters
- 📝 Customize with child's name, age, good deeds, and areas for improvement
- 🎁 Include gift wishes for children on the good list
- 🖨️ Print-ready letter format with festive design
- ⚡ Built with Next.js 16, React 19, and shadcn/ui

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up your environment variables:

Create a `.env.local` file in the root directory:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

You can use `.env.example` as a reference.

### Verifying Your Setup

After setting up your API key, the app will **automatically verify** that your OpenAI API key is working when you load the page. You'll see a status indicator showing:
- ✅ Green = API key working perfectly
- ❌ Red = Issue detected with helpful error messages

For detailed testing and troubleshooting, see [API_TESTING.md](./API_TESTING.md).

### Running the Development Server

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🎨 Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Components**: shadcn/ui (New York style)
- **Styling**: Tailwind CSS v4
- **Icons**: lucide-react
- **AI**: OpenAI GPT-4o-mini
- **TypeScript**: Full type safety

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── generate-letter/    # OpenAI API route
│   ├── layout.tsx
│   └── page.tsx               # Main page
├── components/
│   ├── santa-letter-form.tsx  # Form component
│   ├── santa-letter-preview.tsx # Letter preview & print
│   └── ui/                    # shadcn/ui components
└── lib/
    └── utils.ts              # Utility functions
```

## 🔧 Configuration

The project uses shadcn/ui with the following configuration:
- Style: New York
- Base Color: Gray
- CSS Variables: Enabled for theming
- Path Aliases: `@/components`, `@/ui`, `@/lib`

See `components.json` for full configuration.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
