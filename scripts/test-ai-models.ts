/**
 * Test script to compare Claude Sonnet vs Haiku for AI Coach
 * Run with: npx tsx scripts/test-ai-models.ts
 */

import "dotenv/config";

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

if (!ANTHROPIC_API_KEY) {
  console.error("❌ ANTHROPIC_API_KEY not found in environment");
  process.exit(1);
}

const systemPrompt = `You are Compass, a friendly and experienced career coach at Career Forward. You've helped hundreds of job seekers land their dream roles. You're warm, encouraging, and speak like a supportive mentor - not a robot.

About you:
- Your name is Compass because you help people find their direction
- You're conversational and genuine, like texting with a trusted advisor
- You celebrate wins, no matter how small
- You give honest feedback with kindness

Current user context:
## User Profile
- Name: Sarah Johnson
- Industry: Healthcare Administration
- Years of Experience: 3
- Career Goal: Transition to a senior role

## Current Scores
- Total Score: 62/100
- Resume Quality Score: 18/30
- Job Seeker Score: 44/70

## Active Recommendations
1. [HIGH] Improve resume formatting: Add clear section headers (+3 pts)
2. [MEDIUM] Add quantifiable achievements: Include metrics in experience (+5 pts)

How to communicate:
- Write in plain text only. Never use asterisks, bullet points, numbered lists, or any markdown formatting
- Keep it casual and warm, like you're chatting with a friend
- Keep responses focused - 2-3 short paragraphs`;

const testMessages = [
  "Hey! I just got my score and I'm a bit disappointed. What should I focus on first?",
  "I have an interview next week for a hospital administrator position. Any tips?",
  "How do I negotiate salary? I've never done it before and I'm nervous.",
];

async function callClaude(model: string, message: string): Promise<{ response: string; tokens: { input: number; output: number } }> {
  const startTime = Date.now();

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY!,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    }),
  });

  const result = await response.json();
  const elapsed = Date.now() - startTime;

  if (!response.ok) {
    throw new Error(`API error: ${JSON.stringify(result)}`);
  }

  return {
    response: result.content?.[0]?.text || "No response",
    tokens: {
      input: result.usage?.input_tokens || 0,
      output: result.usage?.output_tokens || 0,
    },
  };
}

function calculateCost(model: string, tokens: { input: number; output: number }): number {
  const pricing: Record<string, { input: number; output: number }> = {
    "claude-sonnet-4-20250514": { input: 3, output: 15 },
    "claude-3-5-haiku-20241022": { input: 0.8, output: 4 },
  };

  const rates = pricing[model] || { input: 0, output: 0 };
  return (tokens.input * rates.input + tokens.output * rates.output) / 1_000_000;
}

async function runTest() {
  console.log("🧪 AI Coach Model Comparison Test\n");
  console.log("=".repeat(60) + "\n");

  const models = [
    { id: "claude-sonnet-4-20250514", name: "Claude Sonnet 4" },
    { id: "claude-3-5-haiku-20241022", name: "Claude Haiku 3.5" },
  ];

  for (const message of testMessages) {
    console.log(`📝 USER: "${message}"\n`);
    console.log("-".repeat(60));

    for (const model of models) {
      console.log(`\n🤖 ${model.name.toUpperCase()}:`);

      try {
        const start = Date.now();
        const result = await callClaude(model.id, message);
        const elapsed = Date.now() - start;
        const cost = calculateCost(model.id, result.tokens);

        console.log(`\n${result.response}\n`);
        console.log(`⏱️  ${elapsed}ms | 📊 ${result.tokens.input} in / ${result.tokens.output} out | 💰 $${cost.toFixed(5)}`);
      } catch (error) {
        console.log(`❌ Error: ${error}`);
      }

      console.log("-".repeat(60));
    }

    console.log("\n" + "=".repeat(60) + "\n");
  }

  // Summary
  console.log("📊 COST SUMMARY (per 1000 users × 50 messages/month)\n");
  console.log("| Model          | Est. Monthly Cost |");
  console.log("|----------------|-------------------|");
  console.log("| Sonnet 4       | ~$400             |");
  console.log("| Haiku 3.5      | ~$80              |");
  console.log("\nHaiku is ~5x cheaper with similar conversational quality.");
}

runTest().catch(console.error);
