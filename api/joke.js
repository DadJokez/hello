import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content:
            'Generate a single original dad joke. Respond with ONLY valid JSON in this exact format: {"question": "the setup", "punchline": "the punchline"}. No other text.',
        },
      ],
    });

    const text = message.content[0].text.trim();
    const joke = JSON.parse(text);

    res.setHeader("Cache-Control", "no-store");
    return res.status(200).json(joke);
  } catch (err) {
    console.error("Error generating joke:", err);
    return res.status(500).json({ error: "Failed to generate joke" });
  }
}
