import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content:
            'Generate 10 original dad jokes. Each one must be unique and different from the others. Be creative and varied in topics (food, animals, work, science, sports, etc). Respond with ONLY a valid JSON array in this exact format: [{"question": "the setup", "punchline": "the punchline"}]. No other text, no code fences.',
        },
      ],
    });

    let text = message.content[0].text.trim();
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    const jokes = JSON.parse(text);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(jokes);
  } catch (err) {
    console.error("Error generating jokes:", err);
    return res.status(500).json({ error: "Failed to generate jokes" });
  }
}
