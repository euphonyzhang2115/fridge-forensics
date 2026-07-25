const fs = require("fs");
const path = require("path");
const Anthropic = require("@anthropic-ai/sdk");

const envPath = path.join(__dirname, ".env.local");
const envContent = fs.readFileSync(envPath, "utf8");
const match = envContent.match(/^ANTHROPIC_API_KEY=(.*)$/m);
const apiKey = match && match[1] && match[1].trim();

if (!apiKey || apiKey === "paste-key-here") {
  console.error("Set a real key in .env.local (ANTHROPIC_API_KEY=...)");
  process.exit(1);
}

const client = new Anthropic({ apiKey });

async function main() {
  const response = await client.messages.create({
    model: "claude-opus-5",
    max_tokens: 100,
    messages: [{ role: "user", content: "say hello" }],
  });

  for (const block of response.content) {
    if (block.type === "text") {
      console.log(block.text);
    }
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
